const senserver = require("../models/senserver.js");
const option = require("../models/option.js");
// module.js
/**/

const meta = [
  { field: 'UserId', type: 'bigint', description: 'User ID', key: true, isnullable: true, show: false, visible: true },
  { field: 'FullName', type: 'string', description: 'Full Name', isnullable: true, show: true, visible: true },
  { field: 'Account', type: 'string', description: 'Account', isnullable: true, show: true, visible: true },
  { field: 'IsActive', type: 'string', description: 'Active', isnullable: true, show: true, visible: true },
  { field: 'JobTitle', type: 'string', description: 'Job Title', isnullable: true, show: true, visible: true },
  { field: 'Email', type: 'string', description: 'Email', isnullable: false, show: true, visible: true },
  { field: 'PhoneDirect', type: 'string', description: 'Phone Direct', isnullable: true, show: true, visible: true },
  { field: 'IsPrimary', type: 'string', description: 'Primary', isnullable: true, show: true, visible: true },
  { field: 'Sex', type: 'string', description: 'Sex', isnullable: true, show: true, visible: true, data: option.sexlist },
  { field: 'BirthDay', type: 'string', description: 'Birthday', isnullable: true, show: true, visible: true },
  { field: 'Address', type: 'string', description: 'Address', isnullable: true, show: true, visible: true },
  { field: 'NativeLanguage', type: 'string', description: 'Native Language', isnullable: true, show: true, visible: true },
  { field: 'Gmail', type: 'string', description: 'Gmail', isnullable: true, show: true, visible: true },
  // { field: 'ClientId', type: 'bigint', description: 'Client ID', isnullable: true, show: false, visible: false },
  { field: 'Password', type: 'string', description: 'Password', isnullable: true, show: false, visible: false },
  { field: 'ConfirmPassword', type: 'string', description: 'Confirm Password', isnullable: true, show: false, visible: false }
]
//nếu meta không có trường key=true thì gán trường đầu tiên trong meta
if (!meta.some(field => field.key)) { meta[0].key = true; }
const keyField = meta.find(field => field.key);

