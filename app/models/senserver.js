// senserver.js
//tiện ích data trên server

//#region Utils Extensions

// Hàm chuyển đổi req.body sang SenObject
const convertReqBodyToObject = function (reqBody, meta) {
  const obj = {};
  //nếu reqBody undefine hoặc null thì trả về {}
  if (!reqBody || Object.keys(reqBody).length === 0) return obj;
  meta.forEach(({ field, type }) => {
    // Nếu trường không có trong reqBody thì bỏ qua
    if (!(field in reqBody)) return;
    obj[field] = parseValue(reqBody[field], type);
  });
  return obj;
}

//kiểm tra tính hợp lệ của model dựa trên meta
const validmodel = function ({ model, meta }) {
  const errors = {};
  for (const field of meta) {
    //trường hợp kiểu dữ liệu là boolean thì phải chấp nhận giá trị false chỉ không chấp nhận ngoài true và false
    if (field.type === 'boolean') {
      if (model[field.field] !== true && model[field.field] !== false) {
        errors[field.field] = `${field.description} must be true or false`;
      }
    }
    //trường hợp kiểu dữ liệu là number thì phải chấp nhận giá trị 0 chỉ không chấp nhận ngoài số
    else if (field.isnullable === false && (field.type === 'bigint' || field.type === 'number' || field.type === 'numeric' || field.type === 'int')) {
      if (model[field.field] === null || model[field.field] === undefined || isNaN(model[field.field]) || model[field.field] === '') {
        errors[field.field] = `${field.description} cannot be empty`;
      }
    }
    else if (field.isnullable === false && !model[field.field]) {
      errors[field.field] = `${field.description} cannot be empty`;
    }
  }
  return errors;
};

