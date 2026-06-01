const senserver = require("../models/senserver.js");
// senobject.js

//#region declare object
//khai báo meta cho đối tượng này
const meta = [
  { field: 'ParentId', type: 'bigint', description: 'Parent Id', key: false, isnullable: true, show: true, visible: true, readonly: true },
  { field: 'GId', type: 'string', description: 'Guid Id', key: false, isnullable: true, show: false, visible: true },
  { field: 'Id', type: 'bigint', description: 'Id', key: true, isnullable: true, show: false, visible: true },
  {
    field: 'Lookup', type: 'string', description: 'Lookup', isnullable: true, show: true, visible: true, lookup: {
      url: '/senobject/lookup',
      fields: { id: '`${item.Id}`', value: '`${item.String}`', label: '`${item.Id}-${item.String}`' },
      filter: { logic: "and", conditions: [{ field: "String", op: "includes", value: '' }] }
    }
  },
  {
    field: 'LookupMulti', type: 'string', description: 'LookupMulti', isnullable: true, show: true, visible: true, lookup: {
      url: '/senobject/lookup',
      fields: { id: '`${item.Id}`', value: '`${item.String}`', label: '`${item.Id}-${item.String}`' },
      filter: { logic: "and", conditions: [{ field: "String", op: "includes", value: '' }] },
      multiple: true,
    }
  },
  { field: 'Bigint', type: 'bigint', description: 'Bigint', isnullable: true, show: false, visible: true },
  { field: 'Numeric', type: 'numeric', dec: 3, description: 'Numeric', isnullable: false, show: true, visible: true },
  { field: 'String', type: 'string', description: 'String', isnullable: true, show: false, visible: true },
  { field: 'Options', type: 'string', description: 'Options', isnullable: true, show: true, visible: true, data: [{ id: '', value: '', label: '' }, { id: '1', value: '1', label: 'Option 1' }, { id: '2', value: '2', label: 'Option 2' }, { id: '3', value: '3', label: 'Option 3' }] },

  { field: 'DateTime', type: 'datetime', description: 'DateTime', isnullable: true, show: false, visible: true },
  { field: 'Boolean', type: 'boolean', description: 'Boolean', isnullable: true, show: true, visible: true, inputtype: 'checkbox' },
  { field: 'Date', type: 'date', description: 'Date', isnullable: true, show: false, visible: true },
  { field: 'Text', type: 'text', description: 'Text', isnullable: true, show: false, visible: true },
]
//nếu meta không có trường key=true thì gán trường đầu tiên trong meta
if (!meta.some(field => field.key)) { meta[0].key = true; }
const keyField = meta.find(field => field.key);
class Model {
  constructor({ ParentId, GId, Id, Bigint, Numeric, String, Options, Lookup, LookupMulti, DateTime, Boolean, Date: DateValue, Text } = {}) {
    this.ParentId = ParentId ?? 0;
    this.GId = GId ?? '';
    this.Id = Id ?? 0;
    this.Bigint = Bigint ?? 0;
    this.Numeric = Numeric ?? 0;
    this.String = String ?? '';
    this.Options = Options ?? '';
    this.Lookup = Lookup ?? '';
    this.LookupMulti = LookupMulti ?? '';
    this.DateTime = DateTime ?? new Date();
    this.Boolean = Boolean ?? false;
    this.Date = DateValue ?? new Date(); // dùng biến đổi tên (nếu dùng Date trùng keyword hệ thống báo lỗi)
    this.Text = Text ?? '';
  }
}
// Lưu trữ các data trong bộ nhớ
const datas = [];
//#endregion
//#region controller functions
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
  //nếu req có tham số mode==validate thì chỉ kiểm tra hợp lệ
  if (req.query.mode && req.query.mode === 'validate') { return resdata; }

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
  const data = senserver.utils.convertReqBodyToObject(req.body, meta);
  const index = datas.findIndex(obj => obj[keyField.field] === data[keyField.field]);
  if (index === -1) {
    //không tồn tại dữ liệu cần cập nhật
    resdata.status = 0;
    resdata.message = 'object not found';
    return resdata;
  }
  //trộn dữ liệu cũ với dữ liệu mới
  const updatedata = { ...datas[index], ...data };
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: updatedata, meta: meta });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }

  //nếu req có tham số mode==validate thì chỉ kiểm tra hợp lệ
  if (req.query.mode && req.query.mode === 'validate') { return resdata; }

  resdata.data = await updateData({ req, data: updatedata });
  if (!resdata.data) {
    return { status: 0, message: "Object not found", errors: "Object not found" };
  }
  return resdata;
}

