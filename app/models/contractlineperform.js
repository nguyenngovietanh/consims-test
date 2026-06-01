const senserver = require("../models/senserver.js");
// const { File } = require('buffer'); // Node.js >= 18
// const FormData = require('form-data');

// module.js
/*
{
  "SubmissionId": null,
  "StartProcessNow": "Yes",
  "Stage": "implement",
  "SubmissionType": "contracted_quantity",
  "ItemId": 691870,
  "Qnty": "1222",
  "UnitPrice": "10000",
  "Remarks": "",
  "SubmissionName": "2025.09.15.v3",
  "ApplyDefinedAssignment": "No",
  "WorkType": "construction_work",
  "ItemDate": "2025-11-25"
}
*/

/*
            "ReviewAssignmentId": 26473820,
            "SubmissionId": 17870,
            "WorkType": "construction_work",
            "ContractName": "Ctr Trung tâm thương mại - cao ốc văn phòng",
            "ItemDate": "2025-09-26T00:00:00",
            "SubmissionName": "123123",
            "SubmittedWorkCat": "contracted_quantity",
            "Unit": "LS",
            "SubmittedQnty": 123213,
            "SubmittedUnitPrice": 7678,
            "SubmittedAmount": 946029414,
            "SubmittedRemarks": "123213",
            "Role": "C",
            "ApprovalStatus": "Đang làm",
            "ReviewedWorkCat": "not-defined",
            "ReviewedQnty": null,
            "ReviewedUnitPrice": null,
            "ReviewedAmount": null,
            "RemarksOnApproval": null

*/

const metaall = [
  { field: 'ReviewAssignmentId', type: 'bigint', description: 'Review Assignment Id', key: true, isnullable: false, show: false, visible: false, readonly: true },
  { field: 'SubmissionId', type: 'bigint', description: 'Submission Id', key: true, isnullable: false, show: false, visible: false, readonly: true },
  { field: 'WorkType', type: 'string', description: 'Work Type', key: false, isnullable: false, show: false, visible: true, readonly: true },

  { field: 'ContractName', type: 'string', description: 'Contract', key: false, isnullable: true, show: true, visible: true, readonly: true },
  { field: 'WBS', type: 'string', description: 'WBS', key: false, isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ContractedUnitPrice', type: 'number', description: 'Contracted Unit Price', key: false, isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ItemDate', type: 'date', description: 'Date', key: false, isnullable: true, show: true, visible: true, readonly: true, readonly: true },
  { field: 'SubmissionName', type: 'string', description: 'Description', key: false, isnullable: false, show: true, visible: true, readonly: true },
  { field: 'SubmittedWorkCat', type: 'string', description: 'Work Cat.', key: false, isnullable: true, show: true, visible: true, readonly: true },

  { field: 'Unit', type: 'string', description: 'Unit', key: false, isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmittedQnty', type: 'number', description: 'Qnty', dec: 3, key: false, isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmittedUnitPrice', type: 'number', description: 'Unit Price', key: false, isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmittedAmount', type: 'number', description: 'Total', key: false, isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmittedRemarks', type: 'text', description: 'Remarks', key: false, isnullable: true, show: true, visible: true, readonly: true },
  { field: 'Role', type: 'string', description: 'Role', key: false, isnullable: true, show: true, visible: true, readonly: true },
  {
    field: 'ApprovalStatus', type: 'string', description: 'Decision', key: false, isnullable: true, show: true, visible: true,
    lookup: {
      url: '/common/lookup',
      fields: { id: '`${item.Description}`', value: '`${item.Description}`', label: '`${item.Description}`' },
      filter: { logic: "and", conditions: [{ field: "Description", op: "includes", value: '' }] },
      searchwheninit: true
    }
  },
  {
    field: 'ReviewedWorkCat', type: 'string', description: 'Work Cat.', key: false, isnullable: true, show: true, visible: true
    , inputtype: 'select', sortable: false,
    data: [{ id: '', value: '', label: '' }, { id: '1', value: '1', label: 'Option 1' }, { id: '2', value: '2', label: 'Option 2' }, { id: '3', value: '3', label: 'Option 3' }]

  },
  { field: 'ReviewedQnty', type: 'number', description: 'Qnty', dec: 3, key: false, isnullable: true, show: true, visible: true },
  { field: 'ReviewedUnitPrice', type: 'number', description: 'Unit Price', key: false, isnullable: true, show: true, visible: true },
  { field: 'ReviewedAmount', type: 'number', description: 'Total', key: false, isnullable: true, show: true, visible: true },
  { field: 'RemarksOnApproval', type: 'text', description: 'Remarks', key: false, isnullable: true, show: true, visible: true },


]

const metareviewline = [
  { field: 'AssignmentId', type: 'bigint', description: 'Assignment Id', key: true, isnullable: false, show: true, visible: false },
  { field: 'UserId', type: 'bigint', description: 'User Id', key: false, isnullable: false, show: true, visible: false },
  { field: 'FullName', type: 'string', description: 'Full Name', key: false, isnullable: false, show: true, visible: true, readonly: true },
  { field: 'Role', type: 'string', description: 'Role', key: false, isnullable: false, show: true, visible: true, readonly: true },
  {
    field: 'WorkCat', type: 'string', description: 'Work Category', key: false, isnullable: false, show: true, visible: true
    , inputtype: 'select', sortable: false,
    data: [{ id: '', value: '', label: '' }, { id: '1', value: '1', label: 'Option 1' }, { id: '2', value: '2', label: 'Option 2' }, { id: '3', value: '3', label: 'Option 3' }]

  },

  { field: 'UnitPrice', type: 'number', description: 'Unit Price', key: false, isnullable: false, show: true, visible: true },
  { field: 'Qnty', type: 'number', description: 'Quantity', dec: 3, key: false, isnullable: false, show: true, visible: true },
  { field: 'Remarks', type: 'text', description: 'Remarks', key: false, isnullable: true, show: true, visible: true },

  { field: 'ActualStart', type: 'datetime', description: 'Actual Start', key: false, isnullable: false, show: true, visible: true },
  { field: 'ActualFinish', type: 'datetime', description: 'Actual Finish', key: false, isnullable: false, show: true, visible: true },

  {
    field: 'ApprovalStatus', type: 'string', description: 'Decision', key: false, isnullable: false, show: true, visible: true,
    lookup: {
      url: '/common/lookup',
      fields: { id: '`${item.Description}`', value: '`${item.Description}`', label: '`${item.Description}`' },
      filter: { logic: "and", conditions: [{ field: "Description", op: "includes", value: '' }] },
      searchwheninit: true
    }
  },


  { field: 'MyDuty', type: 'string', description: 'My Duty', key: false, isnullable: false, show: false, visible: true },
  { field: 'FileExisted', type: 'string', description: 'File Existed', key: false, isnullable: false, show: true, visible: false },
  { field: 'EditMode', type: 'number', description: 'Edit Mode', key: false, isnullable: false, show: true, visible: false },
  { field: 'ReviewApprovalStatus', type: 'string', description: 'Approval Status', key: false, isnullable: true, show: true, visible: true, readonly: true },
];

