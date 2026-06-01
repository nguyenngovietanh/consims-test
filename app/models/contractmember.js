const senserver = require("../models/senserver.js");
// module.js
/*
        {
            "UserId": 3815,
            "ContractId": 33
        }
*/
const meta = [
  { field: 'Id', type: 'bigint', description: 'Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'ContractId', type: 'bigint', description: 'Contract ID', key: false, isnullable: true, show: false, visible: false },
  { field: 'UserId', type: 'bigint', description: 'User ID', key: false, isnullable: true, show: false, visible: false },
  { field: 'Account', type: 'string', description: 'User Name', key: false, isnullable: true, show: true, visible: true },
  { field: 'Email', type: 'string', description: 'Email', key: false, isnullable: true, show: false, visible: false },
  { field: 'Remarks', type: 'string', description: 'Remarks', key: false, isnullable: true, show: true, visible: false },

  { field: 'R', type: 'boolean', description: 'Responsible', key: false, isnullable: true, show: true, visible: false },
  { field: 'A', type: 'boolean', description: 'Accountable', key: false, isnullable: true, show: true, visible: false },
  { field: 'C', type: 'boolean', description: 'Consulted', key: false, isnullable: true, show: true, visible: false },
  { field: 'I', type: 'boolean', description: 'Informed', key: false, isnullable: true, show: true, visible: false },

]
//nếu meta không có trường key=true thì gán trường đầu tiên trong meta
if (!meta.some(field => field.key)) { meta[0].key = true; }
const keyField = meta.find(field => field.key);

class Model {
  constructor({ Id, ContractId, UserId } = {}) {
    this.Id = Id ?? 0;
    this.ContractId = ContractId ?? 0;
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

const postRACI = async ({ req }) => {
  return await updateDataRACI({ req });
}

const postRACIAndInherit = async ({ req }) => {
  return await updateDataRACIAndInherit({ req });
}


const postRACI4PO = async ({ req }) => {
  return await updateDataRACI4PO({ req });
}

const postDeletePaymentOrder = async ({ req }) => {
  return await deleteDataRACI4PO({ req });
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
const getMemberByContractList = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortField = req.query.sortfield;
  const sortType = req.query.sorttype;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  return await getMemberByContractDatas({ req, page, pagesize, sortField, sortType, filterConditions });
}

const getListByPaymentOrder = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortField = req.query.sortfield;
  const sortType = req.query.sorttype;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  return await getDatasByPaymentOrder({ req, page, pagesize, sortField, sortType, filterConditions });
}

const getLookup = async ({ req }) => {
  return await getList({ req });
}
// Hàm để thêm data mới
const addData = async ({ req, data }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  //chuyên đổi req.body sang Object
  const newdata = senserver.utils.convertReqBodyToObject(req.body, meta);
  // // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  // resdata.errors = senserver.utils.validmodel({ model: newdata, meta: meta });
  // if (Object.keys(resdata.errors).length > 0) {
  //   resdata.status = 0;
  //   resdata.message = 'validation error';
  //   return resdata;
  // }
  //cập nhật bằng api

  /*
  https://consims.com/api/upsert-user
  {
    "params": {
        "LogIn": "lotusviet@lotusviet.vn",
        "DestLogIn": "minhhuynh@gmail.com",
        "ContractId": 17308,
        "UpdateMode": "assign_user_to_contract",
        "ContractAssignRemarks": "test"
    }
}
  */

  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "DestLogIn": newdata.Account,
      "ContractId": newdata.ContractId,
      "UpdateMode": "assign_user_to_contract",
      "ContractAssignRemarks": ""
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
      "SessionId": req.session.sessionid,
      "UpdateMode": "update",
      "Contracts": [
        {
          "ContractId": updatedata.ContractId,
          "ContractCode": updatedata.ContractCode,
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
          "ContractType": updatedata.ContractType,
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

// Hàm để cập nhật data raci
const updateDataRACI = async ({ req, data }) => {
  if (['deduction', 'add'].includes(req.query.worktype)) {
    return await updateDataRACI4Deduction({ req, data });
  }

  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const updatedata = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: updatedata, meta: meta || [] });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }



  /*
  https://consims.com/api/upsert-typical-assignment
  {
      "params": {
          "LogIn": "khanh911234@gmail.com",
          "ContractId": 304,
          "WorkType": "construction_work",
          "UpdateMode": "assign_to_selected_item",
          "Assignments": [
              {
                  "Account": "khanh911234@gmail.com",
                  "IsActive": "Yes",
                  "Description": "",
                  "Title": "",
                  "Role": "Phê duyệt"
              },
              {
                  "Account": "khanh911234@gmail.com",
                  "IsActive": "Yes",
                  "Description": "",
                  "Title": "",
                  "Role": "Tham vấn"
              },
              {
                  "Account": "khanh911234@gmail.com",
                  "IsActive": "No",
                  "Description": "",
                  "Title": "",
                  "Role": "Thực hiện"
              },
              {
                  "Account": "khanh911234@gmail.com",
                  "IsActive": "Yes",
                  "Description": "",
                  "Title": "",
                  "Role": "Thông báo"
              }
          ],
          "ItemIds": [
              {
                  "ItemId": 16
              }
          ]
      }
  }
  */

  const ContractId = req.query.ContractId;
  const ItemIds = req.query.ItemIds.split(',').map(id => { return { ItemId: parseInt(id) }; });
  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "ContractId": ContractId,
      "WorkType": "construction_work",
      "UpdateMode": "assign_to_selected_item",
      "Inherited": req.query.isinherit === 'yes' ? "Yes" : "No",
      "Assignments": [
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.A === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Phê duyệt"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.C === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Tham vấn"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.R === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Thực hiện"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.I === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Thông báo"
        }
      ],
      "ItemIds": ItemIds
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-typical-assignment`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  if (apidata.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata.Message;
    resdata.errors = apidata.Errors || {};
    return resdata;
  }
  //kết thúc //cập nhật bằng api
  if (!resdata) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
  return resdata;
}

const updateDataRACI4PO = async ({ req, data }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const updatedata = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: updatedata, meta: meta || [] });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }

  /*
  https://consims.com/api/upsert-typical-assignment
  {
    "params": {
        "LogIn": "khanhvuday@gmail.com",
        "WorkType": "payment_order",
        "SessionId": "E39A0BD6-B696-4E24-8F13-D23B8AB7D4EC",
        "ContractId": 17243,
        "UpdateMode": "assign_to_selected_item",
        "WorkCat": [
            {
                "WorkCatId": null
            }
        ],
        "Assignments": [
            {
                "Account": "phuocpp@centralcons.vn",
                "IsActive": "Yes",
                "Description": "",
                "Title": "",
                "Role": "Phê duyệt"
            },
            {
                "Account": "phuocpp@centralcons.vn",
                "IsActive": "No",
                "Description": "",
                "Title": "",
                "Role": "Tham vấn"
            }
        ]
    }
}
  */

  const ContractId = req.query.contractid;
  // const ItemIds = req.query.ItemIds.split(',').map(id => { return { ItemId: parseInt(id) }; });
  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "ContractId": ContractId,
      "WorkType": "payment_order",
      "UpdateMode": "assign_to_selected_item",
      "WorkCat": [
        {
          "WorkCatId": null
        }
      ],
      "Assignments": [
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.A === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Phê duyệt"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.C === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Tham vấn"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.R === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Thực hiện"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.I === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Thông báo"
        }
      ]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-typical-assignment`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  if (apidata.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata.Message;
    resdata.errors = apidata.Errors || {};
    return resdata;
  }
  //kết thúc //cập nhật bằng api
  if (!resdata) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
  return resdata;
}


const deleteDataRACI4PO = async ({ req, data }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const updatedata = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: updatedata, meta: meta || [] });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }

  /*
  https://consims.com/api/upsert-typical-assignment
  {
    "params": {
        "LogIn": "khanhvuday@gmail.com",
        "WorkType": "payment_order",
        "SessionId": "E39A0BD6-B696-4E24-8F13-D23B8AB7D4EC",
        "ContractId": 17243,
        "UpdateMode": "assign_to_selected_item",
        "WorkCat": [
            {
                "WorkCatId": null
            }
        ],
        "Assignments": [
            {
                "Account": "phuocpp@centralcons.vn",
                "IsActive": "Yes",
                "Description": "",
                "Title": "",
                "Role": "Phê duyệt"
            },
            {
                "Account": "phuocpp@centralcons.vn",
                "IsActive": "No",
                "Description": "",
                "Title": "",
                "Role": "Tham vấn"
            }
        ]
    }
}
  */

  const ContractId = req.query.contractid;
  // const ItemIds = req.query.ItemIds.split(',').map(id => { return { ItemId: parseInt(id) }; });
  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "ContractId": ContractId,
      "WorkType": "payment_order",
      "UpdateMode": "assign_to_selected_item",
      "WorkCat": [
        {
          "WorkCatId": null
        }
      ],
      "Assignments": [
        {
          "Account": updatedata.Account,
          "IsActive": "No",
          "Description": "",
          "Title": "",
          "Role": "Phê duyệt"
        },
        {
          "Account": updatedata.Account,
          "IsActive": "No",
          "Description": "",
          "Title": "",
          "Role": "Tham vấn"
        },
        {
          "Account": updatedata.Account,
          "IsActive": "No",
          "Description": "",
          "Title": "",
          "Role": "Thực hiện"
        },
        {
          "Account": updatedata.Account,
          "IsActive": "No",
          "Description": "",
          "Title": "",
          "Role": "Thông báo"
        }
      ]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-typical-assignment`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  if (apidata.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata.Message;
    resdata.errors = apidata.Errors || {};
    return resdata;
  }
  //kết thúc //cập nhật bằng api
  if (!resdata) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
  return resdata;
}


const updateDataRACI4Deduction = async ({ req, data }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const updatedata = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: updatedata, meta: meta || [] });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }



  /*
  {{baseURL}}/api/upsert-typical-assignment
  {
    "params": {
        "LogIn": "lotusviet@lotusviet.vn",
        "Language": "vi",
        "WorkType": "deduction",
        "SessionId": "96AF341F-5B52-49FA-852D-D2E8365A58B7",
        "ContractId": 304,
        "UpdateMode": "assign_to_selected_item",
        "WorkCat": [
            {
                "WorkCatId": 29
            }
        ],
        "Assignments": [
            {
                "Account": "lotusviet@lotusviet.vn",
                "IsActive": "Yes",
                "Description": "",
                "Title": "",
                "Role": "Phê duyệt"
            },
            {
                "Account": "lotusviet@lotusviet.vn",
                "IsActive": "No",
                "Description": "",
                "Title": "",
                "Role": "Tham vấn"
            },
            {
                "Account": "lotusviet@lotusviet.vn",
                "IsActive": "Yes",
                "Description": "",
                "Title": "",
                "Role": "Thực hiện"
            },
            {
                "Account": "lotusviet@lotusviet.vn",
                "IsActive": "No",
                "Description": "",
                "Title": "",
                "Role": "Thông báo"
            }
        ]
    }
}
  */

  const ContractId = req.query.ContractId;
  const ItemIds = req.query.ItemIds.split(',').map(id => { return { WorkCatId: parseInt(id) }; });
  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "Language": req.app.locals.env.lang || 'en',
      "WorkType": req.query.worktype || "deduction",
      "SessionId": req.session.sessionid,
      "ContractId": ContractId,
      "UpdateMode": req.query.updatemode || "assign_to_selected_item",
      "WorkCat": ItemIds,
      "Assignments": [
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.A === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Phê duyệt"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.C === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Tham vấn"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.R === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Thực hiện"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.I === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Thông báo"
        }
      ]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-typical-assignment`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  if (apidata.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata.Message;
    resdata.errors = apidata.Errors || {};
    return resdata;
  }
  //kết thúc //cập nhật bằng api
  if (!resdata) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
  return resdata;
}


