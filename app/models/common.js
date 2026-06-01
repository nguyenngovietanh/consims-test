const senserver = require("../models/senserver.js");
/*
        {
            "GId": "8C319AFD-8FD9-4C4B-B7B3-096A40CC77BF",
            "FileId": 2052,
            "FileName": "123123 - Copy (2).txt",
            "UploadedBy": "khanh911234",
            "UploadingDate": "2025-11-25T15:21:29.857",
            "ClientDocs": "No",
            "Id": 2208
        }
*/

const metafile = [
  { field: 'GId', type: 'string', description: 'GUID', isnullable: false, show: false, visible: true },
  { field: 'FileId', type: 'bigint', description: 'File ID', isnullable: false, show: false, visible: true },
  { field: 'FileName', type: 'string', description: 'File Name', isnullable: false, show: true, visible: true },
  { field: 'UploadedBy', type: 'string', description: 'Uploaded By', isnullable: false, show: true, visible: true },
  { field: 'UploadingDate', type: 'datetime', description: 'Uploading Date', isnullable: false, show: true, visible: true },
  { field: 'ClientDocs', type: 'string', description: 'Client Docs', isnullable: true, show: true, visible: true },
  { field: 'Id', type: 'bigint', description: 'ID', key: true, isnullable: false, show: false, visible: true }
]

const metacertificate = [
  { field: 'Id', type: 'bigint', description: 'ID', isnullable: false, show: false, visible: true },
  { field: 'CertificateBy', type: 'string', description: 'Certificate By', isnullable: false, show: true, visible: true },
  { field: 'CertificateDate', type: 'datetime', description: 'Certificate Date', isnullable: false, show: true, visible: true },
  { field: 'Name', type: 'string', description: 'Name', isnullable: false, show: true, visible: true },
  { field: 'Note', type: 'string', description: 'Note', isnullable: true, show: true, visible: true },
  { field: 'JobTitle', type: 'string', description: 'Job Title', isnullable: true, show: true, visible: true },
  { field: 'Department', type: 'string', description: 'Department', isnullable: true, show: true, visible: true },
  { field: 'Status', type: 'int', description: 'Status', isnullable: false, show: true, visible: true }

]

const getLookup = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortField = req.query.sortfield;
  const sortType = req.query.sorttype;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};

  const lookupType = req.query.lookupType || '';
  if (lookupType === 'raci_list') {
    return await raci_list({ req, page, pagesize, sortField, sortType, filterConditions });
  }

  if (lookupType === 'raci_list_opt') {
    return await raci_list_opt({ req, page, pagesize, sortField, sortType, filterConditions });
  }

  if (lookupType === 'memberincontract') {
    return await memberincontract({ req, page, pagesize, sortField, sortType, filterConditions });
  }
  if (lookupType === 'workcategory') {
    return await workcategory({ req, page, pagesize, sortField, sortType, filterConditions });
  }

  if (lookupType === 'worktype') {
    return await worktype({ req, page, pagesize, sortField, sortType, filterConditions });
  }

  if (lookupType === 'worktype4po') {
    return await worktype4po({ req, page, pagesize, sortField, sortType, filterConditions });
  }

  if (lookupType === 'contractlinestatus') {
    return await contractlinestatus({ req, page, pagesize, sortField, sortType, filterConditions });
  }

  if (lookupType === 'contractlineperformreviewstatus') {
    return await contractlineperformreviewstatus({ req, page, pagesize, sortField, sortType, filterConditions });
  }

  if (lookupType === 'contractlineperformreviewstatusupdate') {
    return await contractlineperformreviewstatusupdate({ req, page, pagesize, sortField, sortType, filterConditions });
  }

  if (lookupType === 'contract') {
    return await contract({ req, page, pagesize, sortField, sortType, filterConditions });
  }

  if (lookupType === 'unit') {
    return await getUnit({ req, page, pagesize, sortField, sortType, filterConditions });
  }

  if (lookupType === 'materialtype') {
    return await getMaterialType({ req, page, pagesize, sortField, sortType, filterConditions });
  }


  //trả về lỗi nếu không có lookupType hợp lệ
  throw new Error('Invalid lookupType');

}