const meta = [
  { field: 'SubmissionId', type: 'bigint', description: 'Submission Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'SubmissionType', type: 'string', description: 'Work Category', key: false, isnullable: true, show: true, visible: false },
  { field: 'SubmissionName', type: 'string', description: 'Description', key: false, isnullable: false, show: true, visible: true },

  {
    field: 'Stage', type: 'string', description: 'Stage', key: false, isnullable: true, show: true, visible: false,
    data: [{ id: 'implement', value: 'Implement', label: 'Implement' }, { id: 'plan', value: 'Plan', label: 'Plan' }]
  },
  { field: 'StartProcessNow', type: 'boolean', description: 'Start Process Now', key: false, isnullable: true, show: true, visible: false },
  { field: 'ApplyDefinedAssignment', type: 'boolean', description: 'Apply Defined Assignment', key: false, isnullable: true, show: true, visible: false },

  // { field: 'Id', type: 'bigint', description: 'Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'ItemId', type: 'bigint', description: 'Item Id', key: false, isnullable: true, show: true, visible: false },
  // { field: 'Description', type: 'string', description: 'Description', key: false, isnullable: false, show: true, visible: false },
  { field: 'SubmissionDate', type: 'date', description: 'Submission Date', key: false, isnullable: false, show: true, visible: true },
  {
    field: 'Unit', type: 'string', description: 'Unit', key: false, isnullable: true, show: true, visible: true,
    lookup: {
      url: '/common/lookup?lookupType=unit',
      fields: { id: '`${item.Unit}`', value: '`${item.Unit}`', label: '`${item.Unit}`' },
      filter: { logic: "and", conditions: [{ field: "Unit", op: "includes", value: '' }] }
    }
  },
  { field: 'WorkType', type: 'string', description: 'Work Type', key: false, isnullable: false, show: true, visible: true },
  { field: 'Qnty', type: 'number', description: 'Qnty', dec: 3, key: false, isnullable: false, show: true, visible: true },
  { field: 'UnitPrice', type: 'number', description: 'Unit Price', key: false, isnullable: false, show: true, visible: true },
  { field: 'Remarks', type: 'text', description: 'Remarks', key: false, isnullable: true, show: true, visible: true },
  { field: 'ReviewApprovalStatus', type: 'string', description: 'Approval Status', key: false, isnullable: true, show: true, visible: true },

]

const metareview = [
  { field: 'RoleValidation', type: 'string', description: 'Role Validation', key: false, isnullable: true, show: true, visible: true },
  { field: 'SubmissionId', type: 'bigint', description: 'Submission Id', key: true, isnullable: false, show: true, visible: true },
  { field: 'SubmissionName', type: 'string', description: 'Submission Name', key: false, isnullable: true, show: true, visible: true },
  { field: 'ItemName', type: 'string', description: 'Item Name', key: false, isnullable: true, show: true, visible: true },
  { field: 'Unit', type: 'string', description: 'Unit', key: false, isnullable: true, show: true, visible: true },
  { field: 'ContractedUnitPrice', type: 'number', description: 'Unit Price', key: false, isnullable: true, show: true, visible: true },
  { field: 'TotalRows', type: 'number', description: 'Total Rows', key: false, isnullable: true, show: true, visible: true },
  { field: 'OverallApprovalStatus', type: 'string', description: 'Overall Status', key: false, isnullable: true, show: true, visible: true }
];

const metadeduction = [
  { field: 'SubmissionId', type: 'bigint', description: 'Submission Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'SubmissionType', type: 'string', description: 'Work Category', key: false, isnullable: true, show: true, visible: false },
  { field: 'SubmissionName', type: 'string', description: 'Description', key: false, isnullable: false, show: true, visible: true },

  {
    field: 'Stage', type: 'string', description: 'Stage', key: false, isnullable: true, show: true, visible: false,
    data: [{ id: 'implement', value: 'Implement', label: 'Implement' }, { id: 'plan', value: 'Plan', label: 'Plan' }]
  },
  { field: 'StartProcessNow', type: 'boolean', description: 'Start Process Now', key: false, isnullable: true, show: true, visible: false },
  { field: 'ApplyDefinedAssignment', type: 'boolean', description: 'Apply Defined Assignment', key: false, isnullable: true, show: true, visible: false },

  { field: 'ContractId', type: 'bigint', description: 'Contract Id', key: false, isnullable: true, show: true, visible: false },
  // { field: 'Id', type: 'bigint', description: 'Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'ItemId', type: 'bigint', description: 'Item Id', key: false, isnullable: true, show: true, visible: false },
  // { field: 'Description', type: 'string', description: 'Description', key: false, isnullable: false, show: true, visible: false },
  { field: 'SubmissionDate', type: 'date', description: 'Submission Date', key: false, isnullable: false, show: true, visible: true },
  {
    field: 'Unit', type: 'string', description: 'Unit', key: false, isnullable: true, show: true, visible: true,
    lookup: {
      url: '/common/lookup?lookupType=unit',
      fields: { id: '`${item.Unit}`', value: '`${item.Unit}`', label: '`${item.Unit}`' },
      filter: { logic: "and", conditions: [{ field: "Unit", op: "includes", value: '' }] }
    }
  },
  { field: 'WorkType', type: 'string', description: 'Work Type', key: false, isnullable: false, show: true, visible: true },
  { field: 'Qnty', type: 'number', description: 'Qnty', dec: 3, key: false, isnullable: false, show: true, visible: true },
  { field: 'UnitPrice', type: 'number', description: 'Unit Price', key: false, isnullable: false, show: true, visible: true },
  { field: 'Remarks', type: 'text', description: 'Remarks', key: false, isnullable: true, show: true, visible: true }


]




//nếu meta không có trường key=true thì gán trường đầu tiên trong meta
if (!meta.some(field => field.key)) { meta[0].key = true; }
const keyField = meta.find(field => field.key);

class Model {
  constructor({ SubmissionId, SubmissionType, SubmissionName, Stage, StartProcessNow, ApplyDefinedAssignment, Id, ItemId, Description, SubmissionDate, Unit, WorkCategory, Qnty, UnitPrice, Remarks } = {}) {
    this.SubmissionId = SubmissionId ?? null;
    this.SubmissionType = SubmissionType ?? '';
    this.SubmissionName = SubmissionName ?? '';
    this.Stage = Stage ?? '';
    this.StartProcessNow = StartProcessNow ?? false;
    this.ApplyDefinedAssignment = ApplyDefinedAssignment ?? false;
    this.Id = Id ?? null;
    this.ItemId = ItemId ?? null;
    this.Description = Description ?? '';
    this.SubmissionDate = SubmissionDate ?? new Date();
    this.Unit = Unit ?? '';
    this.WorkCategory = WorkCategory ?? '';
    this.Qnty = Qnty ?? 0;
    this.UnitPrice = UnitPrice ?? 0;
    this.Remarks = Remarks ?? '';
  }
}

class ModelAll {
  /*
              "ReviewAssignmentId": 26473820,
            "SubmissionId": 17870,
            "WorkType": "construction_work",
            "ContractName": "Ctr Trung tâm thương mại - cao ốc văn phòng",
            "ItemDate": "2025-09-26T00:00:00",
            "SubmissionName": "123123",
            "SubmittedWorkCat": "contracted_quantity",
            "Unit": "LS",
            "SubmittedQnty": 123213,
            "SubmittedUnitPrice": 7678,
            "SubmittedAmount": 946029414,
            "SubmittedRemarks": "123213",
            "Role": "C",
            "ApprovalStatus": "Đang làm",
            "ReviewedWorkCat": "not-defined",
            "ReviewedQnty": null,
            "ReviewedUnitPrice": null,
            "ReviewedAmount": null,
            "RemarksOnApproval": null
  */
  constructor({ ReviewAssignmentId, SubmissionId,
    WorkType,
    ContractName,
    ItemDate,
    SubmissionName,
    SubmittedWorkCat,
    Unit,
    SubmittedQnty,
    SubmittedUnitPrice,
    SubmittedAmount,
    SubmittedRemarks,
    Role,
    ApprovalStatus,
    ReviewedWorkCat,
    ReviewedQnty,
    ReviewedUnitPrice,
    ReviewedAmount,
    RemarksOnApproval
  } = {}) {
    this.ReviewAssignmentId = ReviewAssignmentId ?? null;
    this.SubmissionId = SubmissionId ?? null;
    this.WorkType = WorkType ?? '';
    this.ContractName = ContractName ?? '';
    this.ItemDate = ItemDate ?? null;
    this.SubmissionName = SubmissionName ?? '';
    this.SubmittedWorkCat = SubmittedWorkCat ?? '';
    this.Unit = Unit ?? '';
    this.SubmittedQnty = SubmittedQnty ?? 0;
    this.SubmittedUnitPrice = SubmittedUnitPrice ?? 0;
    this.SubmittedAmount = SubmittedAmount ?? 0;
    this.SubmittedRemarks = SubmittedRemarks ?? '';
    this.Role = Role ?? '';
    this.ApprovalStatus = ApprovalStatus ?? '';
    this.ReviewedWorkCat = ReviewedWorkCat ?? '';
    this.ReviewedQnty = ReviewedQnty ?? null;
    this.ReviewedUnitPrice = ReviewedUnitPrice ?? null;
    this.ReviewedAmount = ReviewedAmount ?? null;
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

const postEditLine = async ({ req }) => {
  return await updateDataLine({ req });
}

const postEditLineAll = async ({ req }) => {
  return await updateDataLineAll({ req });
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

const getListAll = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortField = req.query.sortfield;
  const sortType = req.query.sorttype;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  return await getDatasAll({ req, page, pagesize, sortField, sortType, filterConditions });
}

const getLookup = async ({ req }) => {
  return await getList({ req });
}

const getReview = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortField = req.query.sortfield;
  const sortType = req.query.sorttype;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  return await getReviewData({ req, page, pagesize, sortField, sortType, filterConditions });
}

// Hàm để thêm data mới
const addData = async ({ req, data }) => {


  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  //chuyên đổi req.body sang Object
  const newdata = senserver.utils.convertReqBodyToObject(req.body, meta);

  if (newdata.WorkType == "deduction" || newdata.WorkType == "add") {
    return await addData4Deduction({ req, data });
  }

  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: newdata, meta: meta });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }
  //cập nhật bằng api
  /*
{ 
    "params" : {
        "LogIn": "khanh911234@gmail.com",
        "UpdateMode": "create_submission",
        "SessionId": "4C8E1A01-C92F-45D8-AB3E-5650D7EA36B3",
        "SubmissionId": null,
        "StartProcessNow": "Yes",
        "Stage": "implement",
        "SubmissionType": "contracted_quantity",
        "ItemId": 691870,
        "Qnty": "1222",
        "UnitPrice": "10000",
        "Remarks": "",
        "SubmissionName": "2025.09.15.v3",
        "ApplyDefinedAssignment": "No",
        //"WorkType": "construction_work",
        "ItemDate": "2025-11-25",
        "Language": "en",        
        "Attachments": [
            {
                "FileId": 2202
            },
            {
                "FileId": 2203
            },
            {
                "FileId": 2204
            },
            {
                "FileId": 2205
            },
            {
                "FileId": 2206
            },
            {
                "FileId": 2207
            }
        ],

        "Assignment": [
            {
                "UserId": 176117,
                "Role": "C",
                "Description": ""
            },
            {
                "UserId": 176117,
                "Role": "A",
                "Description": ""
            },
            {
                "UserId": 176117,
                "Role": "I",
                "Description": ""
            }
        ]
    }
}
  */

  let Attachments = [];
  if (req.body['files'] && Array.isArray(req.body['files'])) {
    Attachments = req.body['files'].map(file => ({ FileId: parseInt(file.id) }));
  }

  let Assignment = [];
  if (req.body['Assignment'] && Array.isArray(req.body['Assignment']) && newdata.StartProcessNow === true) {
    //chỉ gán khi Description được nhập
    // Assignment = req.body['Assignment'].filter(item => item.Description && item.Description.trim() !== '').map(item => ({
    Assignment = req.body['Assignment'].map(item => ({
      UserId: parseInt(item.UserId),
      Role: item.Role,
      Description: item.Description || ''
    }));
  }

  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "UpdateMode": "create_submission",
      "SessionId": req.session.sessionid,
      "SubmissionId": null,
      "StartProcessNow": newdata.StartProcessNow ? "Yes" : "No",
      "Stage": newdata.Stage || "implement",
      "SubmissionType": newdata.SubmissionType || "contracted_quantity",
      "ItemId": newdata.ItemId || 0,
      "Qnty": newdata.Qnty || "0",
      "UnitPrice": newdata.UnitPrice || "0",
      "Remarks": newdata.Remarks || "",
      "SubmissionName": newdata.SubmissionName || "",
      "ApplyDefinedAssignment": "No",
      "WorkType": newdata.WorkType || "construction_work",
      "ItemDate": newdata.SubmissionDate ? newdata.SubmissionDate : "",
      "Language": req.app.locals.env.lang || 'en',

      "Attachments": Attachments,
      "Assignment": Assignment
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-submission`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  if (apidata.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata.Message;
    resdata.errors = apidata.Errors || {};
    return resdata;
  }
  resdata.data = apidata.Data && apidata.Data.length > 0 ? apidata.Data[0] : null;
  resdata.apiurl = url;
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
  upsert-deduction
{ 
    "params" : {
        "LogIn": "khanh911234@gmail.com",
        "UpdateMode": "create_submission",
        "SessionId": "4C8E1A01-C92F-45D8-AB3E-5650D7EA36B3",
        "SubmissionId": null,
        "StartProcessNow": "Yes",
        "Stage": "implement",
        "SubmissionType": "contracted_quantity",
        "ItemId": 691870,
        "Qnty": "1222",
        "UnitPrice": "10000",
        "Remarks": "",
        "SubmissionName": "2025.09.15.v3",
        "ApplyDefinedAssignment": "No",
        //"WorkType": "construction_work",
        "ItemDate": "2025-11-25",
        "Language": "en",        
        "Attachments": [
            {
                "FileId": 2202
            },
            {
                "FileId": 2203
            },
            {
                "FileId": 2204
            },
            {
                "FileId": 2205
            },
            {
                "FileId": 2206
            },
            {
                "FileId": 2207
            }
        ],

        "Assignment": [
            {
                "UserId": 176117,
                "Role": "C",
                "Description": ""
            },
            {
                "UserId": 176117,
                "Role": "A",
                "Description": ""
            },
            {
                "UserId": 176117,
                "Role": "I",
                "Description": ""
            }
        ]
    }
}

{
    "params": {
        "LogIn": "khanh911234@gmail.com",
        "UpdateMode": "update_deduction",
        "ContractId": 304,
        "SessionId": "E8DD0BCA-442E-4EBE-AE4C-5E7E0FC7E596",
        "Deductions": [
            {
                "Code": "",
                "DeductionDate": "2025-11-24",
                "Description": "2025.09.15.v3 test file",
                "WorkCat": "backcharge_equipment",
                "Unit": "100M2",
                "UnitPrice": "200",
                "Qnty": "10000",
                "Remarks": "kiểm tra",
                "ProceedIt": "Yes"
            }
        ],
        "Language": "en",
        "AssignmentType": "manual",

        "ApplyDefinedAssignment": "No",
        "Attachments": [
            {
                "FileId": 2044
            },
            {
                "FileId": 2045
            },
            {
                "FileId": 2046
            },
            {
                "FileId": 2047
            },
            {
                "FileId": 2048
            },
            {
                "FileId": 2049
            }
        ],        
        "Assignment": [
            {
                "UserId": 176117,
                "Role": "C",
                "Description": ""
            },
            {
                "UserId": 175927,
                "Role": "C",
                "Description": ""
            },
            {
                "UserId": 175922,
                "Role": "C",
                "Description": ""
            },
            {
                "UserId": 176117,
                "Role": "A",
                "Description": ""
            },
            {
                "UserId": 175857,
                "Role": "I",
                "Description": ""
            },
            {
                "UserId": 175919,
                "Role": "I",
                "Description": ""
            },
            {
                "UserId": 175934,
                "Role": "I",
                "Description": ""
            }
        ]
    }
}
  */

  let Attachments = [];
  if (req.body['files'] && Array.isArray(req.body['files'])) {
    Attachments = req.body['files'].map(file => ({ FileId: parseInt(file.id) }));
  }

  let Assignment = [];
  if (req.body['Assignment'] && Array.isArray(req.body['Assignment']) && newdata.StartProcessNow === true) {
    //chỉ gán khi Description được nhập
    // Assignment = req.body['Assignment'].filter(item => item.Description && item.Description.trim() !== '').map(item => ({
    Assignment = req.body['Assignment'].map(item => ({
      UserId: parseInt(item.UserId),
      Role: item.Role,
      Description: item.Description || ''
    }));
  }

  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "UpdateMode": req.query.updatemode || "update_deduction",
      "ContractId": req.body.contractid || 0,
      "SessionId": req.session.sessionid,
      "Deductions": [
        {
          "Code": "",
          "DeductionDate": newdata.SubmissionDate ? newdata.SubmissionDate : "",
          "Description": newdata.SubmissionName || "",
          "WorkCat": newdata.SubmissionType || "backcharge_equipment",
          "Unit": newdata.Unit || "",
          "UnitPrice": newdata.UnitPrice || "0",
          "Qnty": newdata.Qnty || "0",
          "Remarks": newdata.Remarks || "",
          "ProceedIt": newdata.StartProcessNow ? "Yes" : "No",
        }
      ],
      "Language": req.app.locals.env.lang || 'en',
      "AssignmentType": req.body.assignmenttype || "manual",

      "ApplyDefinedAssignment": req.body.applydefinedassignment || "No",
      "Attachments": Attachments,
      "Assignment": Assignment
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-deduction`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  if (apidata.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata.Message;
    resdata.errors = apidata.Errors || {};
    return resdata;
  }
  resdata.data = apidata.Data && apidata.Data.length > 0 ? apidata.Data[0] : null;
  resdata.apiurl = `/api/upsert-deduction`;
  resdata.apipara = para;
  return resdata;
}