const postDelete = async ({ req }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const id = parseInt(req.params.id);
  //nếu req có tham số mode==validate thì chỉ kiểm tra hợp lệ
  if (req.query.mode && req.query.mode === 'validate') { return resdata; }

  const result = await deleteData({ req, id });
  if (!result) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
  return { status: 1, message: "Object deleted successfully", data: result };
}

const getList = async ({ req }) => {
  const page = parseInt(req.query.page) || 1;
  const pagesize = req.query.pagesize == null || req.query.pagesize === '' ? 10 : parseInt(req.query.pagesize);
  const sortFields = req.query.sortfield;
  const sortTypes = req.query.sorttype;
  let filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  if (filterConditions && filterConditions.conditions && Array.isArray(filterConditions.conditions)) {
    //nếu req có tham số ParentId thì thêm điều kiện lọc ParentId
    if (req.query.ParentId) filterConditions.conditions.push({ "field": "ParentId", "op": "==", "value": parseInt(req.query.ParentId) });
  } else {
    if (req.query.ParentId) {
      filterConditions = { logic: "and", conditions: [{ "field": "ParentId", "op": "==", "value": parseInt(req.query.ParentId) }] };
    }
  }
  return await getDatas({ req, page, pagesize, sortFields, sortTypes, filterConditions });
}