//Hàm lấy danh sách data với phân trang và sắp xếp cho lookup
const raci_list = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  // if (pagesize == 0) pagesize = 10;
  // params:{"RoleType":"raci_list","ActiveRoleOnly":"No","DisplayMode":"full_list","LogIn":"lotusviet@lotusviet.vn"}
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Language": req.app.locals.env.lang || "en",
    "RoleType": "raci_list",
    "ActiveRoleOnly": "No",
    "DisplayMode": req.query.displaymode || "full_list"
  });

  const url = `${req.app.locals.env.api.host}/api/get-role-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}

//Hàm lấy danh sách data với phân trang và sắp xếp cho lookup
const raci_list_opt = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  // if (pagesize == 0) pagesize = 10;
  // https://consims.com/api/get-role-list?params={"ActiveRoleOnly":"No","DisplayMode":"full_list_opt","LogIn":"lotusviet@lotusviet.vn","Language":"en","SessionId":"DDA4B62A-A8E3-41B5-940E-AF0943F5C515"}
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "Language": req.app.locals.env.lang || "en",
    "SessionId": req.session.sessionid,
    "ActiveRoleOnly": req.query.activeroleonly || "No",
    "DisplayMode": req.query.displaymode || "full_list_opt"
  });

  const url = `${req.app.locals.env.api.host}/api/get-role-list?params=${encodeURIComponent(para)}`;
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
const memberincontract = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  params={"LogIn": "lotusviet@lotusviet.vn", "DisplayMode": "get_contract_users", "WorkType": "construction_work", "ContractId": 17308}
  */
  //params:{"LogIn": "lotusviet@lotusviet.vn", "DisplayMode": "get_contract_users", "WorkType": "construction_work", "ContractId": 17327, "Keyword": "lotus"}

  const id = parseInt(req.query.id) || 0;
  const para = JSON.stringify({
    "SessionId": req.session.sessionid,
    "LogIn": req.session.user.username,
    "DisplayMode": "get_contract_users",
    "WorkType": "construction_work",
    "ContractId": id,
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

//Hàm lấy danh sách work category 
const workcategory4deduction = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  {{baseURL}}/api/get-contractual-type?params={"SessionId":"D2D46B2E-1ACA-49FC-9D06-6B3CE4545170", "LogIn":"lotusviet@lotusviet.vn","DisplayMode":"full_list","Type":"quantity","Language":"vi"}
  {{baseURL}}/api/get-contractual-type-list?params={"LogIn":"lotusviet@lotusviet.vn","Language":"vi","WorkType":"deduction","SessionId":"D8AAD5B1-434C-4A33-BAF1-311A4E9D2FEE"}
  */

  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "Language": req.app.locals.env.lang || 'en',
    "WorkType": req.query.type || "deduction",
    "SessionId": req.session.sessionid,
  });
  const url = `${req.app.locals.env.api.host}/api/get-contractual-type-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  // const total = data.TotalRows || 0;
  //map id tự tăng
  if (data.Data && Array.isArray(data.Data)) {
    data.Data.forEach((item, index) => {
      item.Id = index + 1;
    });
  }
  const total = data.TotalRows || (data.Data ? data.Data.length : 0);
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}