// Hàm để cập nhật data raci
const updateDataLineAll = async ({ req, data }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  //chuyên đổi req.body sang Object
  const updatedata = senserver.utils.convertReqBodyToObject(req.body, metaall);
  // // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  // resdata.errors = senserver.utils.validmodel({ model: newdata, meta: meta });
  // if (Object.keys(resdata.errors).length > 0) {
  //   resdata.status = 0;
  //   resdata.message = 'validation error';
  //   return resdata;
  // }
  //cập nhật bằng api
  /*
https://consims.com/api/update-submission-review
{
"params":
    {
        "WSId": "1vRP6ACyDFUmdh7ejeFcRmXiXjEgUOrv6_xNzrpMA1uo",
        "LogIn": "lotusviet@lotusviet.vn",
        "SessionId": "799A48B7-CB66-4595-8564-78E1BD2D00F4",
        "UpdateMode": "update_detail_all_work_type",
        "Language": "vi",
        "SubmissionDetail": [
            {
                "AssignmentId": "26284681",
                "ApprovalDecision": "Đang làm",
                "WorkCat": "contracted_quantity",
                "Qnty": 10555,
                "UnitPrice": 120,
                "Remarks": "Test huynh",
                "WorkType": "construction_work" //Truyền theo them số workType của hạng mục
            }
        ]
    }
}
  */
  const para = JSON.stringify({
    "params":
    {
      // "WSId": req.app.locals.env.api.WSId,
      "LogIn": req.session.user.username,
      "SessionId": req.session.sessionid,
      "UpdateMode": "update_detail_all_work_type",
      "Language": req.app.locals.env.lang || 'en',
      "SubmissionDetail": [
        {
          "AssignmentId": updatedata.ReviewAssignmentId,
          "ApprovalDecision": updatedata.ApprovalStatus,
          "WorkCat": updatedata.ReviewedWorkCat,
          "Qnty": updatedata.ReviewedQnty,
          "UnitPrice": updatedata.ReviewedUnitPrice,
          "Remarks": updatedata.RemarksOnApproval,
          "WorkType": updatedata.WorkType || "construction_work" //Truyền theo them số workType của hạng mục
        }
      ]
    }
  });



  const url = `${req.app.locals.env.api.host}/api/update-submission-review`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  resdata.apiurl = `/api/update-submission-review`;
  resdata.apipara = para;
  if (apidata.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata.Message;
    resdata.errors = apidata.Errors || {};
    return resdata;
  }
  resdata.data = apidata.Data && apidata.Data.length > 0 ? apidata.Data[0] : null;
  return resdata;
}

