const { get } = require("../controllers/commoncontroller.js");
const senserver = require("../models/senserver.js");
// senobject.js
//dùng để làm mẫu đại diện cho các đối tượng trong hệ thống
//để có thể sử dụng chung cho các đối tượng khác nhau 
/*
        {
            "ItemId": 651434,
            "WBS": "0.3",
            "WorkName": " Công việc chung xử lý hóa đơn",
            "WorkType": "",
            "Unit": "LS"
        }
*/

//khai báo meta cho đối tượng này
const meta = [
  { field: 'ItemId', type: 'bigint', description: 'Item Id', key: true, isnullable: true, show: false, visible: true },
  { field: 'WBS', type: 'string', description: 'WBS', isnullable: true, show: true, visible: true },
  { field: 'WorkName', type: 'string', description: 'Work Name', isnullable: true, show: true, visible: true },
  { field: 'WorkType', type: 'string', description: 'Work Type', key: false, isnullable: true, show: true, visible: true },
  { field: 'Unit', type: 'string', description: 'Unit', isnullable: true, show: true, visible: true },
  { field: 'ContractId', type: 'bigint', description: 'Contract Id', key: false, isnullable: true, show: false, visible: true }


]
//nếu meta không có trường key=true thì gán trường đầu tiên trong meta
if (!meta.some(field => field.key)) { meta[0].key = true; }
const keyField = meta.find(field => field.key);