const workcategory = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
  if (req.query.type === 'deduction') {
    return await workcategory4deduction({ req, page, pagesize, sortFields, sortTypes, filterConditions });
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
  {{baseURL}}/api/get-contractual-type?params={"SessionId":"D2D46B2E-1ACA-49FC-9D06-6B3CE4545170", "LogIn":"lotusviet@lotusviet.vn","DisplayMode":"full_list","Type":"quantity","Language":"vi"}
  {{baseURL}}/api/get-contractual-type-list?params={"LogIn":"lotusviet@lotusviet.vn","Language":"vi","WorkType":"deduction","SessionId":"D8AAD5B1-434C-4A33-BAF1-311A4E9D2FEE"}
  */

  const para = JSON.stringify({
    "SessionId": req.session.sessionid,
    "LogIn": req.session.user.username,
    "DisplayMode": req.query.displaymode || "full_list",
    "Type": req.query.type || 'quantity',
    "Language": req.app.locals.env.lang || 'en'
  });
  const url = `${req.app.locals.env.api.host}/api/get-contractual-type?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  // const total = data.TotalRows || 0;
  //map id tự tăng
  if (data.Data && Array.isArray(data.Data)) {
    data.Data.forEach((item, index) => {
      item.Id = index + 1;
    });
  }
  const total = data.TotalRows || (data.Data ? data.Data.length : 0);
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}

//Hàm lấy danh sách work type
const worktype = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  https://consims.com/api/get-work-type?params={"LogIn":"lotusviet@lotusviet.vn","UpdateMode":"create_submission","SessionId":"9A9BAEF0-D3BD-4193-A379-E5832CBC4D0C"}
  */

  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "UpdateMode": req.query.updatemode || "create_submission",
    "SessionId": req.session.sessionid

  });
  const url = `${req.app.locals.env.api.host}/api/get-work-type?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  // const total = data.TotalRows || 0;
  // //map id tự tăng
  // if (data.Data && Array.isArray(data.Data)) {
  //   data.Data.forEach((item, index) => {
  //     item.Id = index + 1;
  //   });
  // }
  const total = data.TotalRows || (data.Data ? data.Data.length : 0);
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}

//Hàm lấy danh sách work type cho po
const worktype4po = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  https://consims.com/api/get-work-type?params={"LogIn":"khanhvhd@centralcons.vn","DisplayMode":"for_PO_all","SessionId":"5A5A25E9-1C08-4928-91FD-1129CEEEFB70"}
  */

  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "DisplayMode": req.query.displaymode || "for_PO_all",
    "SessionId": req.session.sessionid
  });
  const url = `${req.app.locals.env.api.host}/api/get-work-type?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  // const total = data.TotalRows || 0;
  // //map id tự tăng
  // if (data.Data && Array.isArray(data.Data)) {
  //   data.Data.forEach((item, index) => {
  //     item.Id = index + 1;
  //   });
  // }
  const total = data.TotalRows || (data.Data ? data.Data.length : 0);
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}

//Hàm lấy danh sách trạng thái chi tiết hợp đồng
const contractlinestatus = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  https://consims.com/api/get-processing-status-list?params={"WSId":"1nhUicHniE_CykXQqSQlLM3NLg5xhFO19VD2wHziq5WA","LogIn":"lotusviet@lotusviet.vn","DisplayMode":"approval","Language":"vi","SessionId":"F184016C-A27F-4E80-86AE-2083C43301A7"}
  */

  const para = JSON.stringify({
    "WSId": req.app.locals.env.api.WSId || '',
    "LogIn": req.session.user.username,
    "DisplayMode": req.query.displaymode || "approval",
    "Language": req.app.locals.env.lang || "en",
    "SessionId": req.session.sessionid
  });
  const url = `${req.app.locals.env.api.host}/api/get-processing-status-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  // const total = data.TotalRows || 0;
  // //map id tự tăng
  // if (data.Data && Array.isArray(data.Data)) {
  //   data.Data.forEach((item, index) => {
  //     item.Id = index + 1;
  //   });
  // }
  const total = data.TotalRows || (data.Data ? data.Data.length : 0);
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}