// Hàm để cập nhật data raci
const updateDataLine = async ({ req, data }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  //chuyên đổi req.body sang Object
  const updatedata = senserver.utils.convertReqBodyToObject(req.body, metareviewline);
  // // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  // resdata.errors = senserver.utils.validmodel({ model: newdata, meta: meta });
  // if (Object.keys(resdata.errors).length > 0) {
  //   resdata.status = 0;
  //   resdata.message = 'validation error';
  //   return resdata;
  // }
  //cập nhật bằng api
  /*
https://consims.com/api/update-submission-review
{
"params":
    {
        "WSId": "1vRP6ACyDFUmdh7ejeFcRmXiXjEgUOrv6_xNzrpMA1uo",
        "LogIn": "lotusviet@lotusviet.vn",
        "SessionId": "799A48B7-CB66-4595-8564-78E1BD2D00F4",
        "UpdateMode": "update_detail_all_work_type",
        "Language": "vi",
        "SubmissionDetail": [
            {
                "AssignmentId": "26284681",
                "ApprovalDecision": "Đang làm",
                "WorkCat": "contracted_quantity",
                "Qnty": 10555,
                "UnitPrice": 120,
                "Remarks": "Test huynh",
                "WorkType": "construction_work" //Truyền theo them số workType của hạng mục
            }
        ]
    }
}
  */
  const para = JSON.stringify({
    "params":
    {
      // "WSId": req.app.locals.env.api.WSId,
      "LogIn": req.session.user.username,
      "SessionId": req.session.sessionid,
      "UpdateMode": "update_detail_all_work_type",
      "Language": req.app.locals.env.lang || 'en',
      "SubmissionDetail": [
        {
          "AssignmentId": updatedata.AssignmentId,
          "ApprovalDecision": updatedata.ApprovalStatus,
          "WorkCat": updatedata.WorkCat,
          "Qnty": updatedata.Qnty,
          "UnitPrice": updatedata.UnitPrice,
          "Remarks": updatedata.Remarks,
          "WorkType": req.query.itemworktype || "construction_work" //Truyền theo them số workType của hạng mục
        }
      ]
    }
  });



  const url = `${req.app.locals.env.api.host}/api/update-submission-review`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  resdata.apiurl = `/api/update-submission-review`;
  resdata.apipara = para;
  if (apidata.Success !== 'true') {
    resdata.status = 0;
    resdata.message = apidata.Message;
    resdata.errors = apidata.Errors || {};
    return resdata;
  }
  resdata.data = apidata.Data && apidata.Data.length > 0 ? apidata.Data[0] : null;
  return resdata;
}


