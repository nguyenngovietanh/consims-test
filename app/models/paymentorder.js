const senserver = require("../models/senserver.js");
// paymentorder.js

/*
    {
        "WorkType": "construction_work",
        "SubmissionId": 17870,
        "Blank": "",
        "Code": "1.1.1.1",
        "SubmissionDate": "2025-09-26T00:00:00",
        "WorkName": "Phí bảo lãnh dự thầu",
        "SubmissionName": "[work] 123123 (Docs: 14)",
        "Unit": "LS",
        "ApprovedWorkCat": "contracted_quantity",
        "SubmittedQnty": 123213,
        "SubmittedUnitPrice": 7678,
        "SubmittedAmount": 946029414,
        "ApprovedQnty": 123213,
        "ApprovedUnitPrice": 10000,
        "ApprovedAmount": 1232130000,
        "RemarksOnApproval": "123213"
    }
*/

const meta = [
  { field: 'WorkType', type: 'string', description: 'Work Type', isnullable: true, show: false, visible: true, readonly: true },
  { field: 'SubmissionId', type: 'bigint', description: 'Submission Id', key: true, isnullable: false, show: false, visible: true, readonly: true },
  { field: 'Blank', type: 'string', description: 'Blank', isnullable: true, show: false, visible: true, readonly: true },
  { field: 'Code', type: 'string', description: 'Code', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmissionDate', type: 'date', description: 'Date', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'WorkName', type: 'string', description: 'Work Name', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmissionName', type: 'string', description: 'Submission', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'Unit', type: 'string', description: 'Unit', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ApprovedWorkCat', type: 'string', description: 'Work Cat.', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmittedQnty', type: 'number', description: 'Submitted Qnty', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmittedUnitPrice', type: 'number', description: 'Submitted Unit Price', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmittedAmount', type: 'number', description: 'Submitted Total', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ApprovedQnty', type: 'number', description: 'Approved Qnty', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ApprovedUnitPrice', type: 'number', description: 'Approved Unit Price', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ApprovedAmount', type: 'number', description: 'Approved Total', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'RemarksOnApproval', type: 'string', description: 'Remarks', isnullable: true, show: true, visible: true, readonly: true },

]
//nếu meta không có trường key=true thì gán trường đầu tiên trong meta
if (!meta.some(field => field.key)) { meta[0].key = true; }
const keyField = meta.find(field => field.key);

class Model {
  constructor({ WorkType, SubmissionId, Blank, Code, SubmissionDate, WorkName, SubmissionName, Unit, ApprovedWorkCat, SubmittedQnty, SubmittedUnitPrice, SubmittedAmount, ApprovedQnty, ApprovedUnitPrice, ApprovedAmount, RemarksOnApproval } = {}) {
    this.WorkType = WorkType ?? '';
    this.SubmissionId = SubmissionId ?? 0;
    this.Blank = Blank ?? '';
    this.Code = Code ?? '';
    this.SubmissionDate = SubmissionDate ?? null;
    this.WorkName = WorkName ?? '';
    this.SubmissionName = SubmissionName ?? '';
    this.Unit = Unit ?? '';
    this.ApprovedWorkCat = ApprovedWorkCat ?? '';
    this.SubmittedQnty = SubmittedQnty ?? 0;
    this.SubmittedUnitPrice = SubmittedUnitPrice ?? 0;
    this.SubmittedAmount = SubmittedAmount ?? 0;
    this.ApprovedQnty = ApprovedQnty ?? 0;
    this.ApprovedUnitPrice = ApprovedUnitPrice ?? 0;
    this.ApprovedAmount = ApprovedAmount ?? 0;
    this.RemarksOnApproval = RemarksOnApproval ?? '';

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

  const url = `${req.app.locals.env.api.host}/api/upsert-paymentorder`;
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
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "UpdateMode": "delete",
      "Modules": [{ "ModuleId": req.params.id }]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-paymentorder`;
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
  const url = `${req.app.locals.env.api.host}/api/upsert-paymentorder`;
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
  const url = `${req.app.locals.env.api.host}/api/get-paymentorder-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  const result = data.Data && data.Data.length > 0 ? data.Data[0] : null;

  //nếu có ParentId thì lấy thông tin Parent Module
  if (result && result.ParentId) {
    const parentPara = JSON.stringify({ "LogIn": req.session.user.username, "DisplayMode": "full_list", "ActiveOnly": "No", "ModuleId": result.ParentId, "SessionId": req.session.sessionid });
    const parentUrl = `${req.app.locals.env.api.host}/api/get-paymentorder-list?params=${encodeURIComponent(parentPara)}`;
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
  /*
  {{baseURL}}/api/get-submission-for-po?
  params={"LogIn":"lotusviet@lotusviet.vn","SessionId":"D6BF7123-39E0-43D1-A6B2-430B36702623","ContractId":304,"Language":"vi","DisplayMode":"get_submission_for_po_drafting","PageSize":1000,"Keyword":"","Stage":"implement","FromDate":"","ToDate":"","WorkGroup":"all"}
  */
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "ContractId": req.query.filtercontract,
    "Language": req.session.user.language || 'en',
    "DisplayMode": req.query.displaymode || "get_submission_for_po_drafting",
    "PageNum": page,
    "PageSize": pagesize,
    "Keyword": req.query.filterkeyword || "",
    "Stage": req.query.filterstage || "implement",
    "FromDate": req.query.filterfromdate || "",
    "ToDate": req.query.filtertodate || "",
    "WorkGroup": req.query.filterworktype || "all"
  });




  const url = `${req.app.locals.env.api.host}/api/get-submission-for-po?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} apiurl: ${url} apipara: ${para}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize), apiurl: url, apipara: encodeURIComponent(para) };
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
    "SessionId": req.session.sessionid,
    "LogIn": req.session.user.username,
    "PageSize": pagesize,
    "PageNum": page,
    "ClientId": null,
    "DisplayMode": "dropdown_list",
    "Keyword": keyword,
  });

  const url = `${req.app.locals.env.api.host}/api/get-paymentorder-list?params=${encodeURIComponent(para)}`;
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

//#region paymentorder specific functions
// Hàm để xóa data
const createDraftIPC = async ({ req }) => {
  const { contractid, selecteditems, worktype } = req.body;
  /*
{
    "params": {
        "LogIn": "lotusviet@lotusviet.vn",
        "SessionId": "D62F8184-FC01-407B-87B6-4D6C8F112B7D",
        "ContractId": 304,
        "Language": "vi",
        "UpdateMode": "draft_ipc",
        "SelectedItems": [
            {
                "WorkType": "construction_work",
                "SubmissionId": 5757
            },
             {
                "WorkType": "deduction",
                "SubmissionId": 17935
            }
        ]
    }
}
  */
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "ContractId": contractid,
      "Language": req.app.locals.env.lang || "en",
      "UpdateMode": "draft_ipc",
      "SelectedItems": selecteditems || []
    }
  });
  const url = `${req.app.locals.env.api.host}/api/create-ipc`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  return { status: 1, message: data.Message, row: data.Data || {}, apiurl: url, apipara: para };
}

const removeDraftIPC = async ({ req }) => {
  const { contractid } = req.body;
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "ContractId": contractid,
      "UpdateMode": "reset_all_draft_ipc"
    }
  });
  const url = `${req.app.locals.env.api.host}/api/create-ipc`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  return { status: 1, message: data.Message, row: data.Data || {}, apiurl: url, apipara: para };
}

const getDraftIPC = async ({ req }) => {
  // const { contractid } = req.body;
  /* 
  {"LogIn": "lotusviet@lotusviet.vn","SessionId": "C751FAD3-5296-47F6-A331-D5D1BFA44E96","ContractId":304,"SummaryMode":"draft_payment"}
  */
  const para = JSON.stringify({
    "SessionId": req.session.sessionid,
    "LogIn": req.session.user.username,
    "ContractId": req.query.contractid || 0,
    "SummaryMode": "draft_payment"
  });
  const url = `${req.app.locals.env.api.host}/api/get-ipc-summary?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} apiurl: ${url} apipara: ${para}`); }
  //tạm không phân trang
  // const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], apiurl: url, apipara: encodeURIComponent(para) };

}

const createIPCfromDraft = async ({ req }) => {
  const { contractid, poname, remarks, paymentdate } = req.body;
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "ContractId": contractid,
      "Language": req.app.locals.env.lang || "en",
      "PaymentDate": paymentdate || "",
      "UpdateMode": "create_payment_order_from_draft",
      "POName": poname || "",
      "Remarks": remarks || ""
    }
  });
  const url = `${req.app.locals.env.api.host}/api/create-ipc`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  return { status: 1, message: data.Message, row: data.Data || {}, apiurl: url, apipara: para };
}

//#endregion paymentorder specific functions

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
  removeDraftIPC,
  createDraftIPC,
  createIPCfromDraft,
  getDraftIPC
};
