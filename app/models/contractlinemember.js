const senserver = require("../models/senserver.js");
// module.js
/*
            {
                "Account": "dgthanh@gmail.com",
                "IsActive": "Yes",
                "Description": "",
                "Role": "Phê duyệt"
            }

            {
            "UserId": 175857,
            "Account": "dgthanh@gmail.com",
            "FullName": "Dương Đình Thanh",
            "RoleAction": "Thực hiện",
            "Role": "R",
            "IsAssigned": "Yes"
            }
*/
const meta = [
  { field: 'Id', type: 'bigint', description: 'Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'ItemId', type: 'bigint', description: 'Item Id', key: false, isnullable: true, show: true, visible: false },
  { field: 'Account', type: 'string', description: 'Account', key: false, isnullable: true, show: true, visible: true },
  { field: 'FullName', type: 'string', description: 'Full Name', key: false, isnullable: true, show: true, visible: true },
  { field: 'IsActive', type: 'string', description: 'Is Active', key: false, isnullable: true, show: true, visible: true },
  { field: 'Description', type: 'string', description: 'Description', key: false, isnullable: true, show: true, visible: true },
  { field: 'Role', type: 'string', description: 'Role', key: false, isnullable: true, show: true, visible: true },
  { field: 'RoleAction', type: 'string', description: 'Role Action', key: false, isnullable: true, show: true, visible: true },
  { field: 'IsAssigned', type: 'string', description: 'Is Assigned', key: false, isnullable: true, show: true, visible: true },
  { field: 'R', description: 'Responsible', colorder: 100, visible: false, show: true },
  { field: 'A', description: 'Accountable', colorder: 103, visible: false, show: true },
  { field: 'C', description: 'Consulted', colorder: 104, visible: false, show: true },
  { field: 'I', description: 'Informed', colorder: 105, visible: false, show: true }

]
//nếu meta không có trường key=true thì gán trường đầu tiên trong meta
if (!meta.some(field => field.key)) { meta[0].key = true; }
const keyField = meta.find(field => field.key);

class Model {
  constructor({ Id, ItemId, Account, FullName, IsActive, Description, Role, RoleAction, IsAssigned } = {}) {
    this.Id = Id ?? 0;
    this.ItemId = ItemId ?? 0;
    this.Account = Account ?? '';
    this.FullName = FullName ?? '';
    this.IsActive = IsActive ?? '';
    this.Description = Description ?? '';
    this.Role = Role ?? '';
    this.RoleAction = RoleAction ?? '';
    this.IsAssigned = IsAssigned ?? '';
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

const postInherit = async ({ req }) => {
  return await updateDataInherit({ req });
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
const getList4Perform = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortField = req.query.sortfield;
  const sortType = req.query.sorttype;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  return await getDatas4Perform({ req, page, pagesize, sortField, sortType, filterConditions });
}



const getMemberByContractLineList = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortField = req.query.sortfield;
  const sortType = req.query.sorttype;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  return await getMemberByContractLineDatas({ req, page, pagesize, sortField, sortType, filterConditions });
}

const getLookup = async ({ req }) => {
  return await getList({ req });
}
// Hàm để thêm data mới
const addData = async ({ req, data }) => {
  if (['deduction', 'add'].includes(req.query.worktype || '')) {
    return await addData4Deduction({ req, data });
  }

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
  // https://consims.com/api/upsert-typical-assignment
  //   {
  //     "params": {
  //         "LogIn": "khanh911234@gmail.com",
  //         "SessionId": "DE729A99-90F0-454E-AA36-99E2D447CDD4",
  //         "Language": "vi",
  //         "ItemId": 651436,
  //         "Inherited": "Yes",
  //         "WorkType": "construction_work",
  //         "UpdateMode": "assign_to_item",
  //         "Assignments": [
  //             {
  //                 "Account": "dgthanh@gmail.com",
  //                 "IsActive": "Yes",
  //                 "Description": "",
  //                 "Role": "Phê duyệt"
  //             }
  //         ]
  //     }
  // }
  /*
  {
    "LogIn":"khanh911234@gmail.com",
    "WorkType":"construction_work",
    "UpdateMode":"assign_to_selected_item",
    "ContractId":304,  
    "ItemIds":[{"ItemId":16}],
    "Assignments":
    [
      {"Account":"khanh911234@gmail.com","IsActive":"Yes","Description":"","Title":"","Role":"Phê duyệt"},
      {"Account":"khanh911234@gmail.com","IsActive":"Yes","Description":"","Title":"","Role":"Tham vấn"},
      {"Account":"khanh911234@gmail.com","IsActive":"No","Description":"","Title":"","Role":"Thực hiện"},
      {"Account":"khanh911234@gmail.com","IsActive":"Yes","Description":"","Title":"","Role":"Thông báo"}
    ]
  }
  */
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "WorkType": "construction_work",
      "UpdateMode": "assign_to_selected_item",
      "ContractId": req.body.ContractId || 0,
      "ItemIds": [{ "ItemId": req.body.ItemId || 0 }],
      "Assignments":
        [
          { "Account": req.body.Account, "IsActive": "Yes", "Description": "", "Title": "", "Role": req.body.Role }
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
  resdata.data = apidata.Data && apidata.Data.length > 0 ? apidata.Data[0] : null;
  resdata.apipara = para;
  return resdata;
}

const addData4Deduction = async ({ req, data }) => {
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
              }
          ]
      }
  }
  */
  /*
  {
    "LogIn":"khanh911234@gmail.com",
    "WorkType":"construction_work",
    "UpdateMode":"assign_to_selected_item",
    "ContractId":304,  
    "ItemIds":[{"ItemId":16}],
    "Assignments":
    [
      {"Account":"khanh911234@gmail.com","IsActive":"Yes","Description":"","Title":"","Role":"Phê duyệt"},
      {"Account":"khanh911234@gmail.com","IsActive":"Yes","Description":"","Title":"","Role":"Tham vấn"},
      {"Account":"khanh911234@gmail.com","IsActive":"No","Description":"","Title":"","Role":"Thực hiện"},
      {"Account":"khanh911234@gmail.com","IsActive":"Yes","Description":"","Title":"","Role":"Thông báo"}
    ]
  }
  */
  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "Language": req.app.locals.env.lang || 'en',
      "WorkType": req.query.worktype || "deduction",
      "SessionId": req.session.sessionid,
      "ContractId": req.body.ContractId || 0,
      "UpdateMode": req.query.updatemode || "assign_to_selected_item",
      "WorkCat": [
        {
          "WorkCatId": req.body.ItemId || 0
        }
      ],
      "Assignments":
        [
          { "Account": req.body.Account, "IsActive": "Yes", "Description": "", "Title": "", "Role": req.body.Role }
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
  resdata.data = apidata.Data && apidata.Data.length > 0 ? apidata.Data[0] : null;
  resdata.apipara = para;
  return resdata;
}