//Trạng thái dùng cho submission review
const contractlineperformreviewstatus = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  https://consims.com/api/get-processing-status-list?params=
  {"WSId":"1nhUicHniE_CykXQqSQlLM3NLg5xhFO19VD2wHziq5WA","LogIn":"lotusviet@lotusviet.vn","DisplayMode":"approval","Language":"en","SessionId":"F184016C-A27F-4E80-86AE-2083C43301A7"}
  */

  const para = JSON.stringify({
    "WSId": req.app.locals.env.api.WSId || '',
    "LogIn": req.session.user.username,
    "DisplayMode": req.query.displaymode || "approval",
    "Language": req.app.locals.env.lang || "en",
    "SessionId": req.session.sessionid
  });

  const url = `${req.app.locals.env.api.host}/api/get-processing-status-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}

//trạng thái dùng cho submission review update
const contractlineperformreviewstatusupdate = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  {{baseURL}}/api/get-processing-status-list?params={"WSId":"1nhUicHniE_CykXQqSQlLM3NLg5xhFO19VD2wHziq5WA","LogIn":"lotusviet@lotusviet.vn","DisplayMode":"approval_no_all","Language":"vi","SessionId":"F184016C-A27F-4E80-86AE-2083C43301A7","Role":"A"}
  */

  const para = JSON.stringify({
    "WSId": req.app.locals.env.api.WSId || '',
    "LogIn": req.session.user.username,
    "DisplayMode": req.query.displaymode || "approval_no_all",
    "Language": req.app.locals.env.lang || "en",
    "SessionId": req.session.sessionid,
    "Role": req.query.role || ""
  });

  const url = `${req.app.locals.env.api.host}/api/get-processing-status-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}


// Upload nhiều file từ NodeJS sang API khác
const uploadFiles = async ({ req }) => {
  const files = req.files || [];
  if (!files.length) { throw new Error('No file to upload'); }

  const url = `${req.app.locals.env.api.host}/api/upload-document`;
  const formData = new FormData();

  /*
  LogIn:lotusviet@lotusviet.vn
  Language:vi
  DisplayMode:Created Upload
  //DisplayMode:Modified Upload
  //SourceId:1164743
  SourceType:construction_submission
  */
  // Thông tin user
  formData.append('LogIn', req.session.user.username);
  formData.append('Language', req.app.locals.env.lang || "en");
  // formData.append('DisplayMode', 'Created Upload');
  // formData.append('WorkType', 'construction_work');
  // nếu có SourceId trong req.body thì thêm vào
  if (req.body.SourceId) {
    formData.append('SourceId', req.body.SourceId);
  }
  if (req.body.WorkType) {
    formData.append('WorkType', req.body.WorkType);
  }
  else {
    formData.append('WorkType', 'construction_work');
  }

  if (req.body.DisplayMode) {
    formData.append('DisplayMode', req.body.DisplayMode);
  }
  else {
    formData.append('DisplayMode', 'Created Upload');
  }

  // // Append nhiều file
  // for (const file of files) {
  //   formData.append(
  //     'files', // <-- tên field backend API nhận (files[])
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


  // if (!response.ok) {
  //   return { status: 0, message: `Upload failed: ${response.status}`, row: {} };
  // }

  const data = await response.json();

  if (data.Success !== 'true') {
    // throw new Error(data.Message || 'Upload error');
    return { status: 0, message: `${data.Message || 'Upload error'}` , row: {}, apiurl: `/api/upload-document` };
  }

  return { status: 1, message: data.Message, datas: data.Data || [] };

};

// Bỏ đính kèm file
const removeFiles = async ({ req }) => {
  /*
  https://consims.com/api/delete-document
  {
    "FileIds": [
        6543
    ],
    "LogIn": "lotusviet@lotusviet.vn",
    "SessionId": "1320FA8C-1450-416B-9701-8E15C3AA2205",
    "Language": "en"
  }
  */

  const para = JSON.stringify({
    "FileIds": [parseInt(req.params.id) || 0],
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Language": req.app.locals.env.lang || "en"
  });

  const url = `${req.app.locals.env.api.host}/api/delete-document`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') {
    //console.log(`Error deleting client: ${data} params: ${para}`);
    // throw new Error(`${data.Message}`);
    return { status: 0, message: data.Message, row: data.Data || {} };
  }
  return { status: 1, message: data.Message, row: data.Data || {} };

};