class Model {
  constructor({ ItemId, WBS, WorkName, WorkType, Unit, ContractId } = {}) {
    this.ItemId = ItemId ?? 0;
    this.WBS = WBS ?? "";
    this.WorkName = WorkName ?? "";
    this.WorkType = WorkType ?? "";
    this.Unit = Unit ?? "";
    this.ContractId = ContractId ?? 0;
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

const getItem = async ({ req }) => {
  const result = await findByKey({ req, value: parseInt(req.query[keyField.field]) });
  if (!result) { throw new Error("Object not found"); }
  return result;
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
      "LogIn": req.session.user.username,
      "SessionId": req.session.sessionid,
      "UpdateMode": "update",
      "Clients": [
        {
          "ClientId": null,
          "ClientCode": newdata.ClientCode,
          "CompanyName": newdata.CompanyName,
          "RegistrationNumber": newdata.RegistrationNumber,
          "TaxID": newdata.TaxID,
          "Industry": newdata.Industry,
          "Website": newdata.Website,
          "PhoneMain": newdata.PhoneMain,
          "EmailMain": newdata.EmailMain,
          "Street": newdata.Street,
          "City": newdata.City,
          "StateProvince": newdata.StateProvince,
          "PostalCode": newdata.PostalCode,
          "Country": newdata.Country,
          "ClientType": newdata.ClientType,
          "IsActive": newdata.IsActive,
          "ParentId": parseInt(newdata.ParentId) || null
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
  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "SessionId": req.session.sessionid,
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
          "IsActive": updatedata.IsActive,
          "ParentId": parseInt(updatedata.ParentId) || null
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
  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "SessionId": req.session.sessionid,
      "UpdateMode": "delete",
      "Clients": [
        {
          "ClientId": req.params.id
        }
      ]
    }
  });

  const url = `${req.app.locals.env.api.host}/api/upsert-client-list`;
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
  let id = req.query[keyField.field] || 0;
  if (value) { id = value; }
  //{{baseURL}}/api/get-item-info?params=
  // {"LogIn":"lotusviet@lotusviet.vn", "SessionId": "A30F9806-D7B3-4342-B59D-45212F2BDBB0","ItemId":651434,"DisplayMode":"construction_item_brief","Language":"en","UnitPriceMode":"last_one"}


  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "ItemId": parseInt(id) || 0,
    "DisplayMode": req.query.DisplayMode || "construction_item_brief",
    "Language": req.app.locals.env.lang || 'en',
    "UnitPriceMode": req.query.UnitPriceMode || "last_one"
  });
  const url = `${req.app.locals.env.api.host}/api/get-item-info?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  const result = data.Data && data.Data.length > 0 ? data.Data[0] : null;

  //nếu có ParentId thì lấy thông tin Parent Client
  if (result && result.ParentId) {
    const parentPara = JSON.stringify({ "ClientType": "All", "DisplayMode": "full_list", "LogIn": req.session.user.username, "ClientId": result.ParentId,"SessionId": req.session.sessionid });
    const parentUrl = `${req.app.locals.env.api.host}/api/get-client-list?params=${encodeURIComponent(parentPara)}`;
    const parentResponse = await fetch(parentUrl);
    const parentData = await parentResponse.json();
    if (parentData.Success === 'true') {
      result.ParentClient = parentData.Data && parentData.Data.length > 0 ? parentData.Data[0] : null;
    }
  }


  return result || {};
}

// Hàm tìm theo User
const findByUser = async ({ req, value }) => {
  ///api/get-client-list?params={"DisplayMode":"client_list_by_user","Keyword":"","LogIn":"lotusviet@lotusviet.vn","PageNum":1,"PageSize":50}
  const page = 1, pagesize = 1000;
  const user = req.query.username || (req.session.user.username || '');
  const para = JSON.stringify({ "DisplayMode": "client_list_by_user", "Keyword": "", "LogIn": user, "PageNum": page, "PageSize": pagesize });
  const url = `${req.app.locals.env.api.host}/api/get-client-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
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
  /*
  
  */

  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "ContractId": req.query.ContractId || 0,
    "Language": req.app.locals.env.lang || "en",
    "DisplayMode": req.query.filterdisplaymode || "item_detail_list_web",
    "WorkType": req.query.filterworktype || "construction_work",
    "PageSize": pagesize,
    "Keyword": req.query.filterkeyword || "",
    "ApprovalStatus": req.query.filterapprovalstatus || "All",
    "ToLevel": req.query.filtertolevel || "All",
    "Stage": req.query.filterstage || "implement",
    "WorkCat": req.query.filterworkcat || "All",
    "FromDate": req.query.filterfromdate || "",
    "ToDate": req.query.filtertodate || "",
    "HavingSubmission": req.query.filterhavingsubmission || "No",
    "OverallApprovalStatus": req.query.filteroverallapprovalstatus || "No",
    "PageNum": page
  });

  const url = `${req.app.locals.env.api.host}/api/get-submission?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize), apipara: para, apiurl: '/api/get-submission?params=' };
}


//Hàm lấy danh sách lookup data với phân trang và sắp xếp
const getLookupDatas = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
  let keyword = '';
  //nếu filterConditions không là đối tượng rỗng thì thêm vào điều kiện lọc
  if (Object.keys(filterConditions).length > 0) {
    //nếu filterConditions.Conditions là mảng thì thêm vào điều kiện lọc
    if (Array.isArray(filterConditions.conditions)) {
      //tìm điều kiện trường searchTerm có thì gán nếu không thì cho =''
      // const keywordCondition = filterConditions.conditions.find(cond => cond.field === 'searchTerm');
      // //nếu keywordCondition có thì gán giá trị cho keyword
      // if (keywordCondition) { keyword = keywordCondition.value; }

      const keywordCompanyName = filterConditions.conditions.find(cond => cond.field === 'CompanyName');
      //nếu keywordCompanyName có thì gán giá trị cho keywordCompanyName
      if (keywordCompanyName) { keyword = keywordCompanyName.value; }
    }
  }

  // params:{"LogIn":"lotusviet@lotusviet.vn","DisplayMode":"brief_contracts_by_user","PageNum":1,"PageSize":5}
  const para = JSON.stringify({
    "SessionId": req.session.sessionid,
    "LogIn": req.session.user.username,
    "DisplayMode": "brief_contracts_by_user",
    "PageNum": page,
    "PageSize": pagesize,
    "Keyword": keyword
  });
  const url = `${req.app.locals.env.api.host}/api/get-contract-list?params=${encodeURIComponent(para)}`;
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
  findByUser,
  getAllDatas,
  getDatas,
  postCreate,
  postEdit,
  postDelete,
  getList,
  getLookup,
  getCreate,
  getEdit,
  getItem
};
