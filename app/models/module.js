const senserver = require("../models/senserver.js");
// module.js

const meta = [
  { field: 'ModuleId', type: 'bigint', description: 'Module Id', key: true, isnullable: true, show: false, visible: true },
  {
    field: 'ParentId', type: 'bigint', description: 'Parent Id', isnullable: true, show: false, visible: true,
    lookup: {
      url: '/module/lookup',
      fields: { id: '`${item.ModuleId}`', value: '`${item.ModuleId}`', label: '`${item.ModuleId}-${item.Description}`' },
      filter: { logic: "and", conditions: [{ field: "searchTerm", op: "includes", value: '' }] },
      pagesize: 10
    }
  },
  { field: 'Code', type: 'string', description: 'Code', isnullable: true, show: true, visible: true },
  { field: 'Description', type: 'string', description: 'Description', isnullable: false, show: true, visible: true },
  { field: 'Alias', type: 'string', description: 'Alias', isnullable: true, show: true, visible: true },
  { field: 'ParentAlias', type: 'string', description: 'Parent Alias', isnullable: true, show: false, visible: true },
  { field: 'IsActive', type: 'string', description: 'Active', isnullable: true, show: true, visible: true }
]
//nếu meta không có trường key=true thì gán trường đầu tiên trong meta
if (!meta.some(field => field.key)) { meta[0].key = true; }
const keyField = meta.find(field => field.key);

class Model {
  constructor({ ModuleId, ParentId, Code, Description, Alias, ParentAlias, IsActive } = {}) {
    this.ModuleId = ModuleId ?? 0;
    this.ParentId = ParentId ?? 0;
    this.Code = Code ?? '';
    this.Description = Description ?? '';
    this.Alias = Alias ?? '';
    this.ParentAlias = ParentAlias ?? '';
    this.IsActive = IsActive ?? 'Yes';
  }
}

// Lưu trữ các data trong bộ nhớ
const datas = [];

const getCreate = async ({ req }) => {
  if (req.query.id) { return await findByKey({ req, value: parseInt(req.query.id) }) || {}; }
  else { return new Model(); }
}

// Hàm để tạo dữ liệu từ controller
const postCreate = async ({ req }) => {
  return await addData({ req });
}

const getEdit = async ({ req }) => {
  const result = await findByKey({ req, value: parseInt(req.query[keyField.field]) });
  if (!result) { throw new Error("Object not found"); }
  return result;
}

const postEdit = async ({ req }) => {
  return await updateData({ req });
}

const postDelete = async ({ req }) => {
  return await deleteData({ req });
}

const getList = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortField = req.query.sortfield;
  const sortType = req.query.sorttype;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  return await getDatas({ req, page, pagesize, sortField, sortType, filterConditions });
}