// Ký file
const signFiles = async ({ req }) => {
  /*
  {{baseURL}}/api/signDocument
{
    "LogIn": "lotusviet@lotusviet.vn",
    "fileIds": [
        2211
    ],
    "signNote": "I have read file and confirmed my signature",
    "SessionId": "4C8E1A01-C92F-45D8-AB3E-5650D7EA36B3"
}
  */

  const fileid = parseInt(req.body.fileid) || 0;
  const fileids = req.body.fileids || [];
  if (fileid === 0 && fileids.length === 0) {
    throw new Error('Invalid file ID for signing');
  }
  if (fileid !== 0 && fileids.length === 0) {
    fileids.push(fileid);
  }


  const signNote = req.body.signnote || '';


  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "fileIds": fileids,
    "signNote": signNote,
    "SessionId": req.session.sessionid
  });

  const url = `${req.app.locals.env.api.host}/api/signDocument`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== true) {
    //console.log(`Error deleting client: ${data} params: ${para}`);
    throw new Error(`${data.Message}`);
  }
  return { status: 1, message: data.Message, row: data.Data || {} };

};



//Hàm lấy danh sách work category 
const getFiles = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  https://consims.com/api/get-file-list?params={"SubmissionId":18717,"AssignmentId":0,"LogIn":"khanh911234@gmail.com","SourceType":"construction_work","DisplayMode":"by_submissions","SessionId":"4C8E1A01-C92F-45D8-AB3E-5650D7EA36B3"}
  */

  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "SourceType": req.query.sourcetype || "construction_work",
    "DisplayMode": req.query.displaymode || "by_submissions",
    "SubmissionId": parseInt(req.query.submissionid) || 0,
    "PaymentId": parseInt(req.query.paymentid) || 0,
    "AssignmentId": parseInt(req.query.assignmentid) || 0
  });
  const url = `${req.app.locals.env.api.host}/api/get-file-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  const total = 0;// data.TotalRows || (data.Data ? data.Data.length : 0);
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}

//Hàm lấy danh sách người ký certificate
const getCertificate = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
{{baseURL}}/api/certificate-info?params={"FileId": 2208,"LogIn": "lotusviet@lotusviet.vn", "SessionId": "4C8E1A01-C92F-45D8-AB3E-5650D7EA36B3"}    
  */

  const para = JSON.stringify({
    "FileId": parseInt(req.query.fileid) || 0,
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid
  });
  const url = `${req.app.locals.env.api.host}/api/certificate-info?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }

  //map id tự tăng
  if (data.Data && Array.isArray(data.Data)) {
    data.Data.forEach((item, index) => {
      item.Id = index + 1;
    });
  }

  const total = data.TotalRows || (data.Data ? data.Data.length : 0);
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}