const updateDataRACIAndInherit = async ({ req, data }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const updatedata = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: updatedata, meta: meta || [] });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }

  const ContractId = req.query.ContractId;
  const ItemIds = req.query.ItemIds.split(',').map(id => { return { ItemId: parseInt(id) }; });
  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "ContractId": ContractId,
      "WorkType": "construction_work",
      "UpdateMode": "assign_to_selected_item",
      "Assignments": [
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.A === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Phê duyệt"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.C === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Tham vấn"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.R === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Thực hiện"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.I === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Thông báo"
        }
      ],
      "ItemIds": ItemIds
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-typical-assignment`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  if (apidata.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata.Message;
    resdata.errors = apidata.Errors || {};
    return resdata;
  }
  //kết thúc //cập nhật bằng api
  if (!resdata) { return { status: 0, message: "Object not found", errors: "Object not found" }; }

  //gọi api inherit từ contract member
  const para2 = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "ContractId": ContractId,
      "WorkType": "construction_work",
      "UpdateMode": "assign_to_selected_item",
      "Inherited": "Yes",
      "Assignments": [
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.A === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Phê duyệt"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.C === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Tham vấn"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.R === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Thực hiện"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.I === true ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Thông báo"
        }
      ],
      "ItemIds": ItemIds
    }
  });
  const url2 = `${req.app.locals.env.api.host}/api/upsert-typical-assignment`;
  const response2 = await fetch(url2, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para2 });
  const apidata2 = await response2.json();
  if (apidata2.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata2.Message;
    resdata.errors = apidata2.Errors || {};
    return resdata;
  }
  resdata.data = apidata2.Data && apidata2.Data.length > 0 ? apidata2.Data[0] : null;
  resdata.apipara = para2;


  return resdata;
}



// Hàm để xóa data
const deleteData = async ({ req, id }) => {
  /*
  https://consims.com/api/upsert-user
  {
    "params": {
        "LogIn": "lotusviet@lotusviet.vn",
        "DestLogIn": "minhhuynh@gmail.com",
        "ContractId": 17308,
        "UpdateMode": "remove_user_to_contract",
        "ContractAssignRemarks": "test"
    }
}
  */
  const Account = req.query.Account || '';
  const ContractId = req.query.ContractId || 0;
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "DestLogIn": Account,
      "ContractId": ContractId,
      "UpdateMode": "remove_user_to_contract",
      "ContractAssignRemarks": "test"
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
  const para = JSON.stringify({ "ContractType": "All", "DisplayMode": "full_list", "LogIn": req.session.user.username, "ContractId": id });
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
    "ContractType": "All",
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
const getMemberByContractDatas = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  https://consims.com/api/get-client-user?
  params={"LogIn": "lotusviet@lotusviet.vn", "DisplayMode": "get_contract_users", "WorkType": "construction_work", "ContractId": 17308, "SessionId": "your_session_id"}
  */


  const id = parseInt(req.query.id) || 0;
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "DisplayMode": "get_contract_users",
    "WorkType": "construction_work",
    "ContractId": id,
    "SessionId": req.session.sessionid,
    "Keyword": keyword
  });
  const url = `${req.app.locals.env.api.host}/api/get-client-user?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  //map id tự tăng
  if (data.Data && Array.isArray(data.Data)) {
    data.Data.forEach((item, index) => {
      item.Id = index + 1;
    });
  }

  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}

