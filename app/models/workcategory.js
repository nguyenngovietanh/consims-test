const senserver = require("../models/senserver.js");
// senobject.js
//dùng để làm mẫu đại diện cho các đối tượng trong hệ thống
//để có thể sử dụng chung cho các đối tượng khác nhau 

//khai báo meta cho đối tượng này
const meta = [
  { field: 'WorkCatId', type: 'bigint', description: 'WorkCat Id', key: true, isnullable: true, show: false, visible: true },
  { field: 'Code', type: 'string', description: 'Code', key: false, isnullable: true, show: true, visible: true },
  { field: 'Description', type: 'string', description: 'Description', isnullable: true, show: true, visible: true },
  { field: 'Alias', type: 'string', description: 'Alias', isnullable: true, show: true, visible: true },
  { field: 'Type', type: 'string', description: 'Type', isnullable: true, show: true, visible: true },
  { field: 'IsActive', type: 'string', description: 'Active', isnullable: true, show: true, visible: true }
]
//nếu meta không có trường key=true thì gán trường đầu tiên trong meta
if (!meta.some(field => field.key)) { meta[0].key = true; }
const keyField = meta.find(field => field.key);

class Model {
  constructor({ WorkCatId, Code, Description, Alias, Type, IsActive } = {}) {
    this.WorkCatId = WorkCatId ?? 0;
    this.Code = Code ?? '';
    this.Description = Description ?? '';
    this.Alias = Alias ?? '';
    this.Type = Type ?? 'construction_work';
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
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  //chuyên đổi req.body sang SenObject
  const newdata = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: newdata, meta: meta });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }

  //Kiểm tra đối tượng đã tồn tại chưa
  if (newdata[keyField.field] && await findByKey({ req, value: parseInt(newdata[keyField.field]) })) {
    resdata.status = 0;
    resdata.message = 'Object exists';
    resdata.errors[keyField.field] = `${keyField.description} exists`;
    return resdata;
  }
  //Kiểm tra nghiệp vụ khác nếu cần
  resdata.data = await addData({ req, data: newdata });
  if (!resdata.data) { return { status: 0, message: "Object not created", errors: "Object not created" }; }
  return resdata;
}

const getEdit = async ({ req }) => {
  const result = await findByKey({ req, value: parseInt(req.query[keyField.field]) });
  if (!result) { throw new Error("Object not found"); }
  return result;
}

const postEdit = async ({ req }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const updatedata = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: updatedata, meta: meta });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }
  resdata.data = await updateData({ req, data: updatedata });
  if (!resdata.data) {
    return { status: 0, message: "Object not found", errors: "Object not found" };
  }
  return resdata;
}

const postDelete = async ({ req }) => {
  const id = parseInt(req.params.id);
  const result = await deleteData({ req, id });
  if (!result) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
  return { status: 1, message: "Object deleted successfully", row: result };
}

const getList = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortFields = req.query.sortfield;
  const sortTypes = req.query.sorttype;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  return await getDatas({ req, page, pagesize, sortFields, sortTypes, filterConditions });
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
      "UpdateMode": "update",
      "Language": "vi",
      "Type": newdata.Type,
      "WorkCat": [
        {
          "Code": newdata.Code,
          "Alias": newdata.Alias,
          "Description": newdata.Description,
          "IsActive": newdata.IsActive
        }
      ]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-work-category`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  if (apidata.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata.Message;
    resdata.errors = apidata.Errors || {};
    return resdata;
  }
  resdata.data = await findByKey({ req, value: apidata.Data[0][keyField.field] }) || {};
  //resdata.data = apidata.Data && apidata.Data.length > 0 ? apidata.Data[0] : null;
  resdata.apipara = para;
  return resdata;
}

// Hàm để xóa data
const deleteData = async ({ req, id }) => {
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "UpdateMode": "delete",
      "WorkCat": [{ "WorkCatId": id }]
    }
  });

  const url = `${req.app.locals.env.api.host}/api/upsert-work-category`;
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
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "UpdateMode": "update",
      "Language": "vi",
      "Type": updatedata.Type,
      "WorkCat": [
        {
          "WorkCatId": updatedata.WorkCatId,
          "Code": updatedata.Code,
          "Alias": updatedata.Alias,
          "Description": updatedata.Description,
          "IsActive": updatedata.IsActive
        }
      ]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-work-category`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  if (apidata.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata.Message;
    resdata.errors = apidata.Errors || {};
    return resdata;
  }
  //kết thúc //cập nhật bằng api
  resdata.data = await findByKey({ req, value: apidata.Data[0][keyField.field] }) || {};

  if (!resdata.data) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
  return resdata;
}
// Hàm để tìm theo trường tùy chỉnh
const findByField = async ({ field, value }) => {
  return datas.find(data => data[field] === value);
};
// Hàm tìm theo khóa
const findByKey = async ({ req, value }) => {
  //nếu value khác undefined thì gán id = value và nếu không thì lấy id từ req.query
  if (value === undefined) { value = req.query[keyField.field]; }
  const id = value || 0;
  const para = JSON.stringify({ "LogIn": "", "DisplayMode": "full_list", "WorkCatId": id });
  const url = `${req.app.locals.env.api.host}/api/get-work-category?params=${encodeURIComponent(para)}`;
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
    "Type": "construction_work",
    "DisplayMode": "full_list",
    "Keyword": keyword
  });
  const url = `${req.app.locals.env.api.host}/api/get-work-category?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = 0;
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
  postCreate,
  postEdit,
  postDelete,
  getList,
  getLookup,
  getCreate,
  getEdit,
};