const getLookup = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortField = req.query.sortfield;
  const sortType = req.query.sorttype;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  return await getLookupDatas({ req, page, pagesize, sortField, sortType, filterConditions });
}
// Hàm để thêm data mới
const addData = async ({ req, data }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  //chuyên đổi req.body sang Object
  const newdata = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: newdata, meta: meta });
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
      "UpdateMode": "update",
      "ParentId": newdata.ParentId || null,
      "Modules": [
        {
          "Code": newdata.Code,
          "Description": newdata.Description,
          "Alias": newdata.Alias,
          "IsActive": newdata.IsActive
        }
      ]
    }
  });

  const url = `${req.app.locals.env.api.host}/api/upsert-module`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  if (apidata.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata.Message;
    resdata.errors = apidata.Errors || {};
    return resdata;
  }
  resdata.data = apidata.Data && apidata.Data.length > 0 ? apidata.Data[0] : null;
  resdata.apipara = para;
  return resdata;

  // const newdata = new Model(data);
  // datas.push(newdata);
  // return newdata;
}
// Hàm để xóa data
const deleteData = async ({ req, id }) => {
  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "SessionId": req.session.sessionid,
      "UpdateMode": "delete",
      "Modules": [{ "ModuleId": req.params.id }]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-module`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  return { status: 1, message: data.Message, row: data.Data || {} };
}
// Hàm để cập nhật data
const updateData = async ({ req, data }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const updatedata = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: updatedata, meta: meta || [] });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }

  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "SessionId": req.session.sessionid,
      "UpdateMode": "update",
      "ParentId": updatedata.ParentId || null,
      "Modules": [
        {
          "ModuleId": updatedata.ModuleId,
          "Code": updatedata.Code,
          "Description": updatedata.Description,
          "Alias": updatedata.Alias,
          "IsActive": updatedata.IsActive
        }
      ]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-module`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  if (apidata.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata.Message;
    resdata.errors = apidata.Errors || {};
    return resdata;
  }
  //kết thúc //cập nhật bằng api
  if (!resdata.data) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
  return resdata;

}
// Hàm để tìm theo trường tùy chỉnh
const findByField = async ({ field, value }) => {
  return datas.find(data => data[field] === value);
};
// Hàm tìm theo khóa
const findByKey = async ({ req, value }) => {
  const id = req.query[keyField.field] || 0;
  const para = JSON.stringify({ "LogIn": req.session.user.username, "DisplayMode": "full_list", "ActiveOnly": "No", "ModuleId": id, "SessionId": req.session.sessionid });
  const url = `${req.app.locals.env.api.host}/api/get-module-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  const result = data.Data && data.Data.length > 0 ? data.Data[0] : null;

  //nếu có ParentId thì lấy thông tin Parent Module
  if (result && result.ParentId) {
    const parentPara = JSON.stringify({ "LogIn": req.session.user.username, "DisplayMode": "full_list", "ActiveOnly": "No", "ModuleId": result.ParentId, "SessionId": req.session.sessionid });
    const parentUrl = `${req.app.locals.env.api.host}/api/get-module-list?params=${encodeURIComponent(parentPara)}`;
    const parentResponse = await fetch(parentUrl);
    const parentData = await parentResponse.json();
    if (parentData.Success === 'true') {
      result.ParentModule = parentData.Data && parentData.Data.length > 0 ? parentData.Data[0] : null;
    }
  }


  return result || {};

}
// Hàm để lấy tất cả data
const getAllDatas = async () => {
  return datas;
}
//Hàm lấy danh sách data với phân trang và sắp xếp
const getDatas = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  //params:{"LogIn":"","DisplayMode":"full_list", "Keyword":""}
  const para = JSON.stringify({ "DisplayMode": "full_list", "LogIn": req.session.user.username, "Keyword": keyword ,"SessionId": req.session.sessionid});
  const url = `${req.app.locals.env.api.host}/api/get-module-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}

//Hàm lấy danh sách data với phân trang và sắp xếp cho lookup
const getLookupDatas = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  if (pagesize == 0) pagesize = 10;
  //params:{"DisplayMode":"dropdown_list","PageNum":1,"PageSize":50,"Keyword":"a","LogIn":"lotusviet@lotusviet.vn"}
  //params:{"DisplayMode":"dropdown_list","PageNum":1,"PageSize":50,"Keyword":"client","LogIn":"lotusviet@lotusviet.vn"}
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "PageSize": pagesize,
    "PageNum": page,
    "ClientId": null,
    "DisplayMode": "dropdown_list",
    "Keyword": keyword,
  });

  const url = `${req.app.locals.env.api.host}/api/get-module-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}


for (let i = 1; i <= 25; i++) {
  datas.push(new Model({
    ModuleId: i,
    ParentId: i % 5 === 0 ? null : Math.floor(i / 5),
    Code: `MOD${i.toString().padStart(3, '0')}`,
    Description: `Module Description ${i}`,
    Alias: `Alias${i}`,
    ParentAlias: i % 5 === 0 ? '' : `Alias${Math.floor(i / 5)}`,
    IsActive: i % 2 === 0 ? 'Yes' : 'No'
  }));
}

// Xuất các hàm và lớp để sử dụng ở nơi khác
module.exports = {
  meta,
  data: Model,
  datas,
  addData,
  deleteData,
  updateData,
  findByField,
  findByKey,
  getAllDatas,
  getDatas,
  postCreate,
  postEdit,
  postDelete,
  getList,
  getLookup,
  getCreate,
  getEdit,
};