const getDatasByPaymentOrder = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  //{{baseURL}}/api/get-typical-assignment?
  // params={"LogIn": "lotusviet@lotusviet.vn","SessionId": "D62F8184-FC01-407B-87B6-4D6C8F112B7D","WorkType":"payment_order","DisplayMode":"with_account_and_name","ItemId":304}
  */

  const para = JSON.stringify({
    "SessionId": req.session.sessionid,
    "LogIn": req.session.user.username,
    "WorkType": req.query.worktype || "payment_order",
    "DisplayMode": req.query.displaymode || "with_model",
    "ItemId": parseInt(req.query.contractid) || 0,
    "Keyword": keyword
  });
  const url = `${req.app.locals.env.api.host}/api/get-typical-assignment?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = 0;

  //map thêm trường Id từ thứ tự trong data.Data 
  if (data.Data && Array.isArray(data.Data)) {
    data.Data = data.Data.map((item, index) => {
      return { Id: index + 1, ...item };
    });
  }
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
  getMemberByContractDatas,
  getListByPaymentOrder,
  postCreate,
  postEdit,
  postRACI,
  postDelete,
  getList,
  getLookup,
  getCreate,
  getEdit,
  getMemberByContractList,
  postRACIAndInherit,
  postRACI4PO,
  postDeletePaymentOrder
};