// Hàm để cập nhật data raci
const updateData = async ({ req, data }) => {
  if (["deduction", "add"].includes(req.body.WorkType)) {
    return await updateData4Deduction({ req, data });
  }

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
{ 
    "params" : {
    "LogIn": "lotusviet@lotusviet.vn",
    "UpdateMode": "update_submission",
    "StartProcessNow": "No",
    "Stage": "implement",
    "SubmissionType": "contracted_quantity",
    "UnitPrice": "10000",
    "Qnty": "123123",
    "Remarks": "123ew qe12321",
    "SubmissionName": "2025.09.15.v3",
    "ApplyDefinedAssignment": "No",
    "WorkType": "construction_work", ///tương đương workType ngoài hạn mục
    "ItemDate": "2025-11-25",
    "Language": "vi",
    "SessionId": "4C8E1A01-C92F-45D8-AB3E-5650D7EA36B3",
    "SubmissionId": 18717,
    "Attachments": [
        {
            "FileId": 2202
        },
        {
            "FileId": 2207
        }
    ],
    "Assignment": [
        {
            "UserId": 176117,
            "Role": "C",
            "Description": ""
        },
        {
            "UserId": 176117,
            "Role": "I",
            "Description": ""
        }
    ]
    }
}
  */

  let Attachments = [];
  if (req.body['files'] && Array.isArray(req.body['files'])) {
    Attachments = req.body['files'].map(file => ({ FileId: parseInt(file.id) }));
  }

  let Assignment = [];
  if (req.body['Assignment'] && Array.isArray(req.body['Assignment']) && newdata.StartProcessNow === true) {
    //chỉ gán khi Description được nhập
    // Assignment = req.body['Assignment'].filter(item => item.Description && item.Description.trim() !== '').map(item => ({
    Assignment = req.body['Assignment'].map(item => ({
      UserId: parseInt(item.UserId),
      Role: item.Role,
      Description: item.Description || ''
    }));
  }

  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "UpdateMode": "update_submission",
      "SessionId": req.session.sessionid,
      "SubmissionId": newdata.SubmissionId || null,
      "StartProcessNow": newdata.StartProcessNow ? "Yes" : "No",
      "Stage": newdata.Stage || "implement",
      "SubmissionType": newdata.SubmissionType || "contracted_quantity",
      "ItemId": newdata.ItemId || 0,
      "Qnty": newdata.Qnty || "0",
      "UnitPrice": newdata.UnitPrice || "0",
      "Remarks": newdata.Remarks || "",
      "SubmissionName": newdata.SubmissionName || "",
      "ApplyDefinedAssignment": "No",
      "WorkType": newdata.WorkType || "construction_work",
      "ItemDate": newdata.SubmissionDate ? newdata.SubmissionDate : "",
      "Language": req.app.locals.env.lang || 'en',

      "Attachments": Attachments,
      "Assignment": Assignment
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-submission`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();
  resdata.apipara = para;
  resdata.apiurl = `/api/upsert-submission`;

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

const updateData4Deduction = async ({ req, data }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  //chuyên đổi req.body sang Object
  const newdata = senserver.utils.convertReqBodyToObject(req.body, metadeduction);
  // // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  // resdata.errors = senserver.utils.validmodel({ model: newdata, meta: meta });
  // if (Object.keys(resdata.errors).length > 0) {
  //   resdata.status = 0;
  //   resdata.message = 'validation error';
  //   return resdata;
  // }
  //cập nhật bằng api
  /*
  https://consims.com/api/upsert-deduction
{"params" :{
    "LogIn": "lotusviet@lotusviet.vn",
    "UpdateMode": "update_deduction",
    "ContractId": 304,
    "SessionId": "BF646C61-EC64-4689-9EEC-098DF078EEA2",
    
    "Deductions": [
        {
            "SubmissionId": 7432,
            "Code": "",
            "DeductionDate": "2025-11-24",
            "Description": "2025.09.15.v3 test file",
            "WorkCat": "backcharge_material",
            "Unit": "100M2",
            "UnitPrice": "200",
            "Qnty": "10000",
            "Remarks": "kiểm tra",
            "ProceedIt": "Yes"
        }
    ],
    "Language": "en",
    "ApplyDefinedAssignment": "No",    
    "AssignmentType": "manual",
    "Attachments": [
        {
            "FileId": 2044
        },
        {
            "FileId": 2045
        },
        {
            "FileId": 2046
        },
        {
            "FileId": 2047
        },
        {
            "FileId": 2048
        },
        {
            "FileId": 2049
        }
    ],
    "Assignment": [
        {
            "UserId": 176117,
            "Role": "C",
            "Description": ""
        },
        {
            "UserId": 175927,
            "Role": "C",
            "Description": ""
        },
        {
            "UserId": 175922,
            "Role": "C",
            "Description": ""
        },
        {
            "UserId": 176117,
            "Role": "A",
            "Description": ""
        },
        {
            "UserId": 175857,
            "Role": "I",
            "Description": ""
        },
        {
            "UserId": 175919,
            "Role": "I",
            "Description": ""
        },
        {
            "UserId": 175934,
            "Role": "I",
            "Description": ""
        }
    ]
}}
  */

  let Attachments = [];
  if (req.body['files'] && Array.isArray(req.body['files'])) {
    Attachments = req.body['files'].map(file => ({ FileId: parseInt(file.id) }));
  }

  let Assignment = [];
  if (req.body['Assignment'] && Array.isArray(req.body['Assignment']) && newdata.StartProcessNow === true) {
    //chỉ gán khi Description được nhập
    // Assignment = req.body['Assignment'].filter(item => item.Description && item.Description.trim() !== '').map(item => ({
    Assignment = req.body['Assignment'].map(item => ({
      UserId: parseInt(item.UserId),
      Role: item.Role,
      Description: item.Description || ''
    }));
  }

  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "UpdateMode": req.query.updatemode || "update_deduction",
      "ContractId": newdata.ContractId || 0,
      "SessionId": req.session.sessionid,
      "Deductions": [
        {
          "SubmissionId": newdata.SubmissionId || 0,
          "Code": newdata.Code || "",
          "DeductionDate": newdata.SubmissionDate || "",
          "Description": newdata.SubmissionName || "",
          "WorkCat": newdata.SubmissionType || "backcharge_material",
          "Unit": newdata.Unit || "",
          "UnitPrice": newdata.UnitPrice || "0",
          "Qnty": newdata.Qnty || "0",
          "Remarks": newdata.Remarks || "",
          "ProceedIt": newdata.StartProcessNow ? "Yes" : "No",
        }
      ],
      "Language": req.app.locals.env.lang || 'en',
      "ApplyDefinedAssignment": req.query.applydefinedassignment || "No",
      "AssignmentType": req.query.assignmenttype || "manual",

      "Attachments": Attachments,
      "Assignment": Assignment
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-deduction`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const apidata = await response.json();

  resdata.apipara = para;
  resdata.apiurl = `/api/upsert-deduction`;

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
  /*
  https://consims.com/api/get-submission?params=
  {"LogIn":"lotusviet@lotusviet.vn","SessionId":"7CFB9809-620E-489D-A40C-FB8DAFCD5A71","DisplayMode":"detail_submission_by_id_web","SubmissionId":190191,"Language":"vi","WorkType":"construction_work"}
  */
  if (['deduction', 'add'].includes(req.query.worktype)) {
    return await findByKey4Deduction({ req, value });
  }


  const id = req.query[keyField.field] || 0;
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "DisplayMode": req.query.displaymode || "detail_submission_by_id_web",
    "SubmissionId": id,
    "Language": req.app.locals.env.lang || 'en',
    "WorkType": req.query.worktype || "construction_work"
  });
  const url = `${req.app.locals.env.api.host}/api/get-submission?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  const result = data.Data && data.Data.length > 0 ? data.Data[0] : null;
  return result || {};
}
const findByKey4Deduction = async ({ req, value }) => {
  /*
{{baseURL}}/api/get-deduction-list?params={
"LogIn":"lotusviet@lotusviet.vn","SessionId":"BF646C61-EC64-4689-9EEC-098DF078EEA2","DisplayMode":"deduction_detail_list_by_user",
"ItemId":29,"PageSize":10,"PageNum":1,"WorkType":"deduction",
"ContractId":304,"ApprovalStatus":"All","Stage":"implement","WorkCat":"All","Language":"vi",
"OverallApprovalStatus":"No",
"SubmissionId":7213
}
  */

  const id = req.query[keyField.field] || 0;
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "DisplayMode": req.query.displaymode || "deduction_detail_list_by_user",
    "ItemId": req.query.itemid || 0,
    "PageSize": 10,
    "PageNum": 1,
    "WorkType": req.query.worktype || "deduction",
    "ContractId": req.query.contractid || 0,
    "ApprovalStatus": req.query.approvalstatus || "All",
    "Stage": req.query.stage || "implement",
    "WorkCat": req.query.workcat || "All",
    "Language": req.app.locals.env.lang || 'vi',
    "OverallApprovalStatus": req.query.overallapprovalstatus || "No",
    "SubmissionId": id
  });
  const url = `${req.app.locals.env.api.host}/api/get-deduction-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} ${para} ${url} `); }
  const result = data.Data && data.Data.length > 0 ? data.Data[0] : null;
  return result || {};
}

// Hàm để lấy tất cả data
const getAllDatas = async () => {
  return datas;
}
//Hàm lấy danh sách data với phân trang và sắp xếp
const getDatas = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {

  if (req.query.filterworktype === 'deduction' || req.query.filterworktype === 'add') {
    return await getDatas4Deduction({ req, page, pagesize, sortFields, sortTypes, filterConditions });
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

  /*
  {{baseURL}}/api/get-submission?params=
  {"LogIn":"lotusviet@lotusviet.vn","SessionId":"EF715E36-B846-4578-89B3-3CA47856C344","DisplayMode":"detail_submission_by_user","ItemId":694306,"PageSize":1000,"PageNum":1,"WorkType":"construction_work","ContractId":304,"ApprovalStatus":"All","Stage":"implement","WorkCat":"All","Language":"vi","OverallApprovalStatus":"No"}
  */

  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "DisplayMode": req.query.displaymode || "detail_submission_by_user",
    "ItemId": req.query.id || 0,
    "PageSize": pagesize,
    "PageNum": page,
    "WorkType": req.query.filterworktype || "construction_work",
    "ContractId": req.query.parentid || 0,
    "ApprovalStatus": req.query.filterapprovalstatus || "All",
    "Stage": req.query.filterstage || "implement",
    "WorkCat": req.query.filterworkcat || "All",
    "Language": req.app.locals.env.lang || 'en',
    "OverallApprovalStatus": req.query.filteroverallapprovalstatus || "No"
  });
  const url = `${req.app.locals.env.api.host}/api/get-submission?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} ${para} ${url} `); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize), apiurl: `/api/get-submission`, apipara: para };
}

//Hàm lấy danh sách data với phân trang và sắp xếp
const getDatas4Deduction = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  {{baseURL}}/api/get-deduction-list?
  params={"LogIn":"lotusviet@lotusviet.vn","SessionId":"D500B1D8-1E28-4022-BEB1-B0B9622B8036","DisplayMode":"deduction_detail_list_by_user","ItemId":			29,"PageSize":10,"PageNum":1,"WorkType":"deduction","ContractId":304,"ApprovalStatus":"All","Stage":"implement","WorkCat":"All","Language":"vi","OverallApprovalStatus":"No"}
  params:{"LogIn":"lotusviet@lotusviet.vn",
  "SessionId":"D500B1D8-1E28-4022-BEB1-B0B9622B8036",
  "DisplayMode":"deduction_detail_list_by_user",
  "ItemId":			29,
  "PageSize":10,
  "PageNum":1,
  "WorkType":"deduction",
  "ContractId":304,
  "ApprovalStatus":"All",
  "Stage":"implement",
  "WorkCat":"All",
  "Language":"vi",
  "OverallApprovalStatus":"No"}

params:{
"LogIn":"lotusviet@lotusviet.vn",
"SessionId":"22979C33-C31A-454A-8528-93BC88877590",
"ContractId":304,
"Language":"vi",
"DisplayMode":"deduction_detail_list_sheet",
"PageSize":1000,
"OverallApprovalStatus":"No",
"Keyword":"",
"CostType":"All",
"ApprovalStatus":"All",
"WorkCat":"penalty_amount",
"CollectStatus":"All",
"FromDate":"","ToDate":"",
"ForwardedOnly":"No",
"PageNum":1
}  
  */

  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "ContractId": req.query.parentid || 0,
    "Language": req.app.locals.env.lang || 'en',
    "DisplayMode": req.query.displaymode || "deduction_detail_list_sheet",
    "PageSize": pagesize,
    "OverallApprovalStatus": req.query.filteroverallapprovalstatus || req.query.overallapprovalstatus || "No",
    "Keyword": keyword,
    "CostType": req.query.costtype || "All",
    "ApprovalStatus": req.query.filterapprovalstatus || req.query.approvalstatus || "All",
    "WorkCat": req.query.workcat || "penalty_amount",
    "CollectStatus": req.query.collectstatus || "All",
    "FromDate": req.query.fromdate || "",
    "ToDate": req.query.todate || "",
    "ForwardedOnly": req.query.forwardedonly || "No",
    "PageNum": page

  });
  const url = `${req.app.locals.env.api.host}/api/get-deduction-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} ${para} ${url} `); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize), apiurl: `/api/get-deduction-list`, apipara: para };
}


//Hàm lấy danh sách data all với phân trang và sắp xếp
const getDatasAll = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  {{baseURL}}/api/get-submisson-for-reviewer?
  params={
  "LogIn":"lotusviet@lotusviet.vn",
  "SessionId":"E1619C4B-9F01-4D8D-AA3E-D449720E53F4",
  "Language":"vi",
  "DisplayMode":"to_be_approved_submission",
  "PageSize":10,
  "Keyword":"",
  "WorkType":"construction_work",
  "ApprovalStatus":"All",
  "Role":"All",
  "Stage":"All",
  "WorkCat":"All",
  "FromDate":"",
  "ToDate":"",
  "PageNum":1
  }
  */
  /*
      "LogIn": req.session.user.username,
      "SessionId": req.session.sessionid,
      "DisplayMode": req.query.displaymode || "detail_submission_by_user",
      "ItemId": req.query.id || 0,
      "PageSize": pagesize,
      "PageNum": page,
      "WorkType": req.query.filterworktype || "construction_work",
      "ContractId": req.query.parentid || 0,
      "ApprovalStatus": req.query.filterapprovalstatus || "All",
      "Stage": req.query.filterstage || "implement",
      "WorkCat": req.query.filterworkcat || "All",
      "Language": req.app.locals.env.lang || 'en',
      "OverallApprovalStatus": req.query.filteroverallapprovalstatus || "No"
  */

  /*
    const para = JSON.stringify({
      "LogIn": req.session.user.username,
      "SessionId": req.session.sessionid,
      "Language": req.app.locals.env.lang || 'en',
      "DisplayMode": req.query.displaymode || "to_be_approved_submission",
      "PageSize": pagesize,
      "Keyword": req.query.filterkeyword || "",
      "ContractId": req.query.filtercontract || 0,
      "WorkType": req.query.filterworktype || "construction_work",
      "ApprovalStatus": req.query.filterapprovalstatus || "All",
      "Role": req.query.filterrole || "All",
      "Stage": req.query.filterstage || "All",
      "WorkCat": req.query.filterworkcat || "All",
      "FromDate": req.query.filterfromdate || "",
      "ToDate": req.query.filtertodate || "",
      "PageNum": page
    });
  
  */
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "ContractId": req.query.filtercontract || 0,
    "Language": req.app.locals.env.lang || 'en',
    "DisplayMode": req.query.displaymode || "to_be_approved_submission",
    "PageSize": pagesize,
    "Keyword": req.query.filterkeyword || "",
    "WorkType": req.query.filterworktype || "construction_work",
    "ApprovalStatus": req.query.filterapprovalstatus || "All",
    "Role": req.query.filterrole || "All",
    "Stage": req.query.filterstage || "All",
    "WorkCat": req.query.filterworkcat || "All",
    "FromDate": req.query.filterfromdate || "",
    "ToDate": req.query.filtertodate || "",
    "PageNum": page,
    "CacheSessionId": req.query.cachesessionid || ""
  });


  const url = `${req.app.locals.env.api.host}/api/get-submisson-for-reviewer?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} ${para} ${url}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize), cachesessionid: data.CacheSessionId || "", apipara: para, apiurl: `/api/get-submisson-for-reviewer` };
}

