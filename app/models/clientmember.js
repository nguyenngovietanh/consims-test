const senserver = require("../models/senserver.js");
// module.js
/*
        {
            "UserId": 3815,
            "ClientId": 33
        }
*/
const meta = [
  { field: 'Id', type: 'bigint', description: 'Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'ClientId', type: 'bigint', description: 'Client ID', key: false, isnullable: true, show: false, visible: false },
  { field: 'UserId', type: 'bigint', description: 'User ID', key: false, isnullable: true, show: false, visible: false }
]
//nếu meta không có trường key=true thì gán trường đầu tiên trong meta
if (!meta.some(field => field.key)) { meta[0].key = true; }
const keyField = meta.find(field => field.key);

class Model {
  constructor({Id,ClientId,UserId} = {}) {
    this.Id = Id ?? 0;
    this.ClientId = ClientId ?? 0;
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
const getMemberByClientList = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortField = req.query.sortfield;
  const sortType = req.query.sorttype;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  return await getMemberByClientDatas({ req, page, pagesize, sortField, sortType, filterConditions });
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
        "UserId":newdata.UserId,
        "ClientId": newdata.ClientId,
        "LogIn":req.session.user.username,
        "UpdateMode": "assign_client_to_user"
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
  resdata.data = apidata.Data && apidata.Data.length > 0 ? apidata.Data[0] : null;
  resdata.apipara = para;
  return resdata;
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
      "UpdateMode": "update",
      "Clients": [
        {
          "ClientId": updatedata.ClientId,
          "ClientCode": updatedata.ClientCode,
          "CompanyName": updatedata.CompanyName,
          "RegistrationNumber": updatedata.RegistrationNumber,
          "TaxID": updatedata.TaxID,
          "Industry": updatedata.Industry,
          "Website": updatedata.Website,
          "PhoneMain": updatedata.PhoneMain,
          "EmailMain": updatedata.EmailMain,
          "Street": updatedata.Street,
          "City": updatedata.City,
          "StateProvince": updatedata.StateProvince,
          "PostalCode": updatedata.PostalCode,
          "Country": updatedata.Country,
          "ClientType": updatedata.ClientType,
          "IsActive": updatedata.IsActive
        }
      ]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-client-list`;
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
  const UserId = req.query.UserId || 0;
  const ClientId = req.query.ClientId || 0;
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
        "UserId": UserId,
        "ClientId": ClientId,
        "LogIn": req.session.user.username,
        "UpdateMode": "un_assign_user_from_client"
    }
  });

  const url = `${req.app.locals.env.api.host}/api/upsert-user`;
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
  const para = JSON.stringify({ "ClientType": "All", "DisplayMode": "full_list", "LogIn": req.session.user.username, "ClientId": id, "SessionId": req.session.sessionid });
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
    "ClientType": "All",
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
const getMemberByClientDatas = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  const para = JSON.stringify({
    "ClientId": id,
    "DisplayMode": "full_list_by_client",
    "ActivateStatus": "All",
    "SessionId": req.session.sessionid,
    "LogIn": req.session.user.username,
    "PageNum": page,
    "PageSize": pagesize
  });
  const url = `${req.app.locals.env.api.host}/api/get-client-user?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = data.TotalRows||0;
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
  getMemberByClientDatas,
  postCreate,
  postEdit,
  postDelete,
  getList,
  getLookup,
  getCreate,
  getEdit,
  getMemberByClientList,
};