//kiểm tra xem request có phải ajax request không
const isajax = function ({ req }) {
  return (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest');
};

//chuyển đổi text theo ngôn ngữ
const text = {};
text.localeString = [
  { code: 'vi', name: 'Please fill all fields.', text: 'Vui lòng điền đầy đủ tất cả các trường.' },
  { code: 'vi', name: 'Home page', text: 'Trang chủ' },
  { code: 'vi', name: 'Upload', text: 'Tải lên' },
  { code: 'vi', name: 'Register', text: 'Đăng ký' },
]
text.t = function ({ req, text }) {
  //tạm khóa dịch thuật
  return text;
  //nếu text là rỗng thì trả về rỗng
  if (!text || text === '') return text;
  //lấy ngôn ngữ hiện tại từ localStorage
  const lang = req.app.locals.env.lang || 'en';
  //tìm trong localeString nếu có thì trả về chuỗi tương ứng
  const locale = this.localeString.find(item => item.code === lang && item.name === text);
  //nếu không tìm thấy thì có thể tìm thêm api trên server(sau này bổ sung)
  return locale ? locale.text : text;
}

//#endregion Utils Extensions

//#region Data Utilities
// Hàm parse giá trị theo type trong meta
const parseValue = function (value, type) {
  if (value === null || value === undefined || (value === '' && type !== 'string')) return undefined;
  switch (type) {
    case 'int':
    case 'bigint':
      return Number(value); // hoặc BigInt(value) nếu muốn dùng BigInt thực sự
    case 'number':
    case 'numeric':
      return Number(value);
    case 'boolean':
      return value === true || value === 'true' || value === 1 || value === '1'|| value === 'on'|| value === 'checked'|| value === 'yes';
    case 'datetime':
    case 'date':
      return new Date(value);
    case 'string':
    case 'text':
    default:
      return value;
  }
}

// ===== filterBuilder: gom builder điều kiện vào object =====
const filterBuilder = {
  // Điều kiện cơ bản
  eq: (key, value) => ({ [key]: value }),
  op: (key, operator, value) => ({ [key]: { op: operator, value } }),

  // Các toán tử thường dùng
  gt: (key, value) => filterBuilder.op(key, '>', value),
  lt: (key, value) => filterBuilder.op(key, '<', value),
  gte: (key, value) => filterBuilder.op(key, '>=', value),
  lte: (key, value) => filterBuilder.op(key, '<=', value),
  neq: (key, value) => filterBuilder.op(key, '!=', value),

  ilike: (key, value) => filterBuilder.op(key, 'ilike', value),
  includes: (key, value) => filterBuilder.op(key, 'includes', value),
  between: (key, min, max) => filterBuilder.op(key, 'between', [min, max]),
  isin: (key, values) => filterBuilder.op(key, 'in', values),

  // before: (key, date) => filterBuilder.op(key, 'before', date),
  // after: (key, date) => filterBuilder.op(key, 'after', date),

  dateEquals: (key, date) => filterBuilder.op(key, 'dateEquals', date),
  dateGreaterThanOrEquals: (key, date) => filterBuilder.op(key, 'dateGreaterThanOrEquals', date),
  dateLessThanOrEquals: (key, date) => filterBuilder.op(key, 'dateLessThanOrEquals', date),
  dateTimeEquals: (key, dateTime) => filterBuilder.op(key, 'dateTimeEquals', dateTime),
  dateTimeGreaterThanOrEquals: (key, dateTime) => filterBuilder.op(key, 'dateTimeGreaterThanOrEquals', dateTime),
  dateTimeLessThanOrEquals: (key, dateTime) => filterBuilder.op(key, 'dateTimeLessThanOrEquals', dateTime),

  // Logic tổ hợp
  and: (...conds) => ({ and: conds }),
  or: (...conds) => ({ or: conds }),
  not: (cond) => ({ not: cond }),
};

// ===== Hàm lọc nâng cao =====
const evaluateCondition = function (obj, condition) {
  const [key, rule] = Object.entries(condition)[0];
  const val = obj[key];
  if (typeof rule === 'function') return rule(val);
  if (typeof rule === 'object' && rule !== null && 'op' in rule) {
    const { op, value } = rule;
    switch (op) {
      case '>': return val > value;
      case '<': return val < value;
      case '>=': return val >= value;
      case '<=': return val <= value;
      case '==': return val == value;
      case '===': return val === value;
      case '!=': return val != value;
      case 'includes': return typeof val === 'string' && val.includes(value);
      case 'ilike': return typeof val === 'string' && val.toLowerCase().includes(String(value).toLowerCase());
      case 'in': return Array.isArray(value) && value.includes(val);
      case 'between': return Array.isArray(value) && value.length === 2 && val >= value[0] && val <= value[1];
      // case 'before': return new Date(val) < new Date(value);
      // case 'after': return new Date(val) > new Date(value);
      //so sánh bằng kiểu ngày 
      case 'dateEquals':
        if (val instanceof Date && value instanceof Date) {
          return val.getFullYear() === value.getFullYear() &&
            val.getMonth() === value.getMonth() &&
            val.getDate() === value.getDate();
        }
      //so sánh lớn hơn hoặc bằng kiểu ngày
      case 'dateGreaterThanOrEquals':
        if (val instanceof Date && value instanceof Date) {
          return val >= value;
        }
      //so sánh nhỏ hơn hoặc bằng kiểu ngày
      case 'dateLessThanOrEquals':
        if (val instanceof Date && value instanceof Date) {
          return val <= value;
        }
      //so sánh bằng kiểu ngày giờ
      case 'dateTimeEquals':
        if (val instanceof Date && value instanceof Date) {
          return val.getTime() === value.getTime();
        }
      //so sánh lớn hơn hoặc bằng kiểu ngày giờ
      case 'dateTimeGreaterThanOrEquals':
        if (val instanceof Date && value instanceof Date) {
          return val.getTime() >= value.getTime();
        }
      //so sánh nhỏ hơn hoặc bằng kiểu ngày giờ
      case 'dateTimeLessThanOrEquals':
        if (val instanceof Date && value instanceof Date) {
          return val.getTime() <= value.getTime();
        }
      default: return false;
    }
  }

  return val === rule;
}

const evaluateLogic = function (obj, conditions) {
  if ('and' in conditions) return conditions.and.every(sub => evaluateLogic(obj, sub));
  if ('or' in conditions) return conditions.or.some(sub => evaluateLogic(obj, sub));
  if ('not' in conditions) return !evaluateLogic(obj, conditions.not);
  return evaluateCondition(obj, conditions);
}

const buildCondition = function (obj) {
  //nếu obj={} thì trả về {}
  if (Object.keys(obj).length === 0) return obj;
  // Nếu là nhóm (and/or) thì đệ quy gọi vào từng điều kiện con
  if (obj.logic && Array.isArray(obj.conditions)) {
    const conditions = obj.conditions.map(buildCondition); // đệ quy
    //nếu có not hoặc not là true thì phủ định tất cả các điều kiện 
    if (obj.not) {
      if (obj.not === true) {
        return filterBuilder.not(obj.logic === 'and' ? filterBuilder.and(...conditions) : filterBuilder.or(...conditions));
      }
    }
    // nếu không có not thì trả về điều kiện logic tương ứng
    return obj.logic === 'and' ? filterBuilder.and(...conditions) : filterBuilder.or(...conditions);
  }

  // Nếu là 1 điều kiện đơn
  const { field, op, value, not: isNot } = obj;

  let cond;
  switch (op) {
    case '==': cond = filterBuilder.eq(field, value); break;
    case '!=': cond = filterBuilder.neq(field, value); break;
    case '>': cond = filterBuilder.gt(field, value); break;
    case '>=': cond = filterBuilder.gte(field, value); break;
    case '<': cond = filterBuilder.lt(field, value); break;
    case '<=': cond = filterBuilder.lte(field, value); break;
    case 'includes': cond = filterBuilder.includes(field, value); break;
    case 'ilike': cond = filterBuilder.ilike(field, value); break;
    case 'in': cond = filterBuilder.isin(field, value); break;
    case 'between':
      if (Array.isArray(value) && value.length === 2) {
        cond = filterBuilder.between(field, value[0], value[1]);
      } else {
        throw new Error('Invalid value for between operator');
      }
      break;
    case 'dateEquals':
      // Kiểm tra nếu value là chuỗi thì chuyển sang kiểu ngày
      if (typeof value === 'string') {
        cond = filterBuilder.dateEquals(field, new Date(value));
      }
      else {
        cond = filterBuilder.dateEquals(field, value);
      }
      break;

    case 'dateGreaterThanOrEquals':
      //chuyển value sang kiểu ngày nếu là chuỗi
      if (typeof value === 'string') {
        //value = new Date(value);
        cond = filterBuilder.dateGreaterThanOrEquals(field, new Date(value));
      }
      else {
        cond = filterBuilder.dateGreaterThanOrEquals(field, value);
      }

      break;
    case 'dateLessThanOrEquals':
      //chuyển value sang kiểu ngày nếu là chuỗi
      if (typeof value === 'string') {
        cond = filterBuilder.dateLessThanOrEquals(field, new Date(value));
      }
      else {
        cond = filterBuilder.dateLessThanOrEquals(field, value);
      }
      break;
    case 'dateTimeEquals':
      // Kiểm tra nếu value là chuỗi thì chuyển sang kiểu ngày
      if (typeof value === 'string') {
        cond = filterBuilder.dateTimeEquals(field, new Date(value));
      }
      else {
        cond = filterBuilder.dateTimeEquals(field, value);
      }
      break;
    case 'dateTimeGreaterThanOrEquals':
      // Kiểm tra nếu value là chuỗi thì chuyển sang kiểu ngày
      if (typeof value === 'string') {
        cond = filterBuilder.dateTimeGreaterThanOrEquals(field, new Date(value));
      }
      else {
        cond = filterBuilder.dateTimeGreaterThanOrEquals(field, value);
      }
      break;
    case 'dateTimeLessThanOrEquals':
      // Kiểm tra nếu value là chuỗi thì chuyển sang kiểu ngày
      if (typeof value === 'string') {
        cond = filterBuilder.dateTimeLessThanOrEquals(field, new Date(value));
      }
      else {
        cond = filterBuilder.dateTimeLessThanOrEquals(field, value);
      }
      break;
    default:
      throw new Error('Unsupported operator: ' + op);
  }

  return isNot ? filterBuilder.not(cond) : cond;
}

const filterAdvanced = function (list, conditions) {
  //nếu điều kiện là rỗng hoặc null thì trả về danh sách gốc
  if (!conditions || Object.keys(conditions).length === 0) return list;
  return list.filter(obj => evaluateLogic(obj, conditions));
};

const sortList = function ({ list, sortFields = '', sortTypes = '', meta = [] }) {

  //nếu sortFields và sortTypes không có giá trị thì mặc định là lấy trường key trong meta và sortTypes là 'asc'
  if (!sortFields) {
    const keyField = meta.find(field => field.key);
    //nếu không có trường key thì lấy trường đầu tiên trong meta  
    sortFields = keyField ? keyField.field : meta[0].field;
    sortTypes = 'asc';
  }
  // Chia nhỏ danh sách các trường và thứ tự sắp xếp
  const sortFieldArray = sortFields.split(',');
  const sortTypeArray = sortTypes.split(',');
  // Sắp xếp các senobject theo nhiều trường và thứ tự đã cho
  const sorteddatas = [...list].sort((a, b) => {
    for (let i = 0; i < sortFieldArray.length; i++) {
      const field = sortFieldArray[i].trim();
      const order = sortTypeArray[i].trim();

      const aValue = a[field];
      const bValue = b[field];

      if (order === 'asc') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
      }
    }
    return 0;
  });
  return sorteddatas;
};

