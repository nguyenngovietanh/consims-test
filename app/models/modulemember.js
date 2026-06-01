const senserver = require("../models/senserver.js");
// module.js
/*
        {
            "UserId": 3815,
            "ModuleId": 33
        }
*/
const meta = [
  { field: 'Id', type: 'bigint', description: 'Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'ModuleId', type: 'bigint', description: 'Module ID', key: false, isnullable: true, show: false, visible: false },
  { field: 'UserId', type: 'bigint', description: 'User ID', key: false, isnullable: true, show: false, visible: false }
]
//nếu meta không có trường key=true thì gán trường đầu tiên trong meta
if (!meta.some(field => field.key)) { meta[0].key = true; }
const keyField = meta.find(field => field.key);

class Model {
  constructor({ Id, ModuleId, UserId } = {}) {
    this.Id = Id ?? 0;
    this.ModuleId = ModuleId ?? 0;
    this.UserId = UserId ?? 0;
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
const getMemberByModuleList = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortField = req.query.sortfield;
  const sortType = req.query.sorttype;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  return await getMemberByModuleDatas({ req, page, pagesize, sortField, sortType, filterConditions });
}

const getModuleByMemberList = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortField = req.query.sortfield;
  const sortType = req.query.sorttype;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  return await getModuleByMemberDatas({ req, page, pagesize, sortField, sortType, filterConditions });
}


const getLookup = async ({ req }) => {
  return await getList({ req });
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
      "ModuleId": newdata.ModuleId,
      "ApplyInheritance": "Yes",
      "UpdateMode": "upsert_user_module",
      "Permissions": [
        {
          "UserId": newdata.UserId,
          "C_R": "Yes",
          "R_R": "Yes",
          "U_R": "Yes",
          "D_R": "Yes"
        }
      ]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/assign-user-module`;
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
}

// Hàm để cập nhật data
const updateData = async ({ req, data }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const updatedata = senserver.utils.convertReqBodyToObject(req.body, meta);
  updatedata.UserId = req.query.UserId;

  //xóa
  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "SessionId": req.session.sessionid,
      "ModuleId": updatedata.ModuleId,
      "ApplyInheritance": "Yes",
      "UpdateMode": "remove_user_from_module",
      "Permissions": [
        {
          "UserId": updatedata.UserId
        }
      ]
    }
  });

  const urldelete = `${req.app.locals.env.api.host}/api/assign-user-module`;
  const response = await fetch(urldelete, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidatadelete = await response.json();
  if (apidatadelete.Success !== 'true') {
    //console.log(`Error deleting client: ${data} params: ${para}`);
    throw new Error(`${apidatadelete.Message}`);
  }
  //thêm mới
  //chuyên đổi req.body sang Object
  const newdata = senserver.utils.convertReqBodyToObject(req.body, meta);
  newdata.UserId = req.query.UserId;
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: newdata, meta: meta });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }
  //cập nhật bằng api
  const paraadd = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "ModuleId": newdata.ModuleId,
      "ApplyInheritance": "Yes",
      "UpdateMode": "upsert_user_module",
      "Permissions": [
        {
          "UserId": newdata.UserId,
          "C_R": req.body["C_R"] == 'true' ? "Yes" : "No",
          "R_R": req.body["R_R"] == 'true' ? "Yes" : "No",
          "U_R": req.body["U_R"] == 'true' ? "Yes" : "No",
          "D_R": req.body["D_R"] == 'true' ? "Yes" : "No"
        }
      ]
    }
  });
  const urladd = `${req.app.locals.env.api.host}/api/assign-user-module`;
  const responseadd = await fetch(urladd, { method: "POST", headers: req.app.locals.env.api.headerpost, body: paraadd });
  const apidataadd = await responseadd.json();
  if (apidataadd.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidataadd.Message;
    resdata.errors = apidataadd.Errors || {};
    return resdata;
  }
  resdata.data = apidataadd.Data && apidataadd.Data.length > 0 ? apidataadd.Data[0] : null;
  resdata.apipara = paraadd;
  //kết thúc //cập nhật bằng api
  if (!resdata.data) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
  return resdata;
}

// Hàm để xóa data
const deleteData = async ({ req, id }) => {
  const UserId = req.query.UserId || 0;
  const ModuleId = req.query.ModuleId || 0;
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "ModuleId": ModuleId,
      "ApplyInheritance": "Yes",
      "UpdateMode": "remove_user_from_module",
      "Permissions": [
        {
          "UserId": UserId
        }
      ]
    }
  });

  const url = `${req.app.locals.env.api.host}/api/assign-user-module`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') {
    //console.log(`Error deleting client: ${data} params: ${para}`);
    throw new Error(`${data.Message}`);
  }
  return { status: 1, message: data.Message, row: data.Data || {} };
}

// Hàm để tìm theo trường tùy chỉnh
const findByField = async ({ field, value }) => {
  return datas.find(data => data[field] === value);
};
// Hàm tìm theo khóa
const findByKey = async ({ req, value }) => {
  const id = req.query[keyField.field] || 0;
  const para = JSON.stringify({ "ModuleType": "All", "DisplayMode": "full_list", "LogIn": req.session.user.username, "ModuleId": id, "SessionId": req.session.sessionid });
  const url = `${req.app.locals.env.api.host}/api/get-client-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  const result = data.Data && data.Data.length > 0 ? data.Data[0] : null;
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
  const para = JSON.stringify({
    "ModuleType": "All",
    "DisplayMode": "full_list",
    "SessionId": req.session.sessionid,
    "LogIn": req.session.user.username,
    "Keyword": keyword
  });
  const url = `${req.app.locals.env.api.host}/api/get-client-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}

//Hàm lấy danh sách member bởi client
const getMemberByModuleDatas = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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

  const id = parseInt(req.query.id) || 0;
  //params:{"DisplayMode":"simple_list","UserId":176138,"LogIn":"lotusviet@lotusviet.vn"}
  const para = JSON.stringify({
    "ModuleId": id,
    "DisplayMode": "simple_list",
    "ActivateStatus": "All",
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "PageNum": page,
    "PageSize": pagesize
  });
  const url = `${req.app.locals.env.api.host}/api/get-user-permission?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}


//Hàm lấy danh sách member bởi client
const getModuleByMemberDatas = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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

  const id = parseInt(req.query.id) || 0;
  //params:{"DisplayMode":"simple_list","UserId":176138,"LogIn":"lotusviet@lotusviet.vn"}
  const para = JSON.stringify({
    "DisplayMode": "simple_list",
    "UserId": id,
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid
  });
  const url = `${req.app.locals.env.api.host}/api/get-user-permission?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
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
  getMemberByModuleDatas,
  postCreate,
  postEdit,
  postDelete,
  getList,
  getLookup,
  getCreate,
  getEdit,
  getMemberByModuleList,
  getModuleByMemberList,
};