const getReviewData = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  https://consims.com/api/get-submission-status?params={
  "LogIn":"lotusviet@lotusviet.vn","SessionId":"803A42D8-871F-49D5-9077-F69525F8B2DE","DisplayMode":"get_submission_status_all","ApprovalStatus":"All","SubmissionId":188544,"Language":"vi","WorkType":"construction_work","Type":"assigned"
  }
  */

  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "DisplayMode": req.query.displaymode || "get_submission_status_all",
    "ApprovalStatus": req.query.approvalstatus || "All",
    "SubmissionId": req.query.submissionid || 0,
    "Language": req.app.locals.env.lang || 'en',
    "WorkType": req.query.worktype || "construction_work",
    "Type": req.query.type || "assigned"
  });
  const url = `${req.app.locals.env.api.host}/api/get-submission-status?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} ${para} ${"/api/get-submission-status"}`); }
  //tạm không phân trang
  const total = 0;// data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  return { datas: [data] || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}


// Upload nhiều file từ NodeJS sang API khác

const uploadFiles = async ({ req }) => {
  const files = req.files || [];

  if (!files.length) { throw new Error('No file to upload'); }

  const url = `${req.app.locals.env.api.host}/api/upload-document`;
  const formData = new FormData();

  /*
  formdata.append("LogIn", "lotusviet@lotusviet.vn");
  formdata.append("WorkType", "construction_work");
  formdata.append("SessionId", "FB6DCEC5-D379-422E-88A2-95BA174F7EE8");
  formdata.append("Assignment", "26284686");
  formdata.append("DisplayMode", "Modified Upload");
  formdata.append("SourceId", "190193");
  */
  // Thông tin user
  formData.append('LogIn', req.session.user.username);
  formData.append('Language', req.app.locals.env.lang || "en");
  formData.append('SessionId', req.session.sessionid);
  // nếu có SourceId trong req.body thì thêm vào
  if (req.body.sourceid) {
    formData.append('SourceId', req.body.sourceid);
  }
  // nếu có Assignment trong req.body thì thêm vào
  if (req.body.assignmentid) {
    formData.append('Assignment', req.body.assignmentid);
  }

  if (req.body.worktype) {
    formData.append('WorkType', req.body.worktype);
  }
  else {
    formData.append('WorkType', 'construction_work');
  }

  if (req.body.displaymode) {
    formData.append('DisplayMode', req.body.displaymode);
  }
  else {
    formData.append('DisplayMode', 'Created Upload');
  }

  // Append nhiều file
  // for (const file of files) {
  //   formData.append(
  //     'files',
  //     new Blob([file.buffer], { type: file.mimetype }),
  //     file.originalname
  //   );
  // }
  // const response = await fetch(url, {
  //   method: 'POST',
  //   body: formData
  // });

  const fields = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      fields[key] = value;
    } else {
      // value là File / Blob
      files.push({
        fieldName: key,
        file: value
      });
    }
  }

  const { body, boundary } = senserver.utils.buildMultipartBody(
    fields,  // multer fields
    files // multer files
  );

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': body.length
    },
    body
  });

  const data = await response.json();

  if (data.Success !== 'true') {
    return { status: 0, message: `${data.Message || 'Upload error'}`, row: {}, apiurl: `/api/upload-document` };
  }

  return { status: 1, message: data.Message, datas: data.Data || [] };

};