//#endregion Data Utilities

//#region Form Utility
const buildMultipartBody = (fields, files) => {
  const boundary = '----NodeBoundary' + Math.random().toString(16).slice(2);
  const chunks = [];

  const push = v => chunks.push(Buffer.isBuffer(v) ? v : Buffer.from(v));

  // text fields
  for (const [key, value] of Object.entries(fields)) {
    push(`--${boundary}\r\n`);
    push(`Content-Disposition: form-data; name="${key}"\r\n\r\n`);
    push(`${value}\r\n`);
  }

  // files
  for (const file of files) {
    const utf8Name = file.originalname;
    const encoded = encodeURIComponent(utf8Name);

    push(`--${boundary}\r\n`);
    push(
      `Content-Disposition: form-data; name="files"; ` +
      `filename="${utf8Name}"; ` +
      `filename*=UTF-8''${encoded}\r\n`
    );
    push(`Content-Type: ${file.mimetype}\r\n\r\n`);
    push(file.buffer);
    push('\r\n');
  }

  push(`--${boundary}--\r\n`);

  return {
    body: Buffer.concat(chunks),
    boundary
  };
}
//#endregion Form Utility


module.exports = {
  utils: { convertReqBodyToObject, validmodel, isajax, text, buildMultipartBody },
  data: {
    parseValue,
    filterBuilder,
    evaluateLogic,
    buildCondition,
    filterAdvanced,
    sortList
  }
};