//Hàm lấy danh sách hợp đồng
const contract = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
{{baseURL}}/api/get-contract-list?params={"LogIn":"lotusviet@lotusviet.vn","SessionId":"2CF0406C-C588-40F2-BEB7-B1279BC6BB87","Keyword": "", "ContractType":"All","DisplayMode":"brief_contracts_by_user","PageNum":1,"PageSize":5}
  */

  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Keyword": keyword,
    "ContractType": req.query.contracttype || "All",
    "DisplayMode": req.query.displaymode || "brief_contracts_by_user",
    "PageNum": page,
    "PageSize": pagesize
  });
  const url = `${req.app.locals.env.api.host}/api/get-contract-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }

  //map id tự tăng
  if (data.Data && Array.isArray(data.Data)) {
    data.Data.forEach((item, index) => {
      item.Id = index + 1;
    });
  }

  const total = data.TotalRows || (data.Data ? data.Data.length : 0);
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}


//Hàm lấy logo
const getLogo = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
https://consims.com/api/get-logo?login=khanhvhd@centralcons.vn&language=vi
  */
  const url = `${req.app.locals.env.api.host}/api/get-logo?clientid=${req.app.locals.env.api.ClientId}&login=${encodeURIComponent(req.session.user.username)}&language=${encodeURIComponent(req.app.locals.env.lang || "en")}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') {
    // throw new Error(`${data.Message}`); 
    return { datas: [], page, pagesize, total: 0, totalpages: 0 };
  }

  //map id tự tăng
  if (data.Data && Array.isArray(data.Data)) {
    data.Data.forEach((item, index) => {
      item.Id = index + 1;
    });
  }

  const FilePath = `${req.app.locals.env.api.host}${data.Data.FilePath}`;
  data.Data.FilePath = FilePath;

  const total = data.TotalRows || (data.Data ? data.Data.length : 0);
  // Trả về dữ liệu phân trang
  return { datas: [data.Data] || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };
}

//lấy đơn vị tính
const getUnit = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
  let keyword = '';
  //nếu filterConditions không là đối tượng rỗng thì thêm vào điều kiện lọc
  if (Object.keys(filterConditions).length > 0) {
    //nếu filterConditions.Conditions là mảng thì thêm vào điều kiện lọc
    if (Array.isArray(filterConditions.conditions)) {
      //tìm điều kiện trường searchTerm có thì gán nếu không thì cho =''
      const keywordCondition = filterConditions.conditions.find(cond => cond.field === 'Unit');
      //nếu keywordCondition có thì gán giá trị cho keyword
      if (keywordCondition) { keyword = keywordCondition.value; }
    }
  }

  /*
  {{baseURL}}/api/get-typical-unit?params={"LogIn":"lotusviet@lotusviet.vn","Language":"en","Type":"payment_adjustment","SessionId":"9188F2BE-3F79-445C-93BD-683799C5513C"}
  {{baseURL}}/api/get-typical-unit?params={"LogIn":"khanhvhd@centralcons.vn","Language":"en","Type":"payment_adjustment","SessionId":"54045833-09EF-4C5F-85E7-A993459356D5","Keyword":"m"}
  */

  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "Language": req.app.locals.env.lang || "en",
    "Type": req.query.type || "payment_adjustment",
    "SessionId": req.session.sessionid,
    "Keyword": keyword
  });
  const url = `${req.app.locals.env.api.host}/api/get-typical-unit?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  // const total = data.TotalRows || 0;
  //map id tự tăng
  if (data.Data && Array.isArray(data.Data)) {
    data.Data.forEach((item, index) => {
      item.Id = index + 1;
    });
  }
  const total = data.TotalRows || (data.Data ? data.Data.length : 0);
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };

}


//Tra cứu nguồn lực nguyên vật liệu
const getMaterialType = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
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
  {{baseURL}}/api/get-material-type?params={"LogIn":"lotusviet@lotusviet.vn",
"SessionId":"59CF665F-7A20-456C-AFB4-81506BEDF7E6","Keyword":"","PageNum":1,"PageSize":10}
  */

  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Keyword": keyword,
    "PageNum": page,
    "PageSize": pagesize
  });
  const url = `${req.app.locals.env.api.host}/api/get-material-type?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  // const total = data.TotalRows || 0;
  //map id tự tăng
  if (data.Data && Array.isArray(data.Data)) {
    data.Data.forEach((item, index) => {
      item.Id = index + 1;
    });
  }
  const total = data.TotalRows || (data.Data ? data.Data.length : 0);
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize) };

}

// Xuất các hàm và lớp để sử dụng ở nơi khác
module.exports = {
  getLookup,
  uploadFiles,
  signFiles,
  removeFiles,
  getFiles,
  getCertificate,
  getLogo,
  metafile

};