// Hàm để cập nhật data raci
const updateData = async ({ req, data }) => {

  if (['deduction', 'add'].includes(req.query.worktype || '')) {
    return await updateData4Deduction({ req, data });
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

  const ContractId = req.query.parentid || 0;
  const ItemId = req.query.id || 0;
  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "ContractId": ContractId,
      "WorkType": "construction_work",
      "UpdateMode": "assign_to_selected_item",
      "Inherited": req.query.isinherit === 'yes' ? 'Yes' : 'No',
      "Assignments": [
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.A === "True" ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Phê duyệt"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.C === "True" ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Tham vấn"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.R === "True" ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Thực hiện"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.I === "True" ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Thông báo"
        }
      ],
      "ItemIds": [
        {
          "ItemId": ItemId
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


const updateData4Deduction = async ({ req, data }) => {
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

  const ContractId = req.query.parentid || 0;
  const ItemId = req.query.id || 0;
  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "Language": req.app.locals.env.lang || 'en',
      "WorkType": "deduction",
      "SessionId": req.session.sessionid,
      "ContractId": ContractId,
      "UpdateMode": "assign_to_selected_item",
      "WorkCat": [
        {
          "WorkCatId": ItemId
        }
      ],
      "Assignments": [
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.A === "True" ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Phê duyệt"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.C === "True" ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Tham vấn"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.R === "True" ? "Yes" : "No",
          "Description": "",
          "Title": "",
          "Role": "Thực hiện"
        },
        {
          "Account": updatedata.Account,
          "IsActive": updatedata.I === "True" ? "Yes" : "No",
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

// // Hàm để cập nhật data
// const updateData = async ({ req, data }) => {
//   const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
//   const updatedata = senserver.utils.convertReqBodyToObject(req.body, meta);
//   // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
//   resdata.errors = senserver.utils.validmodel({ model: updatedata, meta: meta || [] });
//   if (Object.keys(resdata.errors).length > 0) {
//     resdata.status = 0;
//     resdata.message = 'validation error';
//     return resdata;
//   }

//   //cập nhật bằng api
//   const para = JSON.stringify({
//     "params": {
//       "LogIn": req.session.user.username,
//       "UpdateMode": "update",
//       "Clients": [
//         {
//           "ClientId": updatedata.ClientId,
//           "ClientCode": updatedata.ClientCode,
//           "CompanyName": updatedata.CompanyName,
//           "RegistrationNumber": updatedata.RegistrationNumber,
//           "TaxID": updatedata.TaxID,
//           "Industry": updatedata.Industry,
//           "Website": updatedata.Website,
//           "PhoneMain": updatedata.PhoneMain,
//           "EmailMain": updatedata.EmailMain,
//           "Street": updatedata.Street,
//           "City": updatedata.City,
//           "StateProvince": updatedata.StateProvince,
//           "PostalCode": updatedata.PostalCode,
//           "Country": updatedata.Country,
//           "ClientType": updatedata.ClientType,
//           "IsActive": updatedata.IsActive
//         }
//       ]
//     }
//   });
//   const url = `${req.app.locals.env.api.host}/api/upsert-client-list`;
//   const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
//   const apidata = await response.json();
//   if (apidata.Success !== 'true') {
//     resdata.status = 0;
//     resdata.message = apidata.Message;
//     resdata.errors = apidata.Errors || {};
//     return resdata;
//   }
//   //kết thúc //cập nhật bằng api
//   if (!resdata.data) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
//   return resdata;
// }

const updateDataInherit = async ({ req, data }) => {
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

  /*  
    https://consims.com/api/upsert-typical-assignment
{
    "params": {
        "LogIn": "khanh911234@gmail.com",
        "ContractId": 304,
        "WorkType": "construction_work",
        "UpdateMode": "assign_to_selected_item",
        "Inherited": "Yes",
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

  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "ContractId": req.query.ContractId || 0,
      "WorkType": "construction_work",
      "UpdateMode": "assign_to_selected_item",
      "Inherited": "Yes",
      "Assignments": [
        {
          "Account": req.body.Account,
          "IsActive": "Yes",
          "Description": "",
          "Title": "",
          "Role": req.body.RoleAction
        }
      ],
      "ItemIds": [
        {
          "ItemId": req.query.ItemId || 0
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
  resdata.data = apidata.Data && apidata.Data.length > 0 ? apidata.Data[0] : null;
  resdata.apipara = para;
  return resdata;
}

// Hàm để xóa data
const deleteData = async ({ req, id }) => {
  const ContractId = req.query.ContractId || 0;
  const ItemId = req.query.ItemId || 0;
  const Account = req.query.Account || '';
  const Role = req.query.Role || '';

  /*
  {{baseURL}}/api/upsert-typical-assignment
  {
    "params": {
        "LogIn": "khanh911234@gmail.com",
        "SessionId": "DE729A99-90F0-454E-AA36-99E2D447CDD4",
        "Language": "vi",
        "ItemId": 28330441,
        "Inherited": "Yes",
        "WorkType": "construction_work",
        "UpdateMode": "assign_to_item",
        "Assignments": [
            {
                "Account": "builehoanvu@gmail.com",
                "IsActive": "No",
                "Description": "",
                "Title": "",
                "Role": "Phê duyệt"
            }
        ]
    }
}
  */

  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "WorkType": "construction_work",
      "UpdateMode": "assign_to_selected_item",
      "ContractId": ContractId,
      "ItemIds": [{ "ItemId": ItemId }],
      "Assignments":
        [
          { "Account": Account, "IsActive": "No", "Description": "", "Title": "", "Role": "Phê duyệt" },
          { "Account": Account, "IsActive": "No", "Description": "", "Title": "", "Role": "Tham vấn" },
          { "Account": Account, "IsActive": "No", "Description": "", "Title": "", "Role": "Thực hiện" },
          { "Account": Account, "IsActive": "No", "Description": "", "Title": "", "Role": "Thông báo" }
        ]
    }
  });

  const url = `${req.app.locals.env.api.host}/api/upsert-typical-assignment`;
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
  const para = JSON.stringify({ "ClientType": "All", "DisplayMode": "full_list", "LogIn": req.session.user.username, "ClientId": id });
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

  // https://consims.com/api/get-typical-assignment?params={"LogIn":"khanh911234@gmail.com","ItemId":651434,"WorkType":"construction_work","DisplayMode":"with_account_and_name"}

  const para = JSON.stringify({
    "SessionId": req.session.sessionid,
    "LogIn": req.session.user.username,
    "ItemId": req.query.id || 0,
    "WorkType": "construction_work",
    "DisplayMode": "with_account_and_name"
  });
  const url = `${req.app.locals.env.api.host}/api/get-typical-assignment?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}

//Hàm lấy danh sách member bởi contract line
const getMemberByContractLineDatas = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
  if (['deduction', 'add'].includes(req.query.worktype)) {
    return await getMemberByContractLineDatas4Deduction({ req, page, pagesize, sortFields, sortTypes, filterConditions });
  }

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
  // https://consims.com/api/get-typical-assignment?params={"LogIn":"khanh911234@gmail.com","ItemId":651434,"WorkType":"construction_work","DisplayMode":"with_account_and_name"}
  const id = parseInt(req.query.id) || 0;
  // const para = JSON.stringify({
  //   "LogIn": req.session.user.username,
  //   "ItemId": id,
  //   "WorkType": "construction_work",
  //   "DisplayMode": "with_account_and_name"
  // });

  // params:{"LogIn":"khanh911234@gmail.com","DisplayMode":"with_model","WorkType":"construction_work","ItemId":28334144,"SubmissionId":null,"Inherited":"No","SessionId":"4C8E1A01-C92F-45D8-AB3E-5650D7EA36B3"}
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "DisplayMode": "with_model",
    "WorkType": "construction_work",
    "ItemId": id,
    "SubmissionId": null,
    "Inherited": "No",
    "SessionId": req.session.sessionid
  });

  const url = `${req.app.locals.env.api.host}/api/get-typical-assignment?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang

  //map thêm trường Id từ thứ tự trong data.Data 
  if (data.Data && Array.isArray(data.Data)) {
    data.Data = data.Data.map((item, index) => {
      return { Id: index + 1, ...item };
    });
  }
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize), apiurl: url, apipara: para };
}