const getLookup = async ({ req }) => {
  return await getList({ req });
}
//#endregion
//#region CRUD functions
// Hàm để thêm data mới
const addData = async ({ req, data }) => {
  const newdata = new Model(data);
  //gán keyvalue
  if (!newdata[keyField.field] || parseInt(newdata[keyField.field]) <= 0) {
    //gán giá trị keyfield lớn nhất từ datas
    const maxKeyField = Math.max(...datas.map(item => item[keyField.field]));
    newdata[keyField.field] = ((isNaN(maxKeyField) || maxKeyField === Infinity || maxKeyField === -Infinity || maxKeyField === null) ? 0 : parseInt(maxKeyField)) + 1;
  }
  datas.push(newdata);
  return newdata;
}
// Hàm để cập nhật data
const updateData = async ({ req, data }) => {
  const index = datas.findIndex(obj => obj[keyField.field] === data[keyField.field]);
  if (index !== -1) {
    const updatedata = { ...datas[index], ...data };
    datas[index] = updatedata;
    return updatedata;
  }
  return null;
}
// Hàm để xóa data
const deleteData = async ({ req, id }) => {
  const index = await findIndexByKey({ req, value: id });
  if (index !== -1) {
    datas.splice(index, 1);
    return true;
  }
  return false;
}
// Hàm để tìm theo trường tùy chỉnh
const findByField = async ({ field, value }) => {
  return datas.find(data => data[field] === value);
};
// Hàm tìm theo khóa
const findByKey = async ({ req, value }) => {
  return await findByField({ field: keyField.field, value: parseInt(value) });
}
// Hàm để tìm theo trường tùy chỉnh
const findIndexByField = async ({ field, value }) => {
  return datas.findIndex(data => data[field] === value);
};
// Hàm tìm theo khóa
const findIndexByKey = async ({ req, value }) => {
  return await findIndexByField({ field: keyField.field, value: parseInt(value) });
}
// Hàm để lấy tất cả data
const getAllDatas = async () => {
  return datas;
}
//Hàm lấy danh sách data với phân trang và sắp xếp
const getDatas = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
  //ngầm định sortFields là 'ParentId,Id' và sortTypes là 'asc,asc'
  if (!sortFields) sortFields = 'ParentId,Id';
  if (!sortTypes) sortTypes = 'asc,asc';

  const start = (page - 1) * pagesize;
  const end = start + pagesize;
  // Lọc các senobject theo điều kiện đã cho
  const condition = senserver.data.buildCondition(filterConditions);
  const filtereddatas = senserver.data.filterAdvanced(datas, condition);
  const sorteddatas = senserver.data.sortList({ list: filtereddatas, sortFields, sortTypes, meta });
  //nếu pagesize là 0 thì trả về tất cả các kết quả đã sắp xếp
  if (pagesize === 0) return { datas: sorteddatas, total: sorteddatas.length, page, pagesize, totalpages: 1 };
  return { datas: sorteddatas.slice(start, end), total: sorteddatas.length, page, pagesize, totalpages: Math.ceil(sorteddatas.length / pagesize) };
}
//#endregion
//#region data sample
// Tạo dữ liệu mẫu
const sampleData = [
  { ParentId: 1, GId: '1', Id: 1, Bigint: 100, Numeric: 200, String: 'Sample 1', Options: '1', Lookup: 'Vietname', LookupMulti: 'Vietnam,Thailand', DateTime: new Date('2024-01-01T08:00:00'), Boolean: true, Date: new Date('2024-01-01'), Text: 'This is a sample text.' },
  { ParentId: 1, GId: '2', Id: 2, Bigint: 300, Numeric: 200, String: 'Sample 2', Options: '2', Lookup: 'Lao', LookupMulti: 'Vietnam,Lao', DateTime: new Date('2024-01-02T09:15:00'), Boolean: false, Date: new Date('2024-01-02'), Text: 'Another sample text.' },

  { ParentId: 2, GId: '3', Id: 3, Bigint: 500, Numeric: 600, String: 'Sample 3', Options: '3', Lookup: 'Thailand', LookupMulti: 'Vietnam,Thailand', DateTime: new Date('2024-01-03T10:30:00'), Boolean: true, Date: new Date('2024-01-03'), Text: 'Sample text 3.' },
  { ParentId: 2, GId: '4', Id: 4, Bigint: 700, Numeric: 200, String: 'Sample 4', Options: '1', Lookup: 'Vietnam', LookupMulti: 'Vietnam,Thailand', DateTime: new Date('2024-01-04T11:45:00'), Boolean: false, Date: new Date('2024-01-04'), Text: 'Sample text 4.' },

  { ParentId: 3, GId: '5', Id: 5, Bigint: 900, Numeric: 1000, String: 'Sample 5', Options: '2', Lookup: 'Vietnam', LookupMulti: 'Vietnam,Thailand', DateTime: new Date('2024-01-05T13:00:00'), Boolean: true, Date: new Date('2024-01-05'), Text: 'Sample text 5.' },
  { ParentId: 3, GId: '6', Id: 6, Bigint: 1100, Numeric: 1200, String: 'Sample 6', Options: '3', Lookup: 'Vietnam', LookupMulti: 'Vietnam,Thailand', DateTime: new Date('2024-01-06T14:15:00'), Boolean: false, Date: new Date('2024-01-06'), Text: 'Sample text 6.' },

  { ParentId: 4, GId: '7', Id: 7, Bigint: 1300, Numeric: 1400, String: 'Sample 7', Options: '1', Lookup: 'Vietnam', LookupMulti: 'Vietnam,Thailand', DateTime: new Date('2024-01-07T15:30:00'), Boolean: true, Date: new Date('2024-01-07'), Text: 'Sample text 7.' },
  { ParentId: 4, GId: '8', Id: 8, Bigint: 1500, Numeric: 1600, String: 'Sample 8', Options: '2', Lookup: 'Vietnam', LookupMulti: 'Vietnam,Thailand', DateTime: new Date('2024-01-08T16:45:00'), Boolean: false, Date: new Date('2024-01-08'), Text: 'Sample text 8.' },

  { ParentId: 5, GId: '9', Id: 9, Bigint: 1700, Numeric: 1800, String: 'Sample 9', Options: '3', Lookup: 'Lao', LookupMulti: 'Vietnam,Lao', DateTime: new Date('2024-01-09T18:00:00'), Boolean: true, Date: new Date('2024-01-09'), Text: 'Sample text 9.' },
  { ParentId: 5, GId: '10', Id: 10, Bigint: 1900, Numeric: 2000, String: 'Sample 10', Options: '1', Lookup: 'Lao', LookupMulti: 'Vietnam,Lao', DateTime: new Date('2024-01-10T19:15:00'), Boolean: false, Date: new Date('2024-01-10'), Text: 'Sample text 10.' },
  { ParentId: 5, GId: '11', Id: 11, Bigint: 2100, Numeric: 2200, String: 'Sample 11', Options: '2', Lookup: 'Lao', LookupMulti: 'Vietnam,Lao', DateTime: new Date('2024-01-11T20:30:00'), Boolean: true, Date: new Date('2024-01-11'), Text: 'Sample text 11.' },
  { ParentId: 5, GId: '12', Id: 12, Bigint: 2300, Numeric: 2400, String: 'Sample 12', Options: '3', Lookup: 'Lao', LookupMulti: 'Vietnam,Lao', DateTime: new Date('2024-01-12T21:45:00'), Boolean: false, Date: new Date('2024-01-12'), Text: 'Sample text 12.' },
  { ParentId: 5, GId: '23', Id: 23, Bigint: 4500, Numeric: 4600, String: 'Sample 23', Lookup: 'Cambodia', LookupMulti: 'Vietnam,Cambodia', DateTime: new Date('2024-02-08T08:00:00'), Boolean: true, Date: new Date('2024-02-08'), Text: 'Sample text 23.' },
  { ParentId: 5, GId: '24', Id: 24, Bigint: 4700, Numeric: 4800, String: 'Sample 24', Lookup: 'Thailand', LookupMulti: 'Vietnam,Thailand', DateTime: new Date('2024-02-09T09:30:00'), Boolean: false, Date: new Date('2024-02-09'), Text: 'Sample text 24.' },
  { ParentId: 5, GId: '25', Id: 25, Bigint: 4900, Numeric: 5000, String: 'Sample 25', Lookup: 'Vietnam', LookupMulti: 'Vietnam,Lao', DateTime: new Date('2024-02-10T10:45:00'), Boolean: true, Date: new Date('2024-02-10'), Text: 'Sample text 25.' },
  { ParentId: 5, GId: '26', Id: 26, Bigint: 5100, Numeric: 5200, String: 'Sample 26', Lookup: 'Lao', LookupMulti: 'Vietnam,Lao', DateTime: new Date('2024-02-11T12:00:00'), Boolean: false, Date: new Date('2024-02-11'), Text: 'Sample text 26.' },
  { ParentId: 5, GId: '27', Id: 27, Bigint: 5300, Numeric: 5400, String: 'Sample 27', Lookup: 'Cambodia', LookupMulti: 'Vietnam,Cambodia', DateTime: new Date('2024-02-12T13:15:00'), Boolean: true, Date: new Date('2024-02-12'), Text: 'Sample text 27.' },
  { ParentId: 5, GId: '28', Id: 28, Bigint: 5500, Numeric: 5600, String: 'Sample 28', Lookup: 'Vietnam', LookupMulti: 'Vietnam,Thailand', DateTime: new Date('2024-02-13T14:30:00'), Boolean: false, Date: new Date('2024-02-13'), Text: 'Sample text 28.' },
  { ParentId: 5, GId: '29', Id: 29, Bigint: 5700, Numeric: 5800, String: 'Sample 29', Lookup: 'Thailand', LookupMulti: 'Vietnam,Thailand', DateTime: new Date('2024-02-14T15:45:00'), Boolean: true, Date: new Date('2024-02-14'), Text: 'Sample text 29.' },
  { ParentId: 5, GId: '30', Id: 30, Bigint: 5900, Numeric: 6000, String: 'Sample 30', Lookup: 'Lao', LookupMulti: 'Vietnam,Lao', DateTime: new Date('2024-02-15T17:00:00'), Boolean: false, Date: new Date('2024-02-15'), Text: 'Sample text 30.' }


];
// Thêm dữ liệu mẫu vào bộ nhớ khi khởi tạo
sampleData.forEach(data => addData({ data: data }));
//#endregion
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
