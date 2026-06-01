const senserver = require("../models/senserver.js");
// module.js
/*
        {
            "UserId": 175967,
            "Account": "",
            "IsActive": "Yes",
            "JobTitle": "",
            "Email": "",
            "PhoneDirect": "",
            "IsPrimary": "No"
        }

                {
            "UserId": 3815,
            "FullName": "Nguyễn Minh Chính",
            "Account": "chinh.nguyenminh",
            "IsActive": "Yes",
            "JobTitle": "",
            "Email": "chinh.nguyenminh@test.com",
            "PhoneDirect": "",
            "IsPrimary": "No"
        }

        "Email": "xutbe2211@gmail.com",
        "Password": "StrongPassw0rd!",
        "LoginName": "xutbe2211@gmail.com",
        "Phone": "0912345678",
        "FullName": "Nguyen Van A",
        "Address": "123 Đường Lý Thường Kiệt, Quận 10, TP.HCM",
        "Sex": "Male",
        "Birthday": "1990-05-20",
        "UpdateMode": "create_user"

         {
        "Email": "xutbe221@gmail.com",
        "Password": "StrongPassw0rd!",
        "LoginName": "exampleuser",
        "Phone": "0912345678",
        "FullName": "Nguyen Van A",
        "Address": "123 Đường Lý Thường Kiệt, Quận 10, TP.HCM",
        "Sex": "Male",
        "Birthday": "1990-05-20",
        "ClientId": 6,
        "UpdateMode": "update_user_info"
        }


*/
const meta = [
  { field: 'ClientId', type: 'bigint', description: 'Client ID', key: true, isnullable: true, show: false, visible: false },
  { field: 'ClientCode', type: 'string', description: 'Client Code', isnullable: true, show: true, visible: true },
  { field: 'CompanyName', type: 'string', description: 'Company Name', isnullable: false, show: true, visible: true },
  { field: 'RegistrationNumber', type: 'string', description: 'Registration Number', isnullable: true, show: true, visible: true },
  { field: 'TaxID', type: 'string', description: 'Tax ID', isnullable: true, show: true, visible: true },
  { field: 'Industry', type: 'string', description: 'Industry', isnullable: true, show: true, visible: true },
  { field: 'Website', type: 'string', description: 'Website', isnullable: true, show: true, visible: true },
  { field: 'PhoneMain', type: 'string', description: 'Phone Main', isnullable: true, show: true, visible: true },
  { field: 'EmailMain', type: 'string', description: 'Email Main', isnullable: true, show: true, visible: true },
  { field: 'Street', type: 'string', description: 'Street', isnullable: true, show: true, visible: true },
  { field: 'City', type: 'string', description: 'City', isnullable: true, show: true, visible: true },
  { field: 'StateProvince', type: 'string', description: 'State Province', isnullable: true, show: true, visible: true },
  { field: 'PostalCode', type: 'string', description: 'Postal Code', isnullable: true, show: true, visible: true },
  { field: 'Country', type: 'string', description: 'Country', isnullable: true, show: true, visible: true },
  { field: 'ClientType', type: 'string', description: 'Client Type', isnullable: true, show: true, visible: true },
  { field: 'IsActive', type: 'string', description: 'Active', isnullable: true, show: true, visible: true }
]
//nếu meta không có trường key=true thì gán trường đầu tiên trong meta
if (!meta.some(field => field.key)) { meta[0].key = true; }
const keyField = meta.find(field => field.key);

class Model {
  constructor({ ClientId, ClientCode, CompanyName, RegistrationNumber, TaxID, Industry, Website, PhoneMain, EmailMain, Street, City, StateProvince, PostalCode, Country, ClientType, IsActive } = {}) {
    this.ClientId = ClientId ?? 0;
    this.ClientCode = ClientCode ?? '';
    this.CompanyName = CompanyName ?? '';
    this.RegistrationNumber = RegistrationNumber ?? '';
    this.TaxID = TaxID ?? '';
    this.Industry = Industry ?? '';
    this.Website = Website ?? '';
    this.PhoneMain = PhoneMain ?? '';
    this.EmailMain = EmailMain ?? '';
    this.Street = Street ?? '';
    this.City = City ?? '';
    this.StateProvince = StateProvince ?? '';
    this.PostalCode = PostalCode ?? '';
    this.Country = Country ?? '';
    this.ClientType = ClientType ?? '';
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
      "LogIn": req.session.user.username,
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
          "IsActive": newdata.IsActive
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
  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
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
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  return { status: 1, message: data.Message, row: data.Data || {} };
}

// Hàm để tìm theo trường tùy chỉnh
const findByField = async ({ field, value }) => {
  return datas.find(data => data[field] === value);
};
// Hàm tìm theo khóa
const findByKey = async ({ req, value }) => {
  const id = req.query[keyField.field] || 0;
  const para = JSON.stringify({"ClientType":"All","DisplayMode":"full_list","ClientId":id});
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