const getMemberByContractLineDatas4Deduction = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  // https://consims.com/api/get-typical-assignment?params={"LogIn":"khanh911234@gmail.com","ItemId":651434,"WorkType":"construction_work","DisplayMode":"with_account_and_name"}
  const id = parseInt(req.query.id) || 0;
  /*
  {{baseURL}}/api/get-typical-assignment?params={"LogIn":"lotusviet@lotusviet.vn","SessionId":"9D137343-4A47-483A-85E4-DF765B4650D5","WorkCatId":29,"WorkType":"deduction","DisplayMode":"with_account_and_name","ItemId":304}
  */
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "WorkCatId": id,
    "WorkType": req.query.worktype || "deduction",
    "DisplayMode": req.query.displaymode || "with_model",
    "ItemId": req.query.contractid || 0
  });

  const url = `${req.app.locals.env.api.host}/api/get-typical-assignment?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang

  //map thêm trường Id từ thứ tự trong data.Data 
  if (data.Data && Array.isArray(data.Data)) {
    data.Data = data.Data.map((item, index) => {
      return { Id: index + 1, ...item };
    });
  }
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize), apiurl: url, apipara: para };
}

//Hàm lấy danh sách member dùng cho tạo perform
const getDatas4Perform = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
  if(['deduction', 'add'].includes(req.query.worktype)){
    return await getDatas4Perform4Deduction({ req, page, pagesize, sortFields, sortTypes, filterConditions });
  }

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
  const id = parseInt(req.query.id) || 0;//là contractid
  /*
    params:{"LogIn":"lotusviet@lotusviet.vn","DisplayMode":"with_account_and_name_for_creating","WorkType":"deduction","ItemId":188446		,"SubmissionId":null,"Inherited":"No","SessionId":"444875BF-3BBC-4E44-8352-40CDB7283B4C"}
  */
  const para = JSON.stringify({
    "LogIn":req.session.user.username,
    "DisplayMode":req.query.displaymode || "with_account_and_name_for_creating",
    "WorkType": req.query.worktype || "deduction",
    "ItemId": id,
    "SubmissionId":req.query.submissionid || null,
    "Inherited":"No",
    "SessionId":req.session.sessionid
  });

  const url = `${req.app.locals.env.api.host}/api/get-typical-assignment?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} ${url}  ${para}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang

  //map thêm trường Id từ thứ tự trong data.Data 
  if (data.Data && Array.isArray(data.Data)) {
    data.Data = data.Data.map((item, index) => {
      return { Id: index + 1, ...item };
    });
  }
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize), apiurl: url, apipara: encodeURIComponent(para) };
}

const getDatas4Perform4Deduction = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  const id = parseInt(req.query.id) || 0;//là contractid
  /*
    params:{"LogIn":"lotusviet@lotusviet.vn","DisplayMode":"with_account_and_name_for_creating","WorkType":"deduction","ItemId":304,"SessionId":"9188F2BE-3F79-445C-93BD-683799C5513C","WorkCatId":72}
  */
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "DisplayMode": req.query.displaymode || "with_account_and_name_for_creating",
    "WorkType": req.query.worktype || "deduction",
    "ItemId": id,
    "SessionId": req.session.sessionid,
    "WorkCatId": req.query.itemid || 0
  });

  const url = `${req.app.locals.env.api.host}/api/get-typical-assignment?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} ${url}  ${para}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang

  //map thêm trường Id từ thứ tự trong data.Data 
  if (data.Data && Array.isArray(data.Data)) {
    data.Data = data.Data.map((item, index) => {
      return { Id: index + 1, ...item };
    });
  }
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize), apiurl: url, apipara: encodeURIComponent(para) };
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
  getMemberByContractLineList,
  postInherit,
  getList4Perform
};