class Model {
  constructor({ UserId, FullName, Account, IsActive, JobTitle, Email, PhoneDirect, IsPrimary, Sex, BirthDay, Address, NativeLanguage, Gmail, Password, ConfirmPassword } = {}) {
    this.UserId = UserId ?? 0;
    this.FullName = FullName ?? '';
    this.Account = Account ?? '';
    this.IsActive = IsActive ?? 'Yes';
    this.JobTitle = JobTitle ?? '';
    this.Email = Email ?? '';
    this.PhoneDirect = PhoneDirect ?? '';
    this.IsPrimary = IsPrimary ?? 'No';
    this.Sex = Sex ?? '';
    this.BirthDay = BirthDay ?? '1900-01-01';
    this.Address = Address ?? '';
    this.NativeLanguage = NativeLanguage ?? '';
    this.Gmail = Gmail ?? '';
    this.Password = Password ?? '';
    this.ConfirmPassword = ConfirmPassword ?? '';
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
// Hàm chấp nhận đăng ký thành viên
const postApprove = async ({ req }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const approveData = await findByKey({ req, value: parseInt(req.body.UserId) });
  if (!approveData) {
    resdata.status = 0;
    resdata.message = 'Member not found';
    return resdata;
  }
  approveData.IsActive = 'Yes';
  return await updateData({ req,data: approveData });
}
  
 
// Hàm để từ chối đăng ký thành viên
const postReject = async ({ req }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const rejectData = await findByKey({ req, value: parseInt(req.body.UserId) });
  if (!rejectData) {
    resdata.status = 0;
    resdata.message = 'Member not found';
    return resdata;
  }
  rejectData.IsActive = 'No';
  return await updateData({ req,data: rejectData });
}

// Hàm để thêm data mới
const addData = async ({ req, data }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  //chuyên đổi req.body sang Object
  const newdata = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: newdata, meta: meta });
  //nếu email tồn  tại thì kiểm tra kiểu email
  if (newdata.Email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newdata.Email)) {
      resdata.errors.Email = 'Invalid email format';
    }
  }

  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }
  /*
      "params": {
          "Email": "huynhtm02@gmail.com",
          "Password": "StrongPassw0rd!",
          "LoginName": "huynhtm02@gmail.com",
          "Phone": "0912345678",
          "FullName": "Nguyen Van A",
          "Address": "123 Đường Lý Thường Kiệt, Quận 10, TP.HCM",
          "Sex": "Male",
          "Birthday": "1990-05-20",
          "UpdateMode": "create_user"
      }
    */
  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "Email": newdata.Email,
      "Password": newdata.Password,
      "LoginName": newdata.Email,
      "Phone": newdata.PhoneDirect,
      "FullName": newdata.FullName,
      "Address": newdata.Address,
      "Sex": newdata.Sex,
      "Birthday": newdata.Birthday,
      "UpdateMode": "create_user"
    }
  });
  //nếu password khác rỗng thì xóa thuộc tính Password
  if (!newdata.Password) { delete para.Password; }

  const url = `${req.app.locals.env.api.host}/api/upsert-user`;
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
  let updatedata = senserver.utils.convertReqBodyToObject(req.body, meta);
  if (data) {
    //nếu có data truyền vào thì gán lại updatedata
    updatedata = data;
  }
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: updatedata, meta: meta || [] });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }

  //cập nhật bằng api
  // const para = JSON.stringify({
  //   "params": {
  //     "LogIn": req.session.user.username,
  //     "FullName": updatedata.FullName,
  //     "Account": updatedata.Account,
  //     "IsActive": updatedata.IsActive,
  //     "JobTitle": updatedata.JobTitle,
  //     "Email": updatedata.Email,
  //     "PhoneDirect": updatedata.PhoneDirect,
  //     "IsPrimary": updatedata.IsPrimary,
  //     "Sex": updatedata.Sex,
  //     "BirthDay": updatedata.BirthDay,
  //     "Address": updatedata.Address,
  //     "Gmail": updatedata.Gmail,
  //     "NativeLanguage": updatedata.NativeLanguage,
  //     "UpdateMode": "update_user_info"
  //   }
  // });

  //new 20251029
    const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "FullName": updatedata.FullName,
      "Account": updatedata.Account,
      "IsActive": updatedata.IsActive,
      "JobTitle": updatedata.JobTitle,
      "DestLogIn": updatedata.Email,
      "PhoneDirect": updatedata.PhoneDirect,
      "IsPrimary": updatedata.IsPrimary,
      "Sex": updatedata.Sex,
      "BirthDay": updatedata.BirthDay,
      "Address": updatedata.Address,
      "Gmail": updatedata.Gmail,
      "NativeLanguage": updatedata.NativeLanguage,
      "UpdateMode": "update_dest_user_info"
    }
  });


  const url = `${req.app.locals.env.api.host}/api/upsert-user`;
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

// Hàm để xóa data
const deleteData = async ({ req, id }) => {
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "UserId": req.params.id || 0,
      "UpdateMode": "delete_user_permanently"
    }
  });

  const url = `${req.app.locals.env.api.host}/api/upsert-user`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  return { status: 1, message: data.Message, row: data.Data || {} };
}

// Hàm để tìm theo trường tùy chỉnh
const findByField = async ({ field, value }) => {
  return datas.find(data => data[field] === value);
};
// Hàm tìm theo khóa
const findByKey = async ({ req, value }) => {
  let id = req.query[keyField.field] || 0;
  if (value) { id = value; }
  const para = JSON.stringify({ "LogIn": req.session.user.username, "DisplayMode": "get_user_info_by_id", "UserId": id,"SessionId": req.session.sessionid });
  const url = `${req.app.locals.env.api.host}/api/get-client-user?params=${encodeURIComponent(para)}`;
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
  //params:{"PageSize":2,"DisplayMode":"full_list","Keyword":"Nguyễn Minh Chính","ActivateStatus":"All","PageNum":1,"LogIn":"dgthanh@gmail.com"}
  const para = JSON.stringify({
    "ClientId": null,
    "DisplayMode": "get_unique_user_list",
    "ActivateStatus": "All",
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "PageNum": page,
    "PageSize": pagesize,
    "Keyword": keyword
  });

  const url = `${req.app.locals.env.api.host}/api/get-client-user?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
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

  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "PageSize": pagesize,
    "PageNum": page,
    "ClientId": null,
    "DisplayMode": "dropdown_list",
    "Keyword": keyword,
  });

  const url = `${req.app.locals.env.api.host}/api/get-client-user?params=${encodeURIComponent(para)}`;
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
  postApprove,
  postReject
};