//kiểm tra xem có quyền upload không
const checkRoleUpload = async ({ req, value }) => {
  /*
  https://consims.com/api/get-editable-files?params={"WSId":"1nhUicHniE_CykXQqSQlLM3NLg5xhFO19VD2wHziq5WA","LogIn":"lotusviet@lotusviet.vn",&"AssignmentId"=26280667,"DisplayMode":"is_allow_to_add_file_by_assignment","WorkType":"construction_work","SessionId":"41C88AB9-6140-43B8-AA76-FCD592360FF7"}
  */

  const id = req.query[keyField.field] || 0;
  const para = JSON.stringify({
    "LogIn": req.session.user.username || "",
    "AssignmentId": req.query.assignmentid || 0,
    "DisplayMode": req.query.displaymode || "is_allow_to_add_file_by_assignment",
    "WorkType": req.query.worktype || "construction_work",
    "SessionId": req.session.sessionid || ""
  });
  const url = `${req.app.locals.env.api.host}/api/get-editable-files?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message || ''}`); }
  return data || { apipara: para };
}

// Xuất các hàm và lớp để sử dụng ở nơi khác
module.exports = {
  meta,
  metaall,
  data: Model,
  dataall: ModelAll,
  datas,
  addData,
  deleteData,
  updateData,
  findByField,
  findByKey,
  getAllDatas,
  getDatas,
  getDatasAll,
  postCreate,
  postEdit,
  postEditLine,
  postEditLineAll,
  postDelete,
  getList,
  getListAll,
  getLookup,
  getCreate,
  getEdit,
  getReview,
  uploadFiles,
  checkRoleUpload,
  metareview,
  metareviewline
};
