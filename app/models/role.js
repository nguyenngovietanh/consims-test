const senserver = require("../models/senserver.js");
// role.js
/*
  {
      "RoleId": 589,
      "Code": "",
      "RoleName": "COMPANY ADMIN",
      "Alias": "admin",
      "IsActive": "TRUE",
      "RoleType": "system"
  }
*/

class Role {
  constructor({ RoleId, Code, RoleName, Alias, IsActive, RoleType, WorkingPlace } = {}) {
    this.RoleId = RoleId ?? 0;
    this.Code = Code ?? '';
    this.RoleName = RoleName ?? '';
    this.Alias = Alias ?? '';
    this.IsActive = IsActive ?? 'Yes';
    this.RoleType = RoleType ?? 'system';
    this.WorkingPlace = WorkingPlace ?? 'Others';
  }
}


//thêm trường isnullable vào meta
// để xác định trường nào có thể để trống
// và trường nào là bắt buộc
const meta = [
  { field: 'RoleId', type: 'bigint', description: 'Role Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'Code', type: 'string', description: 'Code', isnullable: true, show: true, visible: true },
  { field: 'RoleName', type: 'string', description: 'Role Name', isnullable: false, show: true, visible: true },
  { field: 'Alias', type: 'string', description: 'Alias', isnullable: true, show: true, visible: true },
  { field: 'RoleType', type: 'string', description: 'Role Type', isnullable: true, show: true, visible: false },
  { field: 'WorkingPlace', type: 'string', description: 'Working Place', isnullable: true, show: true, visible: true },
  { field: 'IsActive', type: 'string', description: 'Active', isnullable: true, show: true, visible: true }
];

const datas = []; // Lưu trữ các role trong bộ nhớ

const getDatas = async ({ req }) => {
  // Lấy tất cả các role từ mô hình theo phân trang
  const page = parseInt(req.query.page) || 1;
  const pagesize = parseInt(req.query.pagesize) || 10;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  let keyword = '';
  //nếu filterConditions không là đối tượng rỗng thì thêm vào điều kiện lọc
  if (Object.keys(filterConditions).length > 0) {
    //nếu filterConditions.Conditions là mảng thì thêm vào điều kiện lọc
    if (Array.isArray(filterConditions.conditions)) {
      //tìm điều kiện trường searchTerm có thì gán nếu không thì cho =''
      const keywordCondition = filterConditions.conditions.find(cond => cond.field === 'searchTerm');
      //nếu keywordCondition có thì gán giá trị cho keyword
      if (keywordCondition) { keyword = keywordCondition.value; }
    }
  }

  const para = JSON.stringify({
    "ActiveRoleOnly": null,
    "DisplayMode": "full_list",
    "Language": "vi",
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Keyword": keyword
  });
  const url = `${req.app.locals.env.api.host}/api/get-role-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };

};

// Hàm để tìm theo trường tùy chỉnh
const findByField = (field, value) => {
  return datas.find(data => data[field] === value);
};
// Hàm tìm theo khóa
const findByKey = async ({ req }) => {
  const id = req.query.RoleId || 0;
  const para = JSON.stringify({
    "ActiveRoleOnly": null,
    "DisplayMode": "full_list",
    "Language": "vi",
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Keyword": "",
    "RoleId": id
  });
  const url = `${req.app.locals.env.api.host}/api/get-role-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  const result = data.Data && data.Data.length > 0 ? data.Data[0] : null;
  return result || {};

}

// Hàm để thêm mới 
const addData = async ({ req, meta }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  //chuyên đổi req.body sang Object
  const newObject = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: newObject, meta: meta || [] });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }

  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "WSId": req.app.locals.env.api.WSId,
      "SessionId": req.session.sessionid,
      "UpdateMode": "update",
      "Roles": [
        {
          "RoleId": null,
          "Code": newObject.Code,
          "RoleName": newObject.RoleName,
          "Alias": newObject.Alias,
          "IsActive": newObject.IsActive,
          //"RoleType": newObject.RoleType,
          "WorkingPlace": newObject.WorkingPlace || "",
        }
      ]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-role-list`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') {
    resdata.status = 0;
    resdata.message = data.Message;
    resdata.errors = data.Errors || {};
    return resdata;
  }
  resdata.data = data.Data && data.Data.length > 0 ? data.Data[0] : null;
  resdata.apipara = para;
  return resdata;

};


// Hàm để cập nhật role
const updateData = async ({ req, meta }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const updateObject = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: updateObject, meta: meta || [] });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }

  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "WSId": req.app.locals.env.api.WSId,
      "UpdateMode": "update",
      "Roles": [
        {
          "RoleId": updateObject.RoleId,
          "Code": updateObject.Code,
          "RoleName": updateObject.RoleName,
          "Alias": updateObject.Alias,
          "IsActive": updateObject.IsActive,
          //"RoleType": updateObject.RoleType,
          "WorkingPlace": updateObject.WorkingPlace || "",
        }
      ]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-role-list`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') {
    resdata.status = 0;
    resdata.message = data.Message;
    resdata.errors = data.Errors || {};
    return resdata;
  }
  //kết thúc //cập nhật bằng api
  if (!resdata.data) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
  return resdata;
};

// Hàm để xóa data
const deleteData = async (req) => {
  //api
  const id = req.params.id;
  const para = JSON.stringify({ "params": { "LogIn": req.session.user.username, "SessionId": req.session.sessionid, "UpdateMode": "delete", "Roles": [{ "RoleId": id }] } });
  const url = `${req.app.locals.env.api.host}/api/upsert-role-list`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  return { status: 1, message: data.Message, row: data.Data || {} };
};

module.exports = {
  data: Role,
  meta,
  datas,
  getDatas,
  addData,
  findByKey,
  findByField,
  updateData,
  deleteData
};


