//#region thư viện tham chiếu
/*
Các thư viện tham chiếu
- jQuery
- Moment.js
- ECharts
*/
//#endregion thư viện tham chiếu

senapp.common = {};
senapp.utils = {};
senapp.window = {};
senapp.data = {};
senapp.ext = {};//thừa kế thư viện khác

//#region extensions
//#region tiện ích dành cho momentjs
senapp.ext.moment = moment; // Thêm Moment.js vào senapp.ext
senapp.ext.moment.locale(senapp.session.env.culture || 'en-US');//cài đặt ngôn ngữ cho momentjs
//#endregion tiện ích dành cho momentjs

//#region tiện ích dành cho echarts
senapp.ext.echarts = {};
//map sự kiện người dùng click thay đổi legend biểu đồ
//senapp.ext.echarts.mapeventlegend = function (chartcontainer,chartname)
//{
//    if (chartname==null) {chartname="myChart";}
//    //var chart = chartcontainer;  //.myChart,$.pms.atansummary1chart.option.legend.selected
//    chartcontainer[chartname].on('legendselectchanged', function (params) {
//        // Print name in console
//        //console.log(params);
//        chartcontainer.option.legend.selected = params.selected;
//    });
//    chartcontainer[chartname].on('legendselected', function (params) {
//        // Print name in console
//        //console.log(params);
//        chartcontainer.option.legend.selected = params.selected;
//    });
//    chartcontainer[chartname].on('legendunselected', function (params) {
//        // Print name in console
//        //console.log(params);
//        chartcontainer.option.legend.selected = params.selected;
//    });
//    chartcontainer[chartname].on('legendselectall', function (params) {
//        // Print name in console
//        //console.log(params);
//        chartcontainer.option.legend.selected = params.selected;
//    });
//    chartcontainer[chartname].on('legendinverseselect', function (params) {
//        // Print name in console
//        //console.log(params);
//        chartcontainer.option.legend.selected = params.selected;
//    });
//}
senapp.ext.echarts.mapeventlegend = function (echart) {
  let option = echart.getOption();
  echart.on('legendselectchanged', function (params) {
    // Print name in console
    //console.log(params);
    option.legend.selected = params.selected;
  });
  echart.on('legendselected', function (params) {
    // Print name in console
    //console.log('legendselected',params);
    option.legend.selected = params.selected;
  });
  echart.on('legendunselected', function (params) {
    // Print name in console
    //console.log('legendunselected',params);
    option.legend.selected = params.selected;
  });
  echart.on('legendselectall', function (params) {
    // Print name in console
    //console.log(params);
    option.legend.selected = params.selected;
  });
  echart.on('legendinverseselect', function (params) {
    // Print name in console
    //console.log(params);
    option.legend.selected = params.selected;
  });
}
//hiển thị các legend đang chọn
senapp.ext.echarts.savedefault = function (option) {
  var arr = Object.getOwnPropertyNames(option.legend.selected);
  var arrselected = [];
  for (var i = 0; i < arr.length; i++) {
    if (option.legend.selected[arr[i]]) {
      arrselected.push(arr[i]);
    }
  }
  console.log(arrselected);
  /*
  console.log($.pms.atansummary1chart.option.legend.selected);
  console.log(arr);
  */
}
//bỏ chọn tất cả legend
senapp.ext.echarts.legendunselect = function (echart) {
  if (echart.chartlegendfilter) {
    senapp.ext.echarts.chartlegendfilterreset(echart.chartlegendfilter, echart.getOption().legend[0].selected, 'unselect');
  }
  else {
    echart.dispatchAction({ type: 'legendAllSelect' });
    echart.dispatchAction({ type: 'legendInverseSelect' });
  }
}
//hiển thị biểu đồ theo kiểu thông dụng
senapp.ext.echarts.show = function (el, option, filter) {
  let echart = echarts.init(el);
  let optiondefault = {
    title: {},
    //legend: {
    //    //type: 'scroll',
    //    //orient: 'vertical',
    //    //show:false,
    //    selected:selected
    //},
    grid: {
      //top: '25%',
      left: '5%',
      right: '5%'
      //left:'24',
      //right:'24'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    //dataset: {source: source},
    xAxis: { type: 'category' },
    yAxis: [
      {
        //show:false,
        splitLine: { show: false },
        axisLabel: {
          formatter: '{value}',
          // formatter: function (value, index) { return apputils.number.numberformat().format(value); },
          show: false
        }
      },
      {
        //show:false,
        //type:'value',
        position: 'right',
        axisLabel: {
          // formatter: function (value, index) { return apputils.number.numberformat().format(value); },
          formatter: '{value}',
          show: false
        }
      }
    ],
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: { show: true },
        restore: { show: true, title: 'Restore Default' },
        // restore: { show: true, title: 'Hiển thị ngầm định' },
        myclear: {
          show: true,
          // title: 'Xóa lựa chọn',
          title: 'Clear Selection',
          icon: 'path://M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z',
          onclick: function () { senapp.ext.echarts.legendunselect(echart); }
        },
        //dataView: { show: true, readOnly: false,title: 'Xem dữ liệu', lang : ['Dữ liệu', 'Đóng', 'Làm mới dữ liệu'] },
        //magicType: { show: true, type: ['line', 'bar', 'stack'] },
        // saveAsImage: { show: true, title: 'Lưu hình ảnh' },
        saveAsImage: { show: true, title: 'Save as Image' },
      }
    },
    dataZoom: [{ start: 0 }, { type: 'inside' }],
    //visualMap: [{
    //    show:false,
    //    top: 10,
    //    right: 10,
    //    seriesIndex:0,
    //    pieces: [{lte:0,color: '#d33724'},{gte:1,color: '#008548'}],
    //    outOfRange: {color: '#008548'}
    //}],
    //series: series
  }

  //map chỉnh sửa tùy chọn
  for (let key in option) { optiondefault[key] = option[key]; }

  echart.setOption(optiondefault);
  senapp.ext.echarts.mapeventlegend(echart);

  //nếu có đối tượng lọc
  echart.chartlegendfilter = filter;
  if (echart.chartlegendfilter) {
    echart.on('restore', function () { senapp.ext.echarts.chartlegendfilterreset(echart.chartlegendfilter, echart.getOption().legend[0].selected); });
    echart.on('legendselectchanged', function (params) {
      if (params.selected[params.name]) { $(echart.chartlegendfilter).selectize()[0].selectize.addItem(params.name); }
      else { $(echart.chartlegendfilter).selectize()[0].selectize.removeItem(params.name); }
    });

    senapp.ext.echarts.chartlegendfilterinit(echart.chartlegendfilter, echart.getOption().legend[0].selected);
    $(echart.chartlegendfilter).on('change', function () {
      const selected = $(this).val();
      if (selected) {
        echart.dispatchAction({ type: 'legendAllSelect' });
        echart.dispatchAction({ type: 'legendInverseSelect' });
        selected.forEach(item => { echart.dispatchAction({ type: 'legendSelect', name: item }); })
      }
      else {
        echart.dispatchAction({ type: 'legendAllSelect' });
        echart.dispatchAction({ type: 'legendInverseSelect' });
      }
    })
  }

  $(window).resize(function () { echart.resize(); });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Gọi resize hoặc các thao tác khác khi phần tử hiển thị lại
        echart.resize();
      }
    });
  });
  // Bắt đầu quan sát phần tử
  observer.observe(el);

  return echart;
}

//ẩn hiện lọc legend
senapp.ext.echarts.chartlegendfiltercollapseall = function (a) {
  const show = $(a).attr("data-show");
  $(a).closest('.card').find('.collapse').collapse('toggle');
  if (show == "1") {
    $(a).attr("data-show", "0");
    // $(a).find('span').html(senapp.utils.text.t('Hiển thị bộ lọc'));
    $(a).find('span').html(senapp.utils.text.t('Show Filters'));
  } else {
    $(a).attr("data-show", "1");
    $(a).find('span').html(senapp.utils.text.t('Hide Filters'));
  }
}
//khởi tạo legend cho filter
senapp.ext.echarts.chartlegendfilterinit = function (filter, selected) {
  //selected: hiển thị ngầm định đã chọn
  $(filter).selectize()[0].selectize.destroy();
  $(filter).empty().append('<option disabled selected> -- select an option -- </option>');
  Object.getOwnPropertyNames(selected).forEach(function (item, i) {
    if (i > 0) {
      let option = '<option value="' + item + '">' + item + '</option>';
      if (selected[item] == true) { option = '<option value="' + item + '" selected="selected">' + item + '</option>'; }
      $(filter).append(option);
    }
  });

  //Object.getOwnPropertyNames(selected).forEach(item => {
  //    if (item!=="Tháng-Năm") {
  //        let option ='<option value="'+item+'">'+item+'</option>';
  //        if (selected[item]==true) {option ='<option value="'+item+'" selected="selected">'+item+'</option>';}
  //        $(filter).append(option);
  //    }
  //});
  $(filter).selectize();
}

//reset lựa chọn legend
senapp.ext.echarts.chartlegendfilterreset = function (filter, selected, unselect) {
  //selected: hiển thị ngầm định đã chọn
  const selectize = $(filter).selectize()[0].selectize;
  selectize.clear();
  // if (unselect) { }
  // else { Object.getOwnPropertyNames(selected).forEach(item => { if (item !== "Tháng-Năm") { if (selected[item] == true) { selectize.addItem(item); } } }); }
  if (unselect) { }
  else { Object.getOwnPropertyNames(selected).forEach(item => { if (item !== "Month-Year") { if (selected[item] == true) { selectize.addItem(item); } } }); }
}

//#endregion tiện ích dành cho echarts


//#endregion extensions

//#region Data utilities
senapp.data.sessionAutoIdValue = 4;
senapp.data.sessionAutoId = function () {
  return senapp.data.sessionAutoIdValue++;
}
// Hàm parse giá trị theo type trong meta
senapp.data.parseValue = function (value, fieldmeta) {
  // if (value === null || value === undefined) return undefined;// || (value === '' && type !== 'string')) return undefined;
  if (value === null || value === undefined) return '';// || (value === '' && type !== 'string')) return undefined;
  if (value === '') return ''; // Trả về chuỗi rỗng nếu giá trị là chuỗi rỗng
  switch (fieldmeta.type) {
    case 'int':
    case 'bigint':
      //return Number(value); // hoặc BigInt(value) nếu muốn dùng BigInt thực sự
      return Math.trunc(parseFloat(value));//cắt bỏ số lẻ
    case 'number':
    case 'numeric':
      // Định dạng số với dấu phân cách phần nghìn và 2 chữ số thập phân
      const dec = fieldmeta.dec || 0;
      const factor = Math.pow(10, dec);
      const numbervalue = Math.floor(value * factor) / factor;
      return numbervalue
    // return Number(value);
    case 'bool':
    case 'boolean':
      return (value === true || value === 'true' || value === 'True' || value === 1 || value === '1') === true;
    case 'datetime':
    case 'date':
      return new Date(value);
    case 'string':
    case 'text':
    default:
      return value;
  }
}

// Hàm chuyển giá trị sang chuỗi để hiển thị
senapp.data.stringifyValue = function (value, fieldmeta) {
  if (value === null || value === undefined) return '';
  switch (fieldmeta.type) {
    case 'bigint':
    case 'int':
      // Bỏ qua phân cách phần nghìn, chỉ hiển thị số nguyên
      if (value === 0) return '0';
      return value ? value.toString() : '';
    case "number":
    case 'numeric':
      if (value === 0) return '0';
      // Định dạng số với dấu phân cách phần nghìn và 2 chữ số thập phân
      const dec = fieldmeta.dec || 0;
      const factor = Math.pow(10, dec);
      const numbervalue = Math.floor(value * factor) / factor;
      // console.log(value,numbervalue);
      return value ? parseFloat(numbervalue).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }) : '';
    // return value ? parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }) : '';
    case "bool":
      return value ? 'Yes' : 'No';
    case 'boolean':
      return value ? 'True' : 'False';
    case 'datetime':
      //return value instanceof Date ? value.toLocaleString() : String(value);
      return new Date(value) instanceof Date ? senapp.ext.moment(value).format('L HH:mm') : String(value);
    case 'date':
      if (value === '') return '';
      return new Date(value) instanceof Date ? senapp.ext.moment(value).format('L') : String(value);
    case 'text':
      return value.replace(/\r?\n|\r/g, "<br>"); // Chuyển đổi sang chuỗi và thay thế ký tự xuống dòng
    case 'string':
    default:
      return String(value)
  }

  //   if (metacolumn.type === 'bool') {
  //   td.textContent = data[metacolumn.field] ? 'Yes' : 'No';
  // } else if (metacolumn.type === 'boolean') {
  //   td.textContent = data[metacolumn.field] ? 'True' : 'False';
  // } else if (metacolumn.type === 'date') {
  //   td.textContent = new Date(data[metacolumn.field]).toLocaleDateString();
  // } else if (metacolumn.type === 'datetime') {
  //   td.textContent = new Date(data[metacolumn.field]).toLocaleString();
  // } else if (metacolumn.type === 'number' || metacolumn.type === 'numeric') {
  //   // Định dạng số với dấu phân cách phần nghìn và 2 chữ số thập phân
  //   td.textContent = data[metacolumn.field] ? parseFloat(data[metacolumn.field]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
  // } else if (metacolumn.type === 'bigint') {
  //   // Bỏ qua phân cách phần nghìn, chỉ hiển thị số nguyên
  //   td.textContent = data[metacolumn.field] ? data[metacolumn.field].toString() : '';
  // } else {
  //   td.textContent = data[metacolumn.field] || '';
  // }

}

//Hàm chuyển giá trị để post lên server theo type trong meta
senapp.data.parseValueForPost = function (value, fieldmeta) {
  return value;
  //tạm chưa dùng
  // if (value === null || value === undefined||value === '') return null; //trả về null nếu giá trị là null hoặc undefined
  // if (value === '') return ''; // Trả về chuỗi rỗng nếu giá trị là chuỗi rỗng
  // switch (fieldmeta.type) {
  //   case 'int':
  //     return parseInt(value, 10);
  //   case 'bigint':
  //     return BigInt(value);
  //   case 'number':
  //   case 'numeric':
  //     return parseFloat(value);
  //   case 'bool':
  //   case 'boolean':
  //     return (value === true || value === 'true' || value === 'True' || value === 1 || value === '1') === true;
  //   case 'datetime':
  //     return new Date(value).toISOString();
  //   case 'date':
  //     return new Date(value).toISOString().split('T')[0];
  //   case 'string':
  //     return String(value);
  //   case 'text':
  //     return String(value).replace(/\r?\n|\r/g, "<br>");
  //   default:
  //     return value;
  // }
}

//hàm chuyển giá trị từ server sang dạng client theo type trong meta
senapp.data.parseValueFromServer = function (value, fieldmeta) {
  return senapp.data.parseValue(value, fieldmeta);
}
//hàm chuyển data từ server sang dạng client theo type trong meta
senapp.data.parseDataFromServer = function ({ datas, meta }) {
  meta.forEach(meta => {
    datas.forEach(item => {
      item[meta.field] = senapp.data.parseValueFromServer(item[meta.field], meta);
    });
  });
  return datas;
}

// ===== filterBuilder: gom builder điều kiện vào object =====
senapp.data.filterBuilder = {
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
senapp.data.evaluateCondition = function (obj, condition) {
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

senapp.data.evaluateLogic = function (obj, conditions) {
  if ('and' in conditions) return conditions.and.every(sub => senapp.data.evaluateLogic(obj, sub));
  if ('or' in conditions) return conditions.or.some(sub => senapp.data.evaluateLogic(obj, sub));
  if ('not' in conditions) return !senapp.data.evaluateLogic(obj, conditions.not);
  return senapp.data.evaluateCondition(obj, conditions);
}

senapp.data.buildCondition = function (obj) {
  //nếu obj={} thì trả về {}
  if (Object.keys(obj).length === 0) return obj;
  // Nếu là nhóm (and/or) thì đệ quy gọi vào từng điều kiện con
  if (obj.logic && Array.isArray(obj.conditions)) {
    const conditions = obj.conditions.map(senapp.data.buildCondition); // đệ quy
    //nếu có not hoặc not là true thì phủ định tất cả các điều kiện 
    if (obj.not) {
      if (obj.not === true) {
        return senapp.data.filterBuilder.not(obj.logic === 'and' ? senapp.data.filterBuilder.and(...conditions) : senapp.data.filterBuilder.or(...conditions));
      }
    }
    // nếu không có not thì trả về điều kiện logic tương ứng
    return obj.logic === 'and' ? senapp.data.filterBuilder.and(...conditions) : senapp.data.filterBuilder.or(...conditions);
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
    // case 'before':
    //     // Kiểm tra nếu value là chuỗi thì chuyển sang kiểu ngày
    //    if (typeof value === 'string') {
    //      cond = filterBuilder.before(field, new Date(value));
    //    }
    //    else {
    //      cond = filterBuilder.before(field, value);
    //    }
    //    break;
    // case 'after':
    //    if (typeof value === 'string') {
    //      cond = filterBuilder.after(field, new Date(value));
    //    }
    //    else {
    //      cond = filterBuilder.after(field, value);
    //    }
    //    break;
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

senapp.data.filterAdvanced = function (list, conditions) {
  //nếu điều kiện là rỗng hoặc null thì trả về danh sách gốc
  if (!conditions || Object.keys(conditions).length === 0) return list;
  return list.filter(obj => senapp.data.evaluateLogic(obj, conditions));
};


//#region server

//đồng bộ dữ liệu với server
senapp.data.synServer = async function ({ url, data, meta } = {}) {
  let resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const datapost = Object.assign({}, data); //clone data để tránh thay đổi dữ liệu gốc
  //chuyển các trường dữ liệu theo meta dùng để post lên server
  meta.forEach(meta => {
    //kiểm tra datapost có thuộc tính này không nếu không có thì bỏ qua
    if (datapost.hasOwnProperty(meta.field)) {
      datapost[meta.field] = senapp.data.parseValueForPost(datapost[meta.field], meta);
    }
  });

  try {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datapost) });

    resdata = await response.json();
  } catch (error) {
    console.error(`Error in synServer: ${error}`);
    resdata = { status: 0, message: error.message || 'Error in synServer', data: {}, errors: {} };
  }
  return resdata;
};
//lấy dữ liệu từ server (theo url và tham số truyền vào)
senapp.data.getServerData = async function ({ url } = {}) {
  try {
    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    return await response.json();
  } catch (error) {
    console.error("getServerData error:", error);
    throw error;
  }
};

//lấy meta từ server
senapp.data.getMeta = async function ({ url } = {}) {
  return await senapp.data.getServerData({ url });
  // let resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  // try {
  //   const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  //   resdata = await response.json();
  // } catch (error) {
  //   console.error(`Error in getMeta: ${error}`);
  //   resdata = { status: 0, message: error.message || 'Error in getMeta', data: {}, errors: {} };
  // }
  // return resdata;
};



//#endregion server

//#region local storage
// Lưu trữ dữ liệu vào localStorage với namespace
senapp.data.localStorageSet = function (namespace, key, value) {
  if (!namespace || !key) return; //nếu không có namespace hoặc key thì bỏ qua
  const namespacedKey = `${namespace}:${key}`;
  localStorage.setItem(namespacedKey, JSON.stringify(value)); //chuyển value thành chuỗi JSON trước khi lưu
};
senapp.data.localStorageGet = function (namespace, key) {
  if (!namespace || !key) return null; //nếu không có namespace hoặc key thì trả về null
  const namespacedKey = `${namespace}:${key}`;
  const value = localStorage.getItem(namespacedKey);
  return value ? JSON.parse(value) : null; //chuyển đổi chuỗi JSON thành giá trị gốc
};

senapp.data.localStorageRemove = function (namespace, key) {
  if (!namespace || !key) return; //nếu không có namespace hoặc key thì bỏ qua
  const namespacedKey = `${namespace}:${key}`;
  localStorage.removeItem(namespacedKey);
};

// Hàm xóa toàn bộ dữ liệu trong một namespace
senapp.data.localStorageClearNamespace = function (namespace) {
  if (!namespace) return; //nếu không có namespace thì bỏ qua
  const prefix = `${namespace}:`;
  // Duyệt qua tất cả các key trong localStorage
  Object.keys(localStorage).forEach(key => {
    // Nếu key bắt đầu bằng prefix thì xóa nó
    if (key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  });
};
//#endregion local storage

//#region indexedDB
senapp.data.idb = {};
senapp.data.idb.version = 5;//phiên bản hiện tại của indexedDB theo định nghĩa senapp
senapp.data.idb.dbName = "SenUI";
senapp.data.idb.resetDB = false; //cờ để xóa database cũ khi phiên bản không khớp
senapp.data.idb.cnnDB;
//lớp IdbStorage dùng lưu trữ dữ liệu vào indexedDB với object store tùy chọn
senapp.data.idb.IdbStorage = class {
  constructor({ tableName } = {}) {
    this.cnnDB = senapp.data.idb.cnnDB;
    this.dbName = senapp.data.idb.dbName;
    this.tableName = tableName;
  }
  async setItem(value) {
    //const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      if (!this.cnnDB) {
        // console.log(this.cnnDB);
        reject(new Error("IndexedDB is not initialized"));
        return;
      }
      try {
        const tx = this.cnnDB.transaction(this.tableName, "readwrite");
        tx.objectStore(this.tableName).put(value);
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e.target.error);
      } catch (e) {
        senapp.window.alert({ message: 'A new version is available. Please close your browser and reopen it to update.' });
        reject(new Error("IndexedDB is not initialized"));
      }
    });
  }

  async getItem(key) {
    //const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      if (!this.cnnDB) {
        // console.log(this.cnnDB);
        reject(new Error("IndexedDB is not initialized"));
        return;
      }
      try {
        const tx = this.cnnDB.transaction(this.tableName, "readonly");
        const req = tx.objectStore(this.tableName).get(key);
        req.onsuccess = () => resolve(req.result ? req.result.value : null);
        req.onerror = (e) => reject(e.target.error);
      } catch (e) {
        senapp.window.alert({ message: 'A new version is available. Please close your browser and reopen it to update.' });
        reject(new Error("IndexedDB is not initialized"));
      }
    });
  }

  async removeItem(key) {
    //const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      if (!this.cnnDB) {
        // console.log(this.cnnDB);
        reject(new Error("IndexedDB is not initialized"));
        return;
      }
      try {
        const tx = this.cnnDB.transaction(this.tableName, "readwrite");
        tx.objectStore(this.tableName).delete(key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e.target.error);
      } catch (e) {
        senapp.window.alert({ message: 'A new version is available. Please close your browser and reopen it to update.' });
        reject(new Error("IndexedDB is not initialized"));
      }
    });
  }

  async clear() {
    //const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      if (!this.cnnDB) {
        // console.log(this.cnnDB);
        reject(new Error("IndexedDB is not initialized"));
        return;
      }
      try {
        const tx = this.cnnDB.transaction(this.tableName, "readwrite");
        tx.objectStore(this.tableName).clear();
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e.target.error);
      } catch (e) {
        senapp.window.alert({ message: 'A new version is available. Please close your browser and reopen it to update.' });
        reject(new Error("IndexedDB is not initialized"));
      }
    });
  }

  async keys() {
    //const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      if (!this.cnnDB) {
        // console.log(this.cnnDB);
        reject(new Error("IndexedDB is not initialized"));
        return;
      }
      try {
        const tx = this.cnnDB.transaction(this.tableName, "readonly");
        const req = tx.objectStore(this.tableName).getAllKeys();
        req.onsuccess = () => resolve(req.result);
        req.onerror = (e) => reject(e.target.error);
      } catch (e) {
        senapp.window.alert({ message: 'A new version is available. Please close your browser and reopen it to update.' });
        reject(new Error("IndexedDB is not initialized"));
      }
    });
  }
}

//hàm khởi tạo indexedDB
senapp.data.idb.init = async function () {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(senapp.data.idb.dbName);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      console.log('Upgrading indexedDB to version', db.version);

      const tablelist = [
        { name: 'Version', keyPath: 'name' },
        { name: 'UIStore', keyPath: 'key' },
        { name: 'DBStore', keyPath: 'id' }
      ];

      tablelist.forEach(store => {
        if (!db.objectStoreNames.contains(store.name)) {
          db.createObjectStore(store.name, { keyPath: store.keyPath });
        }
      });
    };

    request.onsuccess = (e) => {
      // console.log('IndexedDB opened successfully');
      //lấy giá trị version từ object store Version nếu không có thì tạo mới và lưu phiên bản hiện tại của senapp
      const db = e.target.result;
      if (!db.objectStoreNames.contains("Version")) {
        senapp.data.idb.resetDB = true;
        resolve(db);
      }
      else {
        const transaction = db.transaction('Version', 'readwrite');
        const store = transaction.objectStore('Version');
        const getRequest = store.get('dbversion');
        getRequest.onsuccess = function (event) {
          const result = event.target.result;
          if (result) {
            // console.log('Current DB version:', result.version);
            if (result.version !== senapp.data.idb.version) {
              console.log('DB version mismatch, updating...');
              senapp.data.idb.resetDB = true;
              //store.put({name: 'dbversion', version: senapp.data.idb.version });
            }
          } else {
            store.put({ name: 'dbversion', version: senapp.data.idb.version });
            console.log('No version found, creating new entry');
          }
          resolve(db);
        };
      }
    };
    request.onerror = (e) => reject(e.target.error);
  });
};

//cần chạy đồng bộ để đảm bảo indexedDB được khởi tạo trước khi sử dụng
(async () => {
  //gọi hàm khởi tạo indexedDB
  await senapp.data.idb.init().then(db => {
    senapp.data.idb.cnnDB = db;
    //nếu senapp.data.idb.resetDB==true thì xóa database cũ
    if (senapp.data.idb.resetDB) {
      senapp.data.idb.cnnDB.close();
      const deleteReq = indexedDB.deleteDatabase(senapp.data.idb.dbName);
      deleteReq.onsuccess = () => {
        console.log(`DB ${senapp.data.idb.dbName} deleted successfully`);
        senapp.data.idb.resetDB = false;
        //khởi tạo lại indexedDB
        senapp.data.idb.init().then(db => {
          console.log('IndexedDB re-initialized:', db);
        });
      };
    }
  });

  senapp.data.idb.uistore = new senapp.data.idb.IdbStorage({ tableName: "UIStore" });
  // await senapp.data.idb.uistore.setItem({ key: 'theme', value: { width: 'dark', order: 1 } });
  // const data = await senapp.data.idb.uistore.getItem('theme');
  // console.log('Theme from IdbStorage:', data);
})();
//#endregion indexedDB

//#endregion

//#region Window utilities
senapp.window.zindex = 1055;
senapp.window.getzindex = function () {
  senapp.window.zindex++;
  return senapp.window.zindex;
};
senapp.window.toast = function ({ message, type = 'success', duration = 500, container } = {}) {
  //senapp.window.zindex++;
  // Đóng tất cả toast đang hiển thị
  const toasts = document.querySelectorAll('.toast');
  toasts.forEach(toastElement => {
    //remove class show
    toastElement.classList.remove('show');
  });

  // Tạo toast container nếu chưa có
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    //toastContainer.className = 'toast-container position-fixed bottom-0 start-50 translate-middle-x p-3';
    //toastContainer.className = 'd-flex justify-content-center align-items-center position-fixed bottom-0 w-100';
    toastContainer.className = 'd-flex justify-content-center align-items-center fixed-bottom';
    toastContainer.style.zIndex = senapp.window.getzindex();// senapp.window.zindex;

    //document.body.appendChild(toastContainer);

    if (container) {
      container.appendChild(toastContainer);
    } else {
      document.body.appendChild(toastContainer);
    }
  }

  // Tạo toast element
  const toastId = 'toast-' + Date.now();
  const toastHtml = `
                <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body py-1">
                            ${message}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            `;

  // Thêm toast vào container
  toastContainer.innerHTML += toastHtml;

  // Khởi tạo và hiển thị toast
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, {
    animation: true,
    autohide: true,
    delay: duration
  });

  // Thêm animation CSS
  const style = document.createElement('style');
  style.innerHTML = `
                .toast-container {
                    z-index: ${senapp.window.getzindex()};
                }
                .toast {
                    opacity: 0;
                    transform: translateY(100px);
                    transition: all 0.5s ease;
                }
                .toast.show {
                    opacity: 1;
                    transform: translateY(0);
                }
            `;
  document.head.appendChild(style);

  // Hiển thị toast
  toast.show();

  // Xóa toast khỏi DOM sau khi ẩn
  toastElement.addEventListener('hidden.bs.toast', () => { toastElement.remove(); });
}

senapp.window.modal = function ({ url, size = 'md', resize = false, maximizebutton = false, contentel }) {
  //senapp.window.zindex++;
  const dialog = document.createElement('div');
  dialog.className = 'modal fade';
  //gán z-index cho modal
  dialog.style.zIndex = senapp.window.getzindex();// senapp.window.zindex;
  dialog.innerHTML = `<div class="modal-dialog modal-${size}"><div class="modal-content"><div class="modal-body p-0 m-0"></div></div></div>`;
  if (resize) {
    dialog.innerHTML =
      `<div class="modal-dialog modal-${size}">
        <div class="modal-content" style="height: 100%;display: flex;flex-direction: column;">
        <div class="modal-body p-0 m-0" style="flex: 1;overflow: auto;"></div>
        <div class="resize-handle"></div>
      </div></div>`;
  }

  // Thêm modal vào body
  document.body.appendChild(dialog);
  if (url && url !== '') {
    //load url vào modal-content bằng $.load 
    $(dialog.querySelector('.modal-body')).load(url, function (response, status, xhr) {
      if (status === "error") { dialog.querySelector('.modal-body').innerHTML = "Error loading content: " + xhr.status + " " + xhr.statusText; }
      //tạo nút large và maximize
      const modalDialog = dialog.querySelector('.modal-dialog');
      const modalHeader = dialog.querySelector('.modal-header,.card-header');
      if (modalHeader) {

        //tạo thêm nút large
        const largeButton = document.createElement('a');
        largeButton.className = 'btn btn-link float-end p-0 m-0  text-muted';
        largeButton.innerHTML = '<i class="fas fa-arrows-alt"></i>';
        largeButton.onclick = function () {
          if (modalDialog.classList.contains('modal-xl')) {
            modalDialog.classList.remove('modal-xl');
            modalDialog.classList.add(`modal-${size}`);
            largeButton.innerHTML = '<i class="fas fa-arrows-alt"></i>';
          } else {
            modalDialog.classList.remove(`modal-${size}`);
            modalDialog.classList.add('modal-xl');
            largeButton.innerHTML = '<i class="fas fa-compress-arrows-alt"></i>';
          }
        };
        modalHeader.prepend(largeButton);

        if (maximizebutton == true) {
          //tạo nút maximize (tạm không dùng)
          const maximizeButton = document.createElement('a');
          maximizeButton.className = 'btn btn-link float-end p-0 m-0 text-muted mx-1';
          //dùng class bootstrap canh phải và bỏ viền
          maximizeButton.innerHTML = '<i class="fas fa-expand"></i>';
          maximizeButton.onclick = function () {
            if (modalDialog.classList.contains('modal-fullscreen')) {
              modalDialog.classList.remove('modal-fullscreen');
              maximizeButton.innerHTML = '<i class="fas fa-expand"></i>';
            } else {
              modalDialog.classList.add('modal-fullscreen');
              maximizeButton.innerHTML = '<i class="fas fa-compress"></i>';
            }
          };
          modalHeader.prepend(maximizeButton);
        }

        //tạo nút close
        closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn-close float-end';
        closeButton.setAttribute('data-bs-dismiss', 'modal');
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.style.fontSize = '8pt';
        modalHeader.prepend(closeButton);

      }
    });
  }

  // Nếu có contentel thì thêm vào modal
  if (contentel) {
    dialog.querySelector('.modal-body').appendChild(contentel);
  }

  // Tạo modal Bootstrap instance và show
  const modal = new bootstrap.Modal(dialog, {
    backdrop: 'static',//không đóng khi nhấn ngoài modal
    keyboard: true//không đóng khi nhấn phím esc
  });
  modal.show();
  // Khi modal đóng thì xoá khỏi DOM
  dialog.addEventListener('hidden.bs.modal', () => { dialog.remove(); });
  // Kéo được modal bằng jQuery UI
  $(dialog).find('.modal-dialog').draggable({
    handle: ".modal-header, .card-header"
  });

  // //nhấn esc để đóng modal
  // dialog.addEventListener('keydown', function (event) {
  //   if (event.key === "Escape") {
  //     modal.hide();
  //   }
  // });


  //resize modal khi kéo viền
  if (!resize) return;
  const modalDialog = dialog.querySelector(".modal-dialog");
  const resizeHandle = dialog.querySelector(".resize-handle");
  let isResizing = false;
  resizeHandle.addEventListener("mousedown", (e) => {
    // if (isMaximized) return;
    isResizing = true;
    document.body.style.userSelect = "none";
  });
  window.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    const rect = modalDialog.getBoundingClientRect();
    modalDialog.style.width = (e.clientX - rect.left) + "px";
    modalDialog.style.height = (e.clientY - rect.top) + "px";
  });
  window.addEventListener("mouseup", () => {
    isResizing = false;
    document.body.style.userSelect = "";
  });

}

senapp.window.offcanvas = function ({ url, title, contentel, size } = {}) {
  // senapp.window.zindex++;
  const backdropszindex = senapp.window.getzindex();
  const offcanvaszindex = senapp.window.getzindex();
  const offcanvas = document.createElement("div");
  //gán z-index cho offcanvas
  offcanvas.style.zIndex = offcanvaszindex;
  //offcanvas.id = "senappOffcanvas";
  offcanvas.className = `offcanvas offcanvas-end`;
  offcanvas.setAttribute("data-bs-backdrop", "static");//không đóng khi nhấn ngoài offcanvas
  offcanvas.setAttribute("data-bs-keyboard", "false");//không đóng khi nhấn phím esc
  //set  tabindex="-1" cho nó
  offcanvas.setAttribute("tabindex", "-1");


  if (size) offcanvas.classList.add(`offcanvas-size-${size}`);

  offcanvas.tabIndex = -1;
  offcanvas.innerHTML = `
      <div class="offcanvas-header">
        <h5>${title || ''}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body"></div>
    `;
  document.body.appendChild(offcanvas);
  if (url && url !== '') {
    // Cập nhật nội dung
    $(offcanvas.querySelector('.offcanvas-body')).load(url, function (response, status, xhr) {
      if (status === "error") { offcanvas.querySelector('.offcanvas-body').innerHTML = "Error loading content: " + xhr.status + " " + xhr.statusText; }
    });
  }

  // Nếu có contentel thì thêm vào offcanvas
  if (contentel) {
    offcanvas.querySelector('.offcanvas-body').appendChild(contentel);
  }

  //nhấn esc để đóng modal
  offcanvas.addEventListener('keydown', function (event) {
    if (event.key === "Escape") { bsOffcanvas.hide(); }
  });
  offcanvas.addEventListener('shown.bs.offcanvas', function () { offcanvas.focus(); });


  // Khởi tạo Bootstrap Offcanvas và show
  const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvas);
  bsOffcanvas.show();

  const backdrops = document.querySelectorAll(".offcanvas-backdrop");
  const latestBackdrop = backdrops[backdrops.length - 1];
  if (latestBackdrop) { latestBackdrop.style.zIndex = backdropszindex; }
  // Khi modal đóng thì xoá khỏi DOM
  offcanvas.addEventListener('hidden.bs.offcanvas', () => { offcanvas.remove(); });

};

senapp.window.alert = function ({ message, title = 'Thông báo', type = 'info' }) {
  //dùng lại hàm alert gốc 
  return window.alert(message);
};

senapp.window.confirm = function ({ message, title = 'Xác nhận', onConfirm, onCancel }) {
  //dùng lại hàm confirm gốc 
  return window.confirm(message);
};

senapp.window.lookup = function ({ options }) {
  //hiển thị lookup modal
  const defaults = {
    title: '',//'Lookup Modal',
    titleselect: '',//'Select an option from the list',
    multiple: false, // Chỉ chọn một hay nhiều
    lookup: null,// { url: '/senobject/lookup', fields: { id: '`${item.Id}`', value: '`${item.String}`', label: '`${item.Id}-${item.String}`' }, filter: { logic: "and", conditions: [{ field: "String", op: "includes", value: '' }] } },
    data: [],//[{id:1,value:'option1',label:'Option 1'},{id:2,value:'option2',label:'Option 2'},{id:3,value:'option3',label:'Option 3'},{id:4,value:'option4',label:'Option 4'}]
  };
  Object.assign(defaults, options);
  const select = document.createElement('select');
  select.className = 'form-select';
  select.multiple = defaults.multiple;
  select.innerHTML = `${defaults.data.map(item => `<option value="${item.id}">${item.label}</option>`).join('')} `;

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-header">
      <h5 class="card-title mb-0">${defaults.title}</h5>
    </div>
    <div class="card-body">
      <p class="card-text">${defaults.titleselect}</p>
    </div>
    <div class="card-footer">
    </div>
  `;

  const acceptBtn = document.createElement('button');
  acceptBtn.className = 'btn btn-subtle-primary me-1';
  acceptBtn.innerText = 'Accept';
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-subtle-secondary';
  cancelBtn.innerText = 'Cancel';

  const cardFooter = card.querySelector('.card-footer');
  cardFooter.appendChild(acceptBtn);
  cardFooter.appendChild(cancelBtn);
  card.appendChild(cardFooter);
  //cancel-btn là đóng modal
  cancelBtn.addEventListener('click', () => {
    //đóng modal nếu có
    const modal = card.closest('.modal');
    if (modal) {
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      bootstrapModal.hide();
    }
  });

  //accept-btn là xác nhận và lấy giá trị
  acceptBtn.addEventListener('click', () => {
    const selectedValues = Array.from(select.selectedOptions).map(option => option.value);
    // Đóng modal nếu có
    const modal = card.closest('.modal');
    if (modal) {
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      bootstrapModal.hide();
    }
    //nếu có callback thì gọi callback
    if (options.callback) {
      senapp.utils.executefunctionbyname(options.callback, window, selectedValues);
    }
  });

  //append select vào card body
  const cardBody = card.querySelector('.card-body');
  cardBody.appendChild(select);
  senapp.window.modal({ contentel: card });
  const choices = senapp.utils.lookup(select, { searchChoices: !(defaults.lookup), duplicateItemsAllowed: false });// new Choices(select,{});
  //focus vào trường đầu tiên
  // Đợi Choices render xong rồi focus
  setTimeout(() => {
    const firstInput = card.querySelector('.choices');
    if (firstInput) {
      //nếu select có multiple thì 
      if (defaults.multiple) {
        //nếu là multiple thì focus vào trường đầu tiên của select
        const input = firstInput.querySelector('input.choices__input');
        if (input) {
          //console.log('Focus vào trường đầu tiên:', input);
          if (card.closest('.modal')) {
            $(card).closest('.modal').off('shown.bs.modal').on('shown.bs.modal', function () {
              input.focus();
            });
          } else  //nếu không nằm trong modal thì focus vào trường đầu tiên
            input.focus();
        }
      } else {
        if (card.closest('.modal')) {
          $(card).closest('.modal').off('shown.bs.modal').on('shown.bs.modal', function () {
            firstInput.focus();
          });
        } else  //nếu không nằm trong modal thì focus vào trường đầu tiên
          firstInput.focus();
      }
    }
  }, 0);

  const lookup = defaults.lookup;
  if (lookup) {
    select.addEventListener('search', async function (e) {
      const keyword = e.detail.value;
      if (!keyword.endsWith(' ')) return;
      const trimmed = keyword.trim();
      lookup.filter.conditions[0].value = trimmed;
      try {
        const res = await fetch(`${lookup.url}?pagesize=${lookup.pagesize || 0}&filter=${JSON.stringify(lookup.filter)}${lookup.extparam || ''}`);
        lookup.data = [];
        if (res.ok) {
          const data = await res.json();
          lookup.data = data.datas.map(item => ({ id: eval(lookup.fields.id), value: eval(lookup.fields.value), label: eval(lookup.fields.label) }));
        }
      } catch (err) { console.error('Error fetching API:', err); }
      choices.setChoices(lookup.data, 'id', 'label', true);
    });
  }

}

senapp.window.lookups = function ({ options }) {
  let arroptions = [];
  if (Array.isArray(options)) {
    arroptions = options;
  }
  else {
    arroptions.push(options);
  }

  //hiển thị lookup modal
  const defaults = {
    title: '',//'Lookup Modal',
    titleselect: '',//'Select an option from the list',
    multiple: false, // Chỉ chọn một hay nhiều
    lookup: null,// { url: '/senobject/lookup', fields: { id: '`${item.Id}`', value: '`${item.String}`', label: '`${item.Id}-${item.String}`' }, filter: { logic: "and", conditions: [{ field: "String", op: "includes", value: '' }] } },
    data: [],//[{id:1,value:'option1',label:'Option 1'},{id:2,value:'option2',label:'Option 2'},{id:3,value:'option3',label:'Option 3'},{id:4,value:'option4',label:'Option 4'}]
  };
  Object.assign(defaults, arroptions[0]);

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-header">
      <h5 class="card-title mb-0">${defaults.title}</h5>
    </div>
    <div class="card-body">
    </div>
    <div class="card-footer">
    </div>
  `;

  const acceptBtn = document.createElement('button');
  acceptBtn.className = 'btn btn-subtle-primary me-1';
  acceptBtn.innerText = 'Accept';
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-subtle-secondary';
  cancelBtn.innerText = 'Cancel';

  const cardFooter = card.querySelector('.card-footer');
  cardFooter.appendChild(acceptBtn);
  cardFooter.appendChild(cancelBtn);
  card.appendChild(cardFooter);
  //cancel-btn là đóng modal
  cancelBtn.addEventListener('click', () => {
    //đóng modal nếu có
    const modal = card.closest('.modal');
    if (modal) {
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      bootstrapModal.hide();
    }
  });

  //accept-btn là xác nhận và lấy giá trị
  acceptBtn.addEventListener('click', () => {
    let selectedValues = [];
    selects.forEach(select => {
      const values = Array.from(select.selectedOptions).map(option => option.value);
      selectedValues.push(values);
    });
    // const selectedValues = Array.from(select.selectedOptions).map(option => option.value);

    // Đóng modal nếu có
    const modal = card.closest('.modal');
    if (modal) {
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      bootstrapModal.hide();
    }
    //nếu có callback thì gọi callback
    if (defaults.callback) {
      senapp.utils.executefunctionbyname(defaults.callback, window, selectedValues);
    }
  });

  //append select vào card body
  const cardBody = card.querySelector('.card-body');

  let selects = [];
  arroptions.forEach(opt => {
    const selectlabel = document.createElement('p');
    selectlabel.className = 'card-text';
    selectlabel.innerText = opt.titleselect || defaults.titleselect;
    cardBody.appendChild(selectlabel);

    const select = document.createElement('select');
    select.className = 'form-select mb-2';
    select.multiple = opt.multiple || false;
    select.innerHTML = `${(opt.data || []).map(item => `<option value="${item.id}">${item.label}</option>`).join('')} `;
    cardBody.appendChild(select);
    selects.push(select);
  });

  senapp.window.modal({ contentel: card });

  //quét tất cả select trong selects
  selects.forEach((select, index) => {
    const opt = arroptions[index] || defaults;
    const choices = senapp.utils.lookup(select, { searchChoices: !(opt.lookup), duplicateItemsAllowed: false });// new Choices(select,{});
    //focus vào trường đầu tiên
    // Đợi Choices render xong rồi focus
    setTimeout(() => {
      const firstInput = card.querySelector('.choices');
      if (firstInput) {
        //nếu select có multiple thì 
        if (opt.multiple) {
          //nếu là multiple thì focus vào trường đầu tiên của select
          const input = firstInput.querySelector('input.choices__input');
          if (input) {
            //console.log('Focus vào trường đầu tiên:', input);
            if (card.closest('.modal')) {
              $(card).closest('.modal').off('shown.bs.modal').on('shown.bs.modal', function () {
                input.focus();
              });
            } else  //nếu không nằm trong modal thì focus vào trường đầu tiên
              input.focus();
          }
        } else {
          if (card.closest('.modal')) {
            $(card).closest('.modal').off('shown.bs.modal').on('shown.bs.modal', function () {
              firstInput.focus();
            });
          } else  //nếu không nằm trong modal thì focus vào trường đầu tiên
            firstInput.focus();
        }
      }
    }, 0);

    const lookup = opt.lookup;
    if (lookup) {
      select.addEventListener('search', async function (e) {
        const keyword = e.detail.value;
        if (!keyword.endsWith(' ')) return;
        const trimmed = keyword.trim();
        lookup.filter.conditions[0].value = trimmed;
        if (lookup.url) {
          try {
            const res = await fetch(`${lookup.url}?pagesize=${lookup.pagesize || 0}&filter=${JSON.stringify(lookup.filter)}${lookup.extparam || ''}`);
            lookup.data = [];
            if (res.ok) {
              const data = await res.json();
              lookup.data = data.datas.map(item => ({ id: eval(lookup.fields.id), value: eval(lookup.fields.value), label: eval(lookup.fields.label) }));
            }
          } catch (err) { console.error('Error fetching API:', err); }
        }
        choices.setChoices(lookup.data, 'id', 'label', true);
      });
    }
  });

  // const choices = senapp.utils.lookup(select, { searchChoices: !(defaults.lookup), duplicateItemsAllowed: false });// new Choices(select,{});
  // //focus vào trường đầu tiên
  // // Đợi Choices render xong rồi focus
  // setTimeout(() => {
  //   const firstInput = card.querySelector('.choices');
  //   if (firstInput) {
  //     //nếu select có multiple thì 
  //     if (defaults.multiple) {
  //       //nếu là multiple thì focus vào trường đầu tiên của select
  //       const input = firstInput.querySelector('input.choices__input');
  //       if (input) {
  //         //console.log('Focus vào trường đầu tiên:', input);
  //         if (card.closest('.modal')) {
  //           $(card).closest('.modal').off('shown.bs.modal').on('shown.bs.modal', function () {
  //             input.focus();
  //           });
  //         } else  //nếu không nằm trong modal thì focus vào trường đầu tiên
  //           input.focus();
  //       }
  //     } else {
  //       if (card.closest('.modal')) {
  //         $(card).closest('.modal').off('shown.bs.modal').on('shown.bs.modal', function () {
  //           firstInput.focus();
  //         });
  //       } else  //nếu không nằm trong modal thì focus vào trường đầu tiên
  //         firstInput.focus();
  //     }
  //   }
  // }, 0);

  // const lookup = defaults.lookup;
  // if (lookup) {
  //   select.addEventListener('search', async function (e) {
  //     const keyword = e.detail.value;
  //     if (!keyword.endsWith(' ')) return;
  //     const trimmed = keyword.trim();
  //     lookup.filter.conditions[0].value = trimmed;
  //     try {
  //       const res = await fetch(`${lookup.url}?pagesize=${lookup.pagesize || 0}&filter=${JSON.stringify(lookup.filter)}${lookup.extparam || ''}`);
  //       lookup.data = [];
  //       if (res.ok) {
  //         const data = await res.json();
  //         lookup.data = data.datas.map(item => ({ id: eval(lookup.fields.id), value: eval(lookup.fields.value), label: eval(lookup.fields.label) }));
  //       }
  //     } catch (err) { console.error('Error fetching API:', err); }
  //     choices.setChoices(lookup.data, 'id', 'label', true);
  //   });
  // }

}

senapp.window.loading = (() => {
  let overlay = null;

  function createOverlay(target) {
    const isFullScreen = target === document.body;

    overlay = document.createElement('div');
    overlay.className = 'loading-overlay';

    if (isFullScreen) {
      overlay.classList.add('fullscreen');
    } else {
      const targetPos = getComputedStyle(target).position;
      if (targetPos === 'static' || !targetPos) {
        target.style.position = 'relative';
      }
    }

    overlay.innerHTML = `
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
      `;

    target.appendChild(overlay);
  }
  return {
    show: (selector) => {
      if (overlay) return;
      if (!selector) selector = document.querySelector('body'); // Mặc định là body nếu không có selector
      createOverlay(selector);
    },
    hide: () => {
      if (overlay) {
        overlay.remove();
        overlay = null;
      }
    }
  };
})();
//#endregion

//#region common utilities
senapp.common.url = {
  filedownloadzip: `https://consims.com/api/download-file`,
  filedownload: `https://consims.com/api/download-document`,
  fileview: `https://consims.com/ViewFile.html`
}

senapp.common.printelem = function ({ elem, title = 'Print', css = '' }) {
  senapp.common.printpopup({ data: $(elem).html(), title: title, css: css });
};
senapp.common.printpopup = function ({ data, title = 'Print', css = '' }) {
  var mywindow = window.open('', 'Print', 'height=' + window.innerHeight + ',width=' + window.innerWidth);
  mywindow.document.write(`<html><head><title>${title}</title>`);
  /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');

  mywindow.document.write(`<link rel="preconnect" href="https://fonts.googleapis.com">`);
  mywindow.document.write(`<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">`);
  mywindow.document.write(`<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800;900&amp;display=swap" rel="stylesheet">`);
  mywindow.document.write(`<link href="/vendors/simplebar/simplebar.min.css" rel="stylesheet">`);
  mywindow.document.write(`<link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.8/css/line.css">`);
  mywindow.document.write(`<link href="/assets/css/theme-rtl.min.css" type="text/css" rel="stylesheet" id="style-rtl">`);
  mywindow.document.write(`<link href="/assets/css/theme.min.css" type="text/css" rel="stylesheet" id="style-default">`);
  mywindow.document.write(`<link href="/assets/css/user-rtl.min.css" type="text/css" rel="stylesheet" id="user-style-rtl">`);
  mywindow.document.write(`<link href="/assets/css/user.min.css?v=20250809" type="text/css" rel="stylesheet" id="user-style-default"></link>`);

  mywindow.document.write(`<style media="print">${css}</style></head><body style="text-align:center;"><div style="display:inline-block;">`);
  mywindow.document.write(data);
  mywindow.document.write('</div></body></html>');

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10
  setTimeout(function () { mywindow.print(); mywindow.close(); }, 500);
  return true;
};

//#endregion common utilities

//#region Function utilities
senapp.utils.downloadallfiles = async function ({ tblname, type = 'selected' }) {
  //type:'all','selected'
  const tableobject = eval(tblname);
  let selectedRows = [];
  if (type === 'all') {
    selectedRows = tableobject.datas || [];
    if (selectedRows.length === 0) {
      senapp.window.toast({ message: 'No files to download', type: 'danger' });
      return;
    }
  }
  if (type === 'selected') {
    selectedRows = tableobject.getDataSelected();
    if (selectedRows.length === 0) {
      senapp.window.toast({ message: 'Please select at least one file to download', type: 'danger' });
      return;
    }
  }


  const params = {
    LogIn: senapp.user.username,
    SessionId: senapp.sessionid,
    UpdateMode: 'pack_file',
    Language: senapp.lang || 'en',
    Attachments: selectedRows.map(data => ({ FileId: data.Id }))
  };
  const paramsString = encodeURIComponent(JSON.stringify(params));
  const filedownloadzip = `${senapp.common.url.filedownloadzip}?params=${paramsString}`;

  window.open(filedownloadzip, '_blank');


}

senapp.utils.signallfiles = function ({ tblname, type = 'selected' }) {
  const tableobject = eval(tblname);
  let selectedRows = [];
  if (type === 'all') {
    selectedRows = tableobject.datas;
    if (selectedRows.length === 0) {
      senapp.window.toast({ message: 'No files to sign', type: 'danger' });
      return;
    }
  }
  if (type === 'selected') {
    selectedRows = tableobject.getDataSelected();
    if (selectedRows.length === 0) {
      senapp.window.toast({ message: 'Please select at least one file to sign', type: 'danger' });
      return;
    }
  }
  const url = `/common?viewname=certificatesign&tblname=${tblname}&type=${type}&callback=` + encodeURIComponent('senapp.utils.signallfilescallback');
  senapp.window.modal({ title: `Sign File`, url: url });
}
senapp.utils.signallfilescallback = async function (data) {
  // xử lý sau khi ký xong
  console.log('Signing callback data:', data);
  if (data && data.length > 0 && data[0].status === 0) {
    const tableobject = eval(data[0].data.urldata.query.tblname);
    const type = data[0].data.urldata.query.type;
    let selectedRows = [];
    if (type === 'all') { selectedRows = tableobject.datas; }
    if (type === 'selected') { selectedRows = tableobject.getDataSelected(); }

    const url = `${'/common/signfile'}`;
    const datapost = {
      fileids: selectedRows.map(row => row.Id),
      signnote: data[0].data.Remark,
      isread: data[0].data.IsRead
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datapost)
    })
    const result = await response.json();
    if (result.error) {
      senapp.window.toast({ message: result.error, type: 'danger' });
    }
    else {
      senapp.window.toast({ message: result.message, type: 'success' });
    }
    tableobject.refreshDataDisplay();

  } else {
    senapp.window.toast({ message: 'Unsigned file.', type: 'danger' });
  }
  // Tải lại bảng

};


senapp.utils.executefunctionbyname = function (functionName, context /*, args */) {
  let args = Array.prototype.slice.call(arguments, 2);
  let path = functionName.replace(/\[(\d+)\]/g, '.$1'); // Chuyển [7] thành .7
  let namespaces = path.split('.');
  let func = namespaces.pop();
  for (let i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
    if (!context) {
      throw new Error("Invalid namespace path at " + namespaces[i]);
    }
  }
  if (typeof context[func] !== "function") {
    throw new Error("Function " + func + " not found");
  }
  return context[func].apply(context, args);
};

senapp.utils.text = {
  // Hàm chuyển đổi văn bản thành định dạng phù hợp
  t: async function (text) {
    //tạm khóa dịch thuật 20251006
    return text;

    //nếu text là rỗng thì trả về rỗng
    if (!text || text === '') return text;
    //lấy ngôn ngữ hiện tại từ localStorage
    const lang = senapp.session.env.lang || 'en';
    //tìm trong localeString nếu có thì trả về chuỗi tương ứng
    const locale = senapp.utils.text.localeString.find(item => item.code === lang && item.name === text);
    //nếu không tìm thấy thì có thể tìm thêm api trên server(sau này bổ sung)
    return locale ? locale.text : text;
  },
  initLocalePlaceholders: async function ({ container } = {}) {
    //hàm chuyển ngôn ngữ các class sen-label và form-label trong container
    if (!container) container = document;
    //lấy các input có placeholder
    var inputs = container.querySelectorAll("input[placeholder], textarea[placeholder], select[placeholder]");
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var text = input.getAttribute("placeholder");
      var translatedText = await senapp.utils.text.t(text);
      input.setAttribute("placeholder", translatedText);
    }
  },
  initLocaleLabels: async function ({ container } = {}) {
    //hàm chuyển ngôn ngữ các class sen-label và form-label trong container
    if (!container) container = document;
    var labels = container.querySelectorAll(".form-label, .form-icon-label, .sen-label");
    for (var i = 0; i < labels.length; i++) {
      var label = labels[i];
      var text = label.innerText;
      var translatedText = await senapp.utils.text.t(text);
      label.innerText = translatedText;
    }
    //lấy các input có placeholder
    senapp.utils.text.initLocalePlaceholders({ container });
  },
  localeString: [
    { code: 'vi', name: 'Sign In', text: 'Đăng Nhập' },
    { code: 'vi', name: 'Get access to your account', text: 'Truy cập vào tài khoản của bạn' },
    { code: 'vi', name: 'EMAIL ADDRESS', text: 'Địa chỉ Email' },
    { code: 'vi', name: 'PASSWORD', text: 'Mật khẩu' },
    { code: 'vi', name: 'Email address', text: 'Địa chỉ Email' },
    { code: 'vi', name: 'Password', text: 'Mật khẩu' },
    { code: 'vi', name: 'Forgot Password?', text: 'Quên mật khẩu?' },
    { code: 'vi', name: 'Create an account', text: 'Tạo tài khoản' },
    { code: 'vi', name: 'English', text: 'Tiếng Anh' },
    { code: 'vi', name: 'Sign Up', text: 'Đăng Ký' },
    { code: 'vi', name: 'Create your account today', text: 'Tạo tài khoản của bạn ngay hôm nay' },
    { code: 'vi', name: 'NAME', text: 'Họ và Tên' },
    { code: 'vi', name: 'EMAIL ADDRESS', text: 'Địa chỉ Email' },
    { code: 'vi', name: 'PASSWORD', text: 'Mật khẩu' },
    { code: 'vi', name: 'CONFIRM PASSWORD', text: 'Xác nhận mật khẩu' },
    { code: 'vi', name: 'Sign up', text: 'Đăng Ký' },
    { code: 'vi', name: 'Sign in to an existing account', text: 'Đăng nhập vào tài khoản hiện có' },
    { code: 'vi', name: 'Forgot your password?', text: 'Quên mật khẩu của bạn?' },
    { code: 'vi', name: 'Enter your email below and we will send you a reset password', text: 'Nhập email của bạn bên dưới và chúng tôi sẽ gửi cho bạn mật khẩu đặt lại' },
    { code: 'vi', name: 'Email', text: 'Email' },
    { code: 'vi', name: 'Send', text: 'Gửi' },
    { code: 'vi', name: 'Profile', text: 'Hồ sơ' },
    { code: 'vi', name: 'Settings', text: 'Cài đặt' },
    { code: 'vi', name: 'Logout', text: 'Đăng xuất' },
    { code: 'vi', name: 'Sign In', text: 'Đăng nhập' },
    { code: 'vi', name: 'Sign Out', text: 'Đăng xuất' },
    { code: 'vi', name: 'Sign in', text: 'Đăng nhập' },
    { code: 'vi', name: 'Sign out', text: 'Đăng xuất' },
    { code: 'vi', name: 'Change Password', text: 'Đổi mật khẩu' },
    { code: 'vi', name: 'Current Password', text: 'Mật khẩu hiện tại' },
    { code: 'vi', name: 'New Password', text: 'Mật khẩu mới' },
    { code: 'vi', name: 'Confirm New Password', text: 'Xác nhận mật khẩu mới' },
    { code: 'vi', name: 'Update Password', text: 'Cập nhật mật khẩu' },
    { code: 'vi', name: 'Cancel', text: 'Hủy' },
    { code: 'vi', name: 'Save & Close', text: 'Lưu & Đóng' },
    { code: 'vi', name: 'Create New', text: 'Tạo Mới' },
    { code: 'vi', name: 'Reset Password', text: 'Đặt lại mật khẩu' },
    { code: 'vi', name: 'Reset your password', text: 'Đặt lại mật khẩu của bạn' },
    { code: 'vi', name: 'Personal Information', text: 'Thông tin cá nhân' },
    { code: 'vi', name: 'Save Information', text: 'Lưu thông tin' },
    { code: 'vi', name: 'Address', text: 'Địa chỉ' },
    { code: 'vi', name: 'Reset new password', text: 'Đặt lại mật khẩu mới' },
    { code: 'vi', name: 'Type your new password', text: 'Nhập mật khẩu mới của bạn' },
    { code: 'vi', name: 'Set Password', text: 'Đặt Mật Khẩu' },
    { code: 'vi', name: 'Type old password', text: 'Nhập mật khẩu cũ' },
    { code: 'vi', name: 'Type new password', text: 'Nhập mật khẩu mới' },
    { code: 'vi', name: 'Confirm new password', text: 'Nhập lại mật khẩu mới' },


  ], //đối tượng lưu trữ các chuỗi ngôn ngữ
};

//#endregion

//#region Input utilities


senapp.utils.data2input = function ({ fieldmeta, value, input }) {
  if (!input) return;
  //nếu input là select thì set giá trị của option
  if (input.tagName.toLowerCase() === 'select') {
    //nếu multiple thì xử lý khác 
    if (input.multiple) {
      //nếu value là mảng thì set giá trị của option
      if (Array.isArray(value)) {
        value.forEach(itemvalue => {
          //nếu itemvalue khác rỗng 
          if (itemvalue) {
            //tạo option nếu chưa có
            if (!input.querySelector(`option[value='${itemvalue}']`)) {
              const option = document.createElement('option');
              option.value = itemvalue;
              option.textContent = itemvalue;
              input.appendChild(option);
            }
            const option = input.querySelector(`option[value='${itemvalue}']`);
            if (option) {
              option.selected = true;
              option.setAttribute('selected', 'selected'); // Đảm bảo option được đánh dấu là selected
            }
          }
        });
      } else {
        //nếu value không phải mảng thì cắt chuỗi theo ký tự ','
        const values = value.split(',').map(item => item.trim());
        values.forEach(itemvalue => {
          if (itemvalue) {
            //tạo option nếu chưa có
            if (!input.querySelector(`option[value='${itemvalue}']`)) {
              const option = document.createElement('option');
              option.value = itemvalue;
              option.textContent = itemvalue;
              input.appendChild(option);
            }
            const option = input.querySelector(`option[value='${itemvalue}']`);
            if (option) {
              option.selected = true;
              option.setAttribute('selected', 'selected'); // Đảm bảo option được đánh dấu là selected
            }
          }
        });
      }
    }
    else {
      if (value) {
        //nếu chưa có option thì thêm option
        if (input.options.length === 0) {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = value;
          input.appendChild(option);
        }

        const option = input.querySelector(`option[value='${value}']`);
        if (option) {
          option.selected = true;
          option.setAttribute('selected', 'selected'); // Đảm bảo option được đánh dấu là selected
        }
      }
    }
  } else if (input.type === 'checkbox') {
    input.checked = value;
  } else if (input.type === 'radio') {
    input.checked = value;
  } else {
    //nếu không phải checkbox hoặc radio thì set giá trị
    if (fieldmeta) {
      //trường hợp type là date hoặc datetime thì phải chuyển đổi giá trị về định dạng phù hợp
      if (fieldmeta.type === 'date') {
        //input.value = new Date(value).toISOString().split('T')[0]; // Chuyển đổi về định dạng YYYY-MM-DD
        input.value = senapp.ext.moment(value).format('YYYY-MM-DD');
      } else if (fieldmeta.type === 'datetime') {
        //input.value = new Date(value).toISOString().slice(0, 16); // Chuyển đổi về định dạng YYYY-MM-DDTHH:mm
        input.value = senapp.ext.moment(value).format('YYYY-MM-DDTHH:mm');
      } else if (fieldmeta.type === 'bigint' || fieldmeta.type === 'numeric' || fieldmeta.type === 'int' || fieldmeta.type === 'number') {
        //nếu khác rỗng thì mới gán số vào
        if (value !== null && value !== undefined && value !== '') {
          input.value = Number(value); // Chuyển đổi về số
        } else {
          input.value = '';
        }
      } else if (fieldmeta.type === 'boolean') {
        input.checked = value === true || value === 'true' || value === 1 || value === '1'; // Chuyển đổi về boolean
      }
      // Nếu không phải các trường đặc biệt thì gán giá trị trực tiếp
      else if (fieldmeta.type === 'string' || fieldmeta.type === 'text') {
        input.value = value;
      } else {
        input.value = value; // Gán giá trị vào input
      }
    }
    else {
      // Nếu không có meta cho trường này thì gán giá trị trực tiếp
      input.value = value; // Gán giá trị vào input
    }
  }

}

senapp.utils.data2inputs = function ({ meta, data, container }) {
  // Hàm này sẽ ánh xạ các trường trong data vào các input trong container
  for (let key in data) {
    const input = container.querySelector(`[name='${key}']`);
    if (input) {
      senapp.utils.data2input({
        input,
        value: data[key],
        fieldmeta: meta ? meta.find(m => m.field === key) : null
      });

      // //nếu input là select thì set giá trị của option
      // if (input.tagName.toLowerCase() === 'select') {
      //   //nếu multiple thì xử lý khác 
      //   if (input.multiple) {
      //     //nếu data[key] là mảng thì set giá trị của option
      //     if (Array.isArray(data[key])) {
      //       data[key].forEach(value => {
      //         //tạo option nếu chưa có
      //         if (!input.querySelector(`option[value='${value}']`)) {
      //           const option = document.createElement('option');
      //           option.value = value;
      //           option.textContent = value;
      //           input.appendChild(option);
      //         }
      //         const option = input.querySelector(`option[value='${value}']`);
      //         if (option) {
      //           option.selected = true;
      //           option.setAttribute('selected', 'selected'); // Đảm bảo option được đánh dấu là selected
      //         }
      //       });
      //     } else {
      //       //nếu data[key] không phải mảng thì cắt chuỗi theo ký tự ','
      //       const values = data[key].split(',').map(item => item.trim());
      //       values.forEach(value => {
      //         //tạo option nếu chưa có  
      //         if (!input.querySelector(`option[value='${value}']`)) {
      //           const option = document.createElement('option');
      //           option.value = value;
      //           option.textContent = value;
      //           input.appendChild(option);
      //         }
      //         const option = input.querySelector(`option[value='${value}']`);
      //         if (option) {
      //           option.selected = true;
      //           option.setAttribute('selected', 'selected'); // Đảm bảo option được đánh dấu là selected
      //         }
      //       });
      //     }
      //   }
      //   else {
      //     //nếu chưa có option thì thêm option
      //     if (input.options.length === 0) {
      //       const option = document.createElement('option');
      //       option.value = data[key];
      //       option.textContent = data[key];
      //       input.appendChild(option);
      //     }

      //     const option = input.querySelector(`option[value='${data[key]}']`);
      //     if (option) {
      //       option.selected = true;
      //       option.setAttribute('selected', 'selected'); // Đảm bảo option được đánh dấu là selected
      //     }
      //   }
      // }
      // //nếu input là checkbox hoặc radio thì set giá trị
      // if (input.type === 'checkbox') {
      //   input.checked = data[key];
      // } else if (input.type === 'radio') {
      //   input.checked = data[key];
      // } else {
      //   //nếu không phải checkbox hoặc radio thì set giá trị
      //   // nếu meta có trường key thì kiểm tra xem có trong meta không  
      //   if (meta && meta.length > 0) {
      //     const fieldMeta = meta.find(m => m.field === key);
      //     if (fieldMeta) {
      //       //trường hợp type là date hoặc datetime thì phải chuyển đổi giá trị về định dạng phù hợp  
      //       if (fieldMeta.type === 'date') {
      //         input.value = new Date(data[key]).toISOString().split('T')[0]; // Chuyển đổi về định dạng YYYY-MM-DD
      //       } else if (fieldMeta.type === 'datetime') {
      //         input.value = new Date(data[key]).toISOString().slice(0, 16); // Chuyển đổi về định dạng YYYY-MM-DDTHH:mm
      //       } else if (fieldMeta.type === 'bigint' || fieldMeta.type === 'numeric') {
      //         input.value = Number(data[key]); // Chuyển đổi về số
      //       } else if (fieldMeta.type === 'boolean') {
      //         input.checked = data[key] === true || data[key] === 'true' || data[key] === 1 || data[key] === '1'; // Chuyển đổi về boolean
      //       }
      //       // Nếu không phải các trường đặc biệt thì gán giá trị trực tiếp
      //       else if (fieldMeta.type === 'string' || fieldMeta.type === 'text') {
      //         input.value = data[key];
      //       } else {
      //         input.value = data[key]; // Gán giá trị vào input
      //       }
      //     }
      //     else {
      //       // Nếu không có meta cho trường này thì gán giá trị trực tiếp
      //       input.value = data[key];
      //     }
      //   } else {
      //     input.value = data[key]; // Gán giá trị vào input
      //   }
      // }
    }
  }
};

senapp.utils.data2displays = function ({ metas, data, container } = {}) {
  // Hàm này sẽ ánh xạ các trường trong data vào các phần tử có class sen-display
  metas.forEach(meta => {
    //tìm class sen-display có data-field tương ứng với meta.field
    const displayElement = container.querySelector(`.sen-display[name="${meta.field}"]`);
    const displayElementValue = senapp.data.stringifyValue(data[meta.field], meta);
    if (displayElement && displayElementValue) {
      displayElement.innerHTML = displayElementValue;
    }
  });
};


senapp.utils.input2data = function ({ fieldmeta, data, input }) {
  if (!input) return;
  let value = input.value;
  //nếu input là select thì lấy giá trị của option
  if (input.tagName.toLowerCase() === 'select') {
    //nếu multiple thì lấy giá trị của các option được chọn
    if (input.multiple) {
      value = Array.from(input.selectedOptions).map(option => option.value).join(',');
    } else {
      value = input.value;
    }
  }
  //nếu input là checkbox hoặc radio thì lấy giá trị
  if (input.type === 'checkbox') {
    value = input.checked;
  } else if (input.type === 'radio') {
    if (input.checked) {
      value = input.value;
    }
  }

  //nếu meta có trường key thì kiểm tra xem có trong meta không
  if (fieldmeta) {
    //nếu có thì parse giá trị theo type trong meta
    value = senapp.data.parseValue(value, fieldmeta);
  }

  data[input.name] = value; // Gán giá trị vào data
}

senapp.utils.input2datas = function ({ meta, data, container }) {
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach(function (input) {
    senapp.utils.input2data({
      input,
      data: data,
      fieldmeta: meta ? meta.find(m => m.field === input.name) : null
    });
  });
};

senapp.utils.meta2inputs = function ({ meta, container }) {
  meta.forEach(item => {
    if (item.key) {
      const input = container.querySelector(`[name="${item.field}"]`);
      if (input) {
        input.setAttribute('readonly', true);
      }
    }
  });
};

//map meta vào label căn cứ vào field-name
senapp.utils.meta2labels = function ({ meta, container }) {
  meta.forEach(item => {
    const label = container.querySelector(`[field-name="${item.field}"]`);
    if (label) {
      //nếu isnullable là false thì thêm dấu * vào sau label
      if (item.isnullable === false) {
        label.textContent = `${item.description || item.field} (*)`;
      } else {
        label.textContent = item.description || item.field;
      }
      //label.textContent = item.description || item.field; 
    }
  });
};

//map errors vào input tương ứng
senapp.utils.errors2inputs = function ({ errors, container }) {
  //xóa hết class is-invalid của các input
  container.querySelectorAll('.form-control').forEach(input => {
    input.classList.remove('is-invalid');
    const feedback = input.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
      feedback.remove();
    }
  });
  //nếu có lỗi thì hiển thị thông báo lỗi
  //và đánh dấu các input có lỗi bằng class is-invalid
  for (const [field, message] of Object.entries(errors)) {
    const input = container.querySelector(`[name="${field}"]`);
    if (input) {
      input.classList.add('is-invalid');
      const feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      feedback.textContent = message;
      input.parentNode.appendChild(feedback);
    }
  }
  //focus vào input đầu tiên có lỗi
  const firstInvalidInput = container.querySelector('.is-invalid');
  if (firstInvalidInput) {
    //nếu input là select thì focus vào nó
    if (firstInvalidInput.tagName.toLowerCase() === 'select' && firstInvalidInput.classList.contains('choices__input')) {
      //nếu là choices js
      firstInvalidInput.closest('.choices').focus();
    }
    else {
      firstInvalidInput.focus();
    }
  }
};

//quét qua từng trường trong meta để kiểm tra tính hợp lệ
senapp.utils.validmodel = function ({ model, meta }) {
  const errors = {};
  for (const field of meta) {
    if (field.isnullable === false && !model[field.field]) {
      errors[field.field] = `${field.description} cannot be empty`;
    }
  }
  return errors;
};

senapp.utils.lookup = function (select, options = {}) {
  //phải khai báo choices js trước
  const defaults = {
    itemSelectText: '',     // Hide "Press to select"
    noChoicesText: '',      // Hide "No choices to choose from"
    // removeItemButton: true,
    duplicateItemsAllowed: false,
    searchEnabled: true,
    searchChoices: false,
    // searchFields: ['label', 'value'], // trường để tìm (tùy chọn)
    placeholder: true,
    placeholderValue: 'Press space to search',
    searchPlaceholderValue: 'Press space to search',
    callbackOnInit: function () {
      let container = this.containerOuter.element
      container.addEventListener('focus', () => {
        this.showDropdown();
      }, true); // Use capture phase
    }
  };
  options = Object.assign({}, defaults, options);
  const choice = new Choices(select, options);
  // Sau khi khởi tạo, ép tất cả nút remove không nhận focus
  const container = choice.containerOuter.element.querySelector('.choices__inner');
  container.querySelectorAll('button.choices__button').forEach(btn => { btn.setAttribute('tabindex', '-1'); });
  // xử lý event change của container
  container.addEventListener('change', function (event) { this.querySelectorAll('button.choices__button').forEach(btn => { btn.setAttribute('tabindex', '-1'); }); });
  //bổ sung tính năng phím -> chọn
  choice.input.element.addEventListener('keydown', (e) => {
    if (e.key === "ArrowRight") {
      //lấy item đang được highlight
      const highlighted = choice.dropdown.element.querySelector('.is-highlighted');
      if (highlighted) {
        const value = highlighted.getAttribute('data-value');
        const label = highlighted.getAttribute('data-choice');
        // Trigger chọn item
        choice.setChoiceByValue(value);
        // Gửi sự kiện 'change' lên select gốc (hoặc input nếu dùng)
        const originalElement = choice.passedElement.element;
        const changeEvent = new Event('change', { bubbles: true });
        originalElement.dispatchEvent(changeEvent);

        // Chặn caret nhảy qua phải
        e.preventDefault();
        // e.stopPropagation();
      }
    }
  });

  return choice;
}

senapp.utils.getStepFromDec = function (dec) {
  if (dec === null || dec === undefined) return '1';
  if (!Number.isInteger(dec) || dec < 0) return '1';
  return (1 / Math.pow(10, dec)).toString();
}

//#endregion Input utilities

//#region table
senapp.utils.table = function table(options) {
  //#region initialization
  const defaults = {
    container: null, tableelement: null, urldata: {}, meta: {}, keyfield: null, filter: {},
    searchelement: null, // đối tượng search element nếu có
    addrow: false, // cho phép thêm mới
    editrow: false, // cho phép sửa
    deleterow: false, // cho phép xóa
    readonly: false, // chỉ xem không cho phép thêm sửa xóa
    filterrow: true, // có hiển thị filter row hay không
    filtercompact: true, // có hiển thị filter row ở dạng compact hay không
    selectcolumn: false, // có gen cột chọn hay không
    metacolumns: [], // danh sách các cột trong bảng
    customcolumns: [], // danh sách các cột tùy chỉnh khi render cell
    loadmoreonvisible: true, // khi hiển thị nút load more thì tự động load thêm dữ liệu
    loadmoreshowtoast: false, // khi hiển thị nút load more thì tự động hiển thị toast
    datas: [], // dữ liệu của bảng
    datadeleteds: [], // danh sách các dữ liệu đã xóa
    datanews: [], // danh sách các dữ liệu mới
    datanew: {}, // đối tượng dữ liệu mới
    datasummary: [], // dữ liệu tổng hợp hiển thị ở header, có thể dùng để tính tổng, trung bình,... của các cột
    modal: false, // khi thêm mới hoặc sửa thì có modal hay không
    allowexport2excel: false, //cho phép xuất Excel
    sysnoviewcard: false, // cho phép xem card khi click vào số thứ tự
    deletecallback: null, //hàm callback sau khi xóa
    actionbuttons: {}, //hiển thị các nút hành động
    addnewfirst: true, //thêm mới vào đầu danh sách
    allowsorting: true, //cho phép sắp xếp hay không
    allowloaddataininit: true, //cho phép load dữ liệu khi khởi tạo
    allowformatheader: false, //cho phép định dạng header thông qua customcolumns
    allowsummary: false, //cho phép hiển thị summary ở header (khi select dữ liệu sẽ có thêm trường _summary để tính toán tổng hợp)
    allowpinheader: true, //cho phép cố định header khi cuộn trang
  };
  Object.assign(this, defaults, options);
  //gán default tham số đối tượng nếu thuộc tính không truyền vào
  const _actionbuttons = { edit: true, delete: true, savenews: true, exportexcel: true, viewcard: false, deleteselected: false };
  Object.assign(_actionbuttons, this.actionbuttons);
  this.actionbuttons = _actionbuttons;


  this.tablenavigator = {};//đối tượng điều hướng trang

  //nếu searchelement không được gán thì tìm trong container
  if (!this.searchelement) {
    this.searchelement = this.container.querySelector('.search-input');
  }

  // //nếu meta khác rỗng
  // this.metakey = {}; //meta của trường key
  // if (this.meta && this.meta.length > 0) {
  //   //nếu this.meta không có trường khóa thì tìm trường đầu tiên có key = true
  //   if (!this.keyfield) {
  //     this.keyfield = this.meta.find(m => m.key == true).field;//gán trường khóa để thuận tiện xử lý
  //     if (!this.keyfield) {
  //       this.keyfield = this.meta[0].field; // Gán trường đầu tiên nếu không có trường khóa
  //     }
  //   }
  //   if (this.keyfield) {
  //     this.metakey = this.meta.find(m => m.field === this.keyfield);
  //   }
  //   //trộn các trường meta vào metacolumns nếu có nếu trong metacolumns không có trường nào trùng với meta thì thêm vào
  //   this.meta.forEach(m => {
  //     //nếu metacolumns không có trường nào trùng với meta thì thêm vào
  //     if (!this.metacolumns.some(mc => mc.field === m.field)) {
  //       //nếu không có trường colorder thì gán colorder thứ tự trường trong meta
  //       m.colorder = m.colorder || this.metacolumns.length + 1;
  //       //sao chép m để tránh thay đổi meta gốc
  //       const newField = JSON.parse(JSON.stringify(m));
  //       this.metacolumns.push(newField);
  //     }
  //   });
  // }

  // //gán col sys mặc định cho metacolumns
  // if (this.metacolumns && this.metacolumns.length > 0) {
  //   const sysNoColumnDefault = { field: 'SysNo', title: '#', colorder: -900, visible: true, show: true };
  //   //trường hợp SysNo đã tồn tại thì trộn phần tồn tại đè vào phần mới phía dưới
  //   if (this.metacolumns.some(m => m.field === 'SysNo')) {
  //     //lấy trường SysNo và gán trường chưa có vào
  //     const sysNoColumn = this.metacolumns.find(m => m.field === 'SysNo');
  //     for (const key in sysNoColumnDefault) {
  //       if (!sysNoColumn.hasOwnProperty(key)) {
  //         sysNoColumn[key] = sysNoColumnDefault[key];
  //       }
  //     }
  //   }
  //   else {
  //     //nếu không có trường SysNo thì thêm vào đầu tiên
  //     this.metacolumns.unshift(sysNoColumnDefault);
  //   }

  //   //nếu có cột chọn thì thêm vào đầu tiên
  //   const sysSelectColumnDefault = { field: 'SysSelect', title: '', colorder: -800, visible: this.selectcolumn, show: true };
  //   //trường hợp SysSelect đã tồn tại thì trộn phần tồn tại đè vào
  //   if (this.metacolumns.some(m => m.field === 'SysSelect')) {
  //     //lấy trường SysSelect và gán trường chưa có vào
  //     const sysSelectColumn = this.metacolumns.find(m => m.field === 'SysSelect');
  //     for (const key in sysSelectColumnDefault) {
  //       if (!sysSelectColumn.hasOwnProperty(key)) {
  //         sysSelectColumn[key] = sysSelectColumnDefault[key];
  //       }
  //     }
  //   }
  //   else {
  //     //nếu không có trường SysSelect thì thêm vào đầu tiên
  //     this.metacolumns.unshift(sysSelectColumnDefault);
  //   }

  //   const sysActionColumnDefault = { field: 'SysAction', title: '', colorder: this.metacolumns.length + 1, visible: true, show: true };
  //   //trường hợp SysAction đã tồn tại thì trộn phần tồn tại đè vào
  //   if (this.metacolumns.some(m => m.field === 'SysAction')) {
  //     //lấy trường SysAction và gán trường chưa có vào  
  //     const sysActionColumn = this.metacolumns.find(m => m.field === 'SysAction');
  //     for (const key in sysActionColumnDefault) {
  //       if (!sysActionColumn.hasOwnProperty(key)) {
  //         sysActionColumn[key] = sysActionColumnDefault[key];
  //       }
  //     }
  //   }
  //   else {
  //     //nếu không có trường SysAction thì thêm vào cuối cùng
  //     this.metacolumns.push(sysActionColumnDefault);
  //   }
  // }

  // //lưu lại metacolumns gốc để sử dụng khi reset cột
  // this.metacolumnsoriginal = JSON.parse(JSON.stringify(this.metacolumns));

  // //sắp xếp lại thứ tự cột
  // this.metacolumns.sort((a, b) => a.colorder - b.colorder);

  //tạo đối tượng quan sát
  this.observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.click();//
      }
    });
  });

  this.reloaddata = false;
  //this.datadeleteds = []; //danh sách các dữ liệu đã xóa
  //this.datanews = []; //danh sách các dữ liệu mới
  //this.datanew = {};//đối tượng dữ liệu mới

  this.initTable = async function () {
    const tableobject = this;

    //nếu meta khác rỗng
    this.metakey = {}; //meta của trường key
    if (this.meta && this.meta.length > 0) {
      //nếu this.meta không có trường khóa thì tìm trường đầu tiên có key = true
      if (!this.keyfield) {
        this.keyfield = this.meta.find(m => m.key == true).field;//gán trường khóa để thuận tiện xử lý
        if (!this.keyfield) {
          this.keyfield = this.meta[0].field; // Gán trường đầu tiên nếu không có trường khóa
        }
      }
      if (this.keyfield) {
        this.metakey = this.meta.find(m => m.field === this.keyfield);
      }
      //trộn các trường meta vào metacolumns nếu có nếu trong metacolumns không có trường nào trùng với meta thì thêm vào
      this.meta.forEach(m => {
        //nếu metacolumns không có trường nào trùng với meta thì thêm vào
        if (!this.metacolumns.some(mc => mc.field === m.field)) {
          //nếu không có trường colorder thì gán colorder thứ tự trường trong meta
          m.colorder = m.colorder || this.metacolumns.length + 1;
          //sao chép m để tránh thay đổi meta gốc
          const newField = JSON.parse(JSON.stringify(m));
          this.metacolumns.push(newField);
        }
      });
    }

    //gán col sys mặc định cho metacolumns
    if (this.metacolumns && this.metacolumns.length > 0) {
      const sysNoColumnDefault = { field: 'SysNo', title: '#', colorder: -900, visible: true, show: true };
      //trường hợp SysNo đã tồn tại thì trộn phần tồn tại đè vào phần mới phía dưới
      if (this.metacolumns.some(m => m.field === 'SysNo')) {
        //lấy trường SysNo và gán trường chưa có vào
        const sysNoColumn = this.metacolumns.find(m => m.field === 'SysNo');
        for (const key in sysNoColumnDefault) {
          if (!sysNoColumn.hasOwnProperty(key)) {
            sysNoColumn[key] = sysNoColumnDefault[key];
          }
        }
      }
      else {
        //nếu không có trường SysNo thì thêm vào đầu tiên
        this.metacolumns.unshift(sysNoColumnDefault);
      }

      //nếu có cột chọn thì thêm vào đầu tiên
      const sysSelectColumnDefault = { field: 'SysSelect', title: '', colorder: -800, visible: this.selectcolumn, show: true };
      //trường hợp SysSelect đã tồn tại thì trộn phần tồn tại đè vào
      if (this.metacolumns.some(m => m.field === 'SysSelect')) {
        //lấy trường SysSelect và gán trường chưa có vào
        const sysSelectColumn = this.metacolumns.find(m => m.field === 'SysSelect');
        for (const key in sysSelectColumnDefault) {
          if (!sysSelectColumn.hasOwnProperty(key)) {
            sysSelectColumn[key] = sysSelectColumnDefault[key];
          }
        }
      }
      else {
        //nếu không có trường SysSelect thì thêm vào đầu tiên
        this.metacolumns.unshift(sysSelectColumnDefault);
      }

      const sysActionColumnDefault = { field: 'SysAction', title: '', colorder: this.metacolumns.length + 1, visible: true, show: true };
      //trường hợp SysAction đã tồn tại thì trộn phần tồn tại đè vào
      if (this.metacolumns.some(m => m.field === 'SysAction')) {
        //lấy trường SysAction và gán trường chưa có vào  
        const sysActionColumn = this.metacolumns.find(m => m.field === 'SysAction');
        for (const key in sysActionColumnDefault) {
          if (!sysActionColumn.hasOwnProperty(key)) {
            sysActionColumn[key] = sysActionColumnDefault[key];
          }
        }
      }
      else {
        //nếu không có trường SysAction thì thêm vào cuối cùng
        this.metacolumns.push(sysActionColumnDefault);
      }
    }

    //lưu lại metacolumns gốc để sử dụng khi reset cột
    this.metacolumnsoriginal = JSON.parse(JSON.stringify(this.metacolumns));


    //lấy meta từ idb nếu có
    if (!senapp.data.idb.uistore) {
      // senapp.window.alert({message: 'có phiên bản mới. vui lòng đóng trình duyệt và mở lại để cập nhật'});
      senapp.window.alert({ message: 'A new version is available. Please close your browser and reopen it to update.' });
      return;
    }
    const metacolumnsuser = await senapp.data.idb.uistore.getItem(this.container.id);
    if (metacolumnsuser && metacolumnsuser.metacolumns) {
      const keys = ['show', 'gridwidth', 'colorder'];
      //duyệt qua từng cột trong metacolumnsuser để gán lại các thuộc tính đã lưu
      metacolumnsuser.metacolumns.forEach(mcu => {
        const column = this.metacolumns.find(m => m.field === mcu.field);
        if (column) {
          //chỉ gán các thuộc tính trong keys để tránh ghi đè các thuộc tính khác
          keys.forEach(key => {
            if (mcu.hasOwnProperty(key) && (column.hasOwnProperty(key) || key === 'gridwidth')) { column[key] = mcu[key]; }
          });
        }
      });
    }

    //sắp xếp lại thứ tự cột
    this.metacolumns.sort((a, b) => a.colorder - b.colorder);
    //lưu lại metacolumns gốc để sử dụng khi reset cột
    this.metacolumnsoriginal = JSON.parse(JSON.stringify(this.metacolumns));

    if (!this.tableelement) {
      this.tableelement = this.container.querySelector('table');
      if (!this.tableelement) {
        console.error('Table element is not defined');
        return;
      }
    }
    if (this.searchelement) {
      //nếu có searchelement thì gán sự kiện keyup cho nó      
      this.searchelement.addEventListener('change', function () {
        tableobject.changeRowFilter({ meta: tableobject.meta, condition: { field: 'searchTerm', op: 'includes', value: this.value.trim() } });
      });
    }

    //#region khởi tạo cấu trúc tổng quát table
    //nội dung trong table
    this.tableelement.innerHTML = '';
    //tạo theader
    const thead = document.createElement('thead');
    this.tableelement.appendChild(thead);
    //tạo tbody new-datas
    const newdatasTbody = document.createElement('tbody');
    newdatasTbody.classList.add('row-new-datas');
    newdatasTbody.innerHTML = '<tr></tr>';//không có tr thì tbody bên dưới không format css được(sẽ nghiên cứu sau. trong bootstrap thuần túy thì được)    
    this.tableelement.appendChild(newdatasTbody);


    //tạo tbody datas
    const datasTbody = document.createElement('tbody');
    datasTbody.classList.add('row-datas');
    this.tableelement.appendChild(datasTbody);
    //#endregion
    this.initUtils();//gọi khởi tạo các tiện ích
    this.genRowHeader(); // Gọi hàm genRowHeader để tạo header row
    this.mapSortLabelToRowHeader(); // Gọi hàm mapSortLabelToRowHeader để cập nhật biểu tượng sort
    this.initColumnsResizable(); // Gọi hàm initColumnsResizable để khởi tạo khả năng kéo thả cột
    this.initColumnsReorder(); // Gọi hàm initColumnsReorder để khởi tạo khả năng sắp xếp cột

    this.genRowFilter(); // Gọi hàm genRowFilter để tạo hàng filter

    this.genRowSummary(); // Gọi hàm genRowSummary để tạo hàng tổng hợp

    //this.genRowUpdate(); // Gọi hàm genRowUpdate để tạo hàng update
    this.genRowAdd(); // Gọi hàm genRowAdd để tạo hàng add

    //this.clearRowNewData(); // Xóa dữ liệu mới trong tbody trước khi tải lại
    this.loadNewData(); // Gen lại row new data
    this.initRowNewDragDrop();//kéo thả thay đổi vị trí các dòng thêm mới

    this.clearRowData(); // Xóa dữ liệu trong tbody trước khi tải lại
    if (this.allowloaddataininit)
      await this.loadData(); // Gọi hàm loadData để tải dữ liệu


    //khởi tạo lại label nếu có thay đổi ngôn ngữ
    await senapp.utils.text.initLocaleLabels({ container: this.container });
    //định dạng header
    this.formatHeader();
    //cố định header nếu cuộn trang
    this.pinHeader();
  };
  //#endregion

  //#region methods
  this.create = function (el) {
    if (this.modal) {
      senapp.window.modal({ url: `${this.urldata.create}` })
    }
    else {
      $(this.container).load(`${this.urldata.create}`);
    }
  };

  this.edit = function (el) {
    const id = $(el).attr('data-id');
    if (!id) {
      senapp.window.alert(`${this.meta.find(m => m.field === this.keyfield).description || this.keyfield} is required`);
      return;
    }
    // nếu this.urldata.edit có chứa tham số thì thêm vào 
    let urledit = this.urldata.edit;
    if (this.urldata.edit.includes('?')) {
      urledit += `&${this.keyfield}=${encodeURIComponent(id)}`;

    } else {
      urledit += `?${this.keyfield}=${encodeURIComponent(id)}`;
    }
    if (this.modal) {
      senapp.window.modal({ url: urledit })
    }
    else {
      $(this.container).load(`${urledit}`);
    }
  };

  this.updateparaext = function (data) {
    //dùng cho override
    return ``;
  }

  this.updatepara = function (data) {
    return `${this.updateparaext(data)}`;
  }

  this.update = function (row) {

    const tableobject = this;
    const id = $(row).attr('data-id');
    // Trả về Promise để bên ngoài có thể await
    return new Promise((resolve, reject) => {
      if (!id) {
        senapp.window.alert(`${tableobject.meta.find(m => m.field === tableobject.keyfield).description || tableobject.keyfield} is required`);
        return resolve(response);
      }
      const updateData = tableobject.datas.find(d => d[tableobject.keyfield] == id);
      $.post(`${tableobject.urldata.update}${tableobject.updatepara(updateData)}`, updateData, function (response) {
        if (response.status == 'false' || response.status == 0) {
          senapp.window.toast({ message: response.message, type: 'danger' });
          // console.error(response);
          const row = tableobject.getRowByKey(updateData[tableobject.keyfield]);
          if (row) { tableobject.clearErrorsRow({ row: row }); }
          if (row) { tableobject.mapErrorsRow({ row: row, errors: response.errors, message: response.message }); }

        } else {
          senapp.window.toast({ message: response.message, type: 'success' });
          //cập nhật lại giao diện
          tableobject.onChangeRowData({ data: updateData });
        }
        resolve(response);
      }).fail(function (xhr, status, error) {
        reject(new Error(error || status));
      });
    });
  };

  this.updateByKey = function (key) {
    const row = this.getRowByKey(key);
    if (!row) {
      senapp.window.alert(`Không tìm thấy hàng có key="${key}"`);
      return Promise.resolve();
    }
    return this.update(row); // Trả Promise luôn
  };

  this.deleteparaext = function (data) {
    //dùng cho override
    return ``;
  }

  this.deletepara = function (data) {
    return `/${encodeURIComponent(data[this.keyfield])}${this.deleteparaext(data)}`;
  }

  this.delete = async function (row) {
    if (!this.deleterow || this.readonly) {
      //senapp.window.toast({ message: 'Bạn không có quyền xóa dòng này', type: 'danger' });
      senapp.window.toast({ message: 'You do not have permission to delete this row', type: 'danger' });
      return;
    }

    const tableobject = this;
    const id = $(row).attr('data-id');
    const deletedData = tableobject.datas.find(d => d[tableobject.keyfield] == id);
    const response = await this.synData({ data: deletedData, type: 'delete' });
    if (response.status == 'false' || response.status == 0) {
      senapp.window.toast({ message: response.message, type: 'danger' });
    } else {
      senapp.window.toast({ message: response.message, type: 'success' });
      // Xóa row khỏi DOM
      $(row).remove();
      // Cập nhật lại số thứ tự
      tableobject.resetSysNo();
      // Lưu vào danh sách deleted
      if (deletedData) {
        tableobject.datadeleteds.push(deletedData);
        // Xóa khỏi mảng datas
        tableobject.datas.splice(tableobject.datas.indexOf(deletedData), 1);
      }
    }
    //gọi hàm callback nếu có
    if (this.deletecallback && typeof this.deletecallback === 'function') {
      await this.deletecallback({ response, data: deletedData, row });
    }

    // const tableobject = this;
    // const id = $(row).attr('data-id');
    // // Trả về Promise để bên ngoài có thể await
    // return new Promise((resolve, reject) => {
    //   if (!id) {
    //     senapp.window.alert(`${tableobject.meta.find(m => m.field === tableobject.keyfield).description || tableobject.keyfield} is required`);
    //     return resolve(response);
    //   }
    //   const deletedData = tableobject.datas.find(d => d[tableobject.keyfield] == id);
    //   $.post(`${tableobject.urldata.delete}${tableobject.deletepara(deletedData)}`, function (response) {
    //     if (response.status == 0) {
    //       senapp.window.toast({ message: response.message, type: 'danger' });
    //     } else {
    //       senapp.window.toast({ message: response.message, type: 'success' });
    //       // Xóa row khỏi DOM
    //       $(row).remove();
    //       // Cập nhật lại số thứ tự
    //       tableobject.resetSysNo();
    //       // Lưu vào danh sách deleted
    //       if (deletedData) {
    //         tableobject.datadeleteds.push(deletedData);
    //         // Xóa khỏi mảng datas
    //         tableobject.datas.splice(tableobject.datas.indexOf(deletedData), 1);
    //       }
    //     }
    //     resolve(response);
    //   }).fail(function (xhr, status, error) {
    //     reject(new Error(error || status));
    //   });
    // });
  };

  this.deleteByKey = async function (key) {
    const row = this.getRowByKey(key);
    // if (!row) {
    //   senapp.window.alert(`Không tìm thấy hàng có key="${key}"`);
    //   return Promise.resolve();
    // }
    return await this.delete(row); // Trả Promise luôn
  };

  this.deleteBySelected = async function () {
    const tableobject = this;
    const selectedKeys = this.getKeySelected();

    if (selectedKeys.length === 0) {
      senapp.window.alert({ message: `⚠️ ${await senapp.utils.text.t('Please select at least one row to delete.')}`, type: 'danger' });
      return;
    }

    if (senapp.window.confirm({ message: `⚠️ ${await senapp.utils.text.t('Are you sure you want to delete the selected rows?')}` })) {
      senapp.window.loading.show();
      const promises = selectedKeys.map(id => tableobject.deleteByKey(id));
      try {
        await Promise.all(promises);
        senapp.window.loading.hide();
        console.log("Tất cả đã xóa xong!");
      } catch (err) {
        senapp.window.alert({ message: `⚠️ ${await senapp.utils.text.t('Có lỗi khi xóa:')}`, type: 'danger' });
        console.error("Có lỗi khi xóa:", err);
      }
    }
  }

  this.newDelete = function (row) {
    if (row) {
      const tableobject = this;
      const id = tableobject.parseValueKey(row.getAttribute('data-id'));
      const deletedData = tableobject.datanews.find(d => d[tableobject.keyfield] == id);
      //nếu deletedData tồn tại thì xóa trong datanews
      if (deletedData) {
        //lưu vào danh sách deleted dùng để kiểm tra khi lưu (đặt biệt là dùng cho master-detail)
        tableobject.datadeleteds.push(deletedData);
        tableobject.datanews.splice(tableobject.datanews.indexOf(deletedData), 1);
      }
      row.remove();
      tableobject.resetNewSysNo();
    }
  };

  this.newDeleteByKey = function (key) {
    return this.newDelete(this.getRowNewByKey(key));
  };

  this.validateServer = async function ({ data, type, maperrors = true }) {
    //kiểm tra dữ liệu hợp lệ từ server trước khi lưu
    const tableobject = this;
    const response = await this.synData({ data: data, type: type, mode: 'validate' });
    if (maperrors == true) {
      const row = tableobject.getRowNewByKey(data[tableobject.keyfield]);
      if (row) { tableobject.clearErrorsRow({ row: row }); }
      if (response.status == 'false' || response.status == 0) {
        // senapp.window.toast({ message: response.message, type: 'danger' });
        //xóa class cell-danger trong từng td
        if (row) { tableobject.mapErrorsRow({ row: row, errors: response.errors, message: response.message }); }
      }
    }

    return response;
  }

  this.saveNew = async function (data) {
    if (!this.addrow || this.readonly) {
      senapp.window.toast({ message: 'You do not have permission to add new rows', type: 'danger' });
      return;
    }
    const tableobject = this;
    const response = await this.synData({ data: data });
    if (response.status == 'false' || response.status == 0) {
      senapp.window.toast({ message: response.message, type: 'danger' });
      const row = tableobject.getRowNewByKey(data[tableobject.keyfield]);
      //xóa class cell-danger trong từng td
      if (row) {
        tableobject.clearErrorsRow({ row: row })
        tableobject.mapErrorsRow({ row: row, errors: response.errors, message: response.message });
      }
    } else {
      senapp.window.toast({ message: response.message, type: 'success' });
      //xóa dòng hiện hành 
      tableobject.newDeleteByKey(data[tableobject.keyfield]);
      //thêm dòng mới
      tableobject.onAddRowData({ data: response.data });
    }
  };

  this.saveNews = async function () {
    const tableobject = this;
    senapp.window.loading.show();
    // const promises = tableobject.datanews.map(async data => await tableobject.saveNew(data));
    try {
      // await Promise.all(promises);
      await Promise.all(tableobject.datanews.map(data => tableobject.saveNew(data)));
      // senapp.window.loading.hide();
      console.log("Tất cả đã lưu xong!");
    } catch (err) {
      senapp.window.alert({ message: `⚠️ ${await senapp.utils.text.t('Có lỗi khi lưu:')}`, type: 'danger' });
      console.error("Có lỗi khi lưu:", err);
    } finally {
      senapp.window.loading.hide();
    }
  }

  //#endregion
  //#region header

  //lưu trạng thái ui của bảng vào iDB
  this.saveUIState = async function () {
    const metacolumns = JSON.parse(JSON.stringify(this.metacolumns));
    let value = await senapp.data.idb.uistore.getItem(this.container.id);
    // Nếu đã có giá trị thì gán lại
    if (value) {
      value.metacolumns = metacolumns;
    } else {
      value = { metacolumns: metacolumns };
    }
    await senapp.data.idb.uistore.setItem({ key: this.container.id, value: value });
  };

  //hàm sẩn hiện cột trong bảng
  this.toggleColumn = async function (field, visible) {

    //chỉ lấy th trực tiếp trong thead tránh lấy nhầm th trong tbody
    const ths = this.tableelement.querySelectorAll(':scope > thead > tr > th');
    let columnIndex = -1;

    ths.forEach((th, index) => {
      if (th.dataset.field === field) {
        columnIndex = index;
      }
    });

    if (columnIndex === -1) {
      console.warn(`Không tìm thấy cột có data-field="${field}"`);
      return;
    }

    // Lấy trạng thái hiện tại nếu visible không được truyền
    const th = ths[columnIndex];
    const isCurrentlyHidden = th.classList.contains('d-none');
    const shouldShow = (typeof visible === 'boolean') ? visible : isCurrentlyHidden;

    // Toggle class d-none trên td của thead
    th.classList.toggle('d-none', !shouldShow);

    // Toggle class d-none trên từng td
    const thRows = this.tableelement.querySelectorAll(':scope > thead > tr');
    thRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells[columnIndex]) {
        cells[columnIndex].classList.toggle('d-none', !shouldShow);
      }
    });

    // Toggle class d-none trên từng td
    const rows = this.tableelement.querySelectorAll(':scope > tbody > tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells[columnIndex]) {
        cells[columnIndex].classList.toggle('d-none', !shouldShow);
      }
    });

    const metaField = this.metacolumns.find(m => m.field === field);
    if (metaField) {
      metaField.show = shouldShow;
      this.saveUIState(); // Lưu trạng thái UI mỗi khi thay đổi
      // //lưu trạng thái vào iDB
      // const metacolumns = JSON.parse(JSON.stringify(this.metacolumns));
      // let value = await senapp.data.idb.uistore.getItem(this.container.id);
      // if (value) {
      //   value.metacolumns = metacolumns;
      // }
      // else {
      //   value = { metacolumns: metacolumns };
      // }
      // await senapp.data.idb.uistore.setItem({ key: this.container.id, value: value });
    }

  }
  //hiển thị cấu hình cột trong bảng
  this.configColumn = function () {
    const tableobject = this;
    const listGroup = document.createElement('div');
    listGroup.className = 'list-group';

    const btnRestore = document.createElement('a');
    btnRestore.href = 'javascript:void(0);';
    btnRestore.innerHTML = `<i class="fa fa-refresh" aria-hidden="true"></i> <span class="">Restore default</span>`;
    btnRestore.className = 'btn m-0 p-0';
    const btnRestoreLabel = document.createElement('label');
    btnRestoreLabel.className = 'list-group-item d-flex align-items-center gap-2 fw-bold text-primary';
    btnRestoreLabel.appendChild(btnRestore);
    listGroup.appendChild(btnRestoreLabel);
    btnRestore.addEventListener('click', () => {
      // Khôi phục trạng thái mặc định của các cột
      tableobject.metacolumns = JSON.parse(JSON.stringify(tableobject.metacolumnsoriginal));
      checkboxList.forEach(cb => {
        const field = cb.value;
        const metaField = tableobject.meta.find(m => m.field === field);
        if (metaField) {
          cb.checked = metaField.show !== false; // Nếu show là false thì bỏ chọn, ngược lại thì chọn
          tableobject.toggleColumn(field, cb.checked);
        }
      })
    });

    // Checkbox "Chọn tất cả"
    const checkAllLabel = document.createElement('label');
    checkAllLabel.className = 'list-group-item d-flex align-items-center gap-2 fw-bold text-primary';

    const checkAllBox = document.createElement('input');
    checkAllBox.type = 'checkbox';
    checkAllBox.className = 'form-check-input me-1';

    checkAllLabel.appendChild(checkAllBox);
    checkAllLabel.appendChild(document.createTextNode('All'));
    listGroup.appendChild(checkAllLabel);

    // Danh sách các checkbox
    const checkboxList = [];
    //danh sách loại bỏ chọn các cột
    const excludeFields = ['SysNo', 'SysSelect', 'SysAction']; // Các trường không cần hiển thị trong cấu hình cột

    tableobject.metacolumns.filter(item => !excludeFields.includes(item.field) && item.visible == true).forEach(item => {
      const label = document.createElement('label');
      label.className = 'list-group-item d-flex align-items-center gap-2';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-check-input me-1 field-checkbox';
      checkbox.name = 'fieldOptions';
      checkbox.value = item.field;
      checkbox.checked = item.show !== false; // Nếu show là false thì bỏ chọn, ngược lại thì chọn

      checkboxList.push(checkbox);
      label.appendChild(checkbox);
      const description = document.createElement('span');
      description.innerHTML = item.description || item.field;
      //tô đậm nếu là trường bắt buộc nhập 
      if (item.isnullable === false) {
        //dùng class fw-bold
        description.classList.add('fw-bold');
      }

      label.appendChild(description);

      checkbox.addEventListener('change', function () {
        tableobject.toggleColumn(item.field, this.checked);
      });

      listGroup.appendChild(label);
    });

    //nếu tất cả checkbox đều được chọn thì đánh dấu checkAllBox là checked
    const allChecked = checkboxList.every(cb => cb.checked);
    checkAllBox.checked = allChecked;

    // Sự kiện chọn tất cả / bỏ chọn tất cả
    checkAllBox.addEventListener('change', () => {
      const checked = checkAllBox.checked;
      //thay đổi trạng thái của tất cả checkbox và trigger sự kiện change
      checkboxList.forEach(cb => {
        cb.checked = checked;
        cb.dispatchEvent(new Event('change'));
      });
    });

    // Cập nhật lại trạng thái "check all" nếu có checkbox bị thay đổi riêng lẻ
    checkboxList.forEach(cb => {
      cb.addEventListener('change', () => {
        const allChecked = checkboxList.every(x => x.checked);
        checkAllBox.checked = allChecked;
      });
    });
    senapp.window.offcanvas({ contentel: listGroup });
  };

  this.initColumnsResizable = function () {
    const tableobject = this;
    const ths = tableobject.tableelement.querySelectorAll("th.resizable");
    ths.forEach(th => {
      const resizer = document.createElement("div");
      resizer.className = "resizer";
      th.appendChild(resizer);
      let startX, startWidth;
      resizer.addEventListener("mousedown", function (e) {
        startX = e.pageX;
        startWidth = th.offsetWidth;

        function onMouseMove(e) {
          const newWidth = startWidth + (e.pageX - startX);
          th.style.width = newWidth + "px";
          th.style.minWidth = newWidth + "px";
          // const index = Array.from(th.parentNode.children).indexOf(th);
          // tableobject.tableelement.querySelectorAll("tbody tr").forEach(tr => {
          //   const td = tr.children[index];
          //   if (td) td.style.width = newWidth + "px";
          // });
        }

        function onMouseUp() {
          tableobject.tableelement.removeEventListener("mousemove", onMouseMove);
          tableobject.tableelement.removeEventListener("mouseup", onMouseUp);
          //nếu có thay đổi độ rộng thì lưu lại
          if (th.offsetWidth !== startWidth) {
            const field = th.dataset.field;
            const column = tableobject.metacolumns.find(c => c.field === field);
            column.gridwidth = th.offsetWidth;
            tableobject.saveUIState();
          }
        }

        tableobject.tableelement.addEventListener("mousemove", onMouseMove);
        tableobject.tableelement.addEventListener("mouseup", onMouseUp);
      });
    });
  }

  this.initColumnsReorder20260107 = function () {
    const tableobject = this;
    const theadRow = tableobject.tableelement.querySelector("thead>tr.row-header");

    // ====== Column Reorder (drag & drop) ======
    let dragState = null;

    function createDropIndicator() {
      const d = document.createElement('div');
      d.className = 'drop-indicator';
      return d;
    }

    function onDragStart(e) {
      const th = e.currentTarget;
      if (e.target.closest('[data-resize]')) return;

      dragState = {
        startIdx: th.cellIndex,
        th,
        indicator: createDropIndicator(),
        currentTarget: null,
        startX: e.clientX,   // lưu vị trí ban đầu
        startY: e.clientY,
        dragging: false      // flag chưa kéo
      };

      document.addEventListener('mousemove', onDragging);
      document.addEventListener('mouseup', onDragEnd);
    }

    function getTargetIndexFromX(x) {
      const ths = Array.from(theadRow.children);
      for (let i = 0; i < ths.length; i++) {
        const rect = ths[i].getBoundingClientRect();
        //if (x < rect.left + rect.width / 2) { return i; }
        if (x < rect.left + rect.width) { return i; }
      }
      return ths.length;
    }

    function onDragging(e) {
      if (!dragState) return;

      // nếu chưa set dragging, kiểm tra ngưỡng di chuyển
      if (!dragState.dragging) {
        const dx = Math.abs(e.clientX - dragState.startX);
        const dy = Math.abs(e.clientY - dragState.startY);
        if (dx < 5 && dy < 5) return; // chưa đủ xa → coi như click, không drag
        dragState.dragging = true;

        // chỉ khi thật sự drag thì mới thêm style/indicator
        dragState.th.classList.add('th-dragging');
        dragState.th.appendChild(dragState.indicator);
      }

      const targetIdx = getTargetIndexFromX(e.clientX);
      const ths = Array.from(theadRow.children);
      const ref = ths[Math.min(targetIdx, ths.length - 1)];

      // Highlight target column
      if (dragState.currentTarget && dragState.currentTarget !== ref) {
        dragState.currentTarget.classList.remove('drop-target-highlight');
      }
      if (ref && ref !== dragState.th) {
        ref.classList.add('drop-target-highlight');
        dragState.currentTarget = ref;
      }

      const rect = ref.getBoundingClientRect();
      const left = targetIdx === ths.length
        ? (rect.right - theadRow.getBoundingClientRect().left)
        : (rect.left - theadRow.getBoundingClientRect().left);
      Object.assign(dragState.indicator.style, { display: 'block', left: left + 'px' });
    }

    function onDragEnd(e) {
      if (!dragState) return;

      const { th, startIdx } = dragState;
      if (dragState.dragging) { // chỉ xử lý reorder nếu thực sự drag
        th.classList.remove('th-dragging');
        dragState.indicator.remove();
        if (dragState.currentTarget) { dragState.currentTarget.classList.remove('drop-target-highlight'); }

        const toIdx = getTargetIndexFromX(e.clientX);
        if (toIdx !== startIdx && (startIdx !== (toIdx - 1))) {
          theadRow.insertBefore(th, theadRow.children[toIdx] || null);

          const theadFilter = tableobject.tableelement.querySelector("thead>tr.row-filter");
          const theadAdd = tableobject.tableelement.querySelector("thead>tr.row-add");
          const tbodys = tableobject.tableelement.querySelectorAll("tbody");
          // filter row
          if (theadFilter) {
            const tdFilter = theadFilter.children[startIdx];
            if (tdFilter) {
              theadFilter.insertBefore(tdFilter, theadFilter.children[toIdx] || null);
            }
          }
          // add row
          if (theadAdd) {
            const tdAdd = theadAdd.children[startIdx];
            if (tdAdd) {
              theadAdd.insertBefore(tdAdd, theadAdd.children[toIdx] || null);
            }
          }

          // tbody
          Array.from(tbodys).forEach(tbody => {
            Array.from(tbody.rows).forEach(tr => {
              const td = tr.children[startIdx];
              if (td) {
                tr.insertBefore(td, tr.children[toIdx] || null);
              }
            });
          });

          const order = Array.from(theadRow.children).map(h => h.dataset['field']);
          tableobject.metacolumns = tableobject.metacolumns.map(col => {
            const newIndex = order.indexOf(col.field);
            if (newIndex !== -1) col.colorder = newIndex;
            return col;
          });
          tableobject.metacolumns.sort((a, b) => a.colorder - b.colorder);
          tableobject.saveUIState(); // Lưu trạng thái UI mỗi khi thay đổi
        }
      }

      document.removeEventListener('mousemove', onDragging);
      document.removeEventListener('mouseup', onDragEnd);
      dragState = null;
    }

    Array.from(theadRow.children).forEach(th => {
      th.addEventListener('mousedown', onDragStart);
    });

  }

  this.initColumnsReorder = function () {
    const tableobject = this;
    const theadRow = tableobject.tableelement.querySelector(":scope > thead>tr.row-header");

    // ====== Column Reorder (drag & drop) ======
    let dragState = null;

    function createDropIndicator() {
      const d = document.createElement('div');
      d.className = 'drop-indicator';
      return d;
    }

    function onDragStart(e) {
      const th = e.currentTarget;
      if (e.target.closest('[data-resize]')) return;
      //nếu th không chứa resizable thì không cho kéo
      if (!th.classList.contains('resizable')) return;

      dragState = {
        startIdx: th.cellIndex,
        th,
        indicator: createDropIndicator(),
        currentTarget: null,
        startX: e.clientX,   // lưu vị trí ban đầu
        startY: e.clientY,
        dragging: false      // flag chưa kéo
      };

      document.addEventListener('mousemove', onDragging);
      document.addEventListener('mouseup', onDragEnd);
    }

    function getTargetIndexFromX(x) {
      const ths = Array.from(theadRow.children);

      for (let i = 0; i < ths.length; i++) {
        const rect = ths[i].getBoundingClientRect();
        if (x < rect.left + rect.width) {
          // **BỎ QUA NẾU MỤC TIÊU LÀ CỘT ĐẦU TIÊN HOẶC CỘT CUỐI CÙNG**
          if (i === 0 || i === ths.length - 1) {
            return dragState.startIdx; // Trả về vị trí ban đầu (không di chuyển)
          }
          return i;
        }
      }
      // Nếu kéo ra ngoài bảng, kiểm tra có phải vị trí cuối không
      const lastIdx = ths.length - 1;
      return dragState.startIdx; // Trả về vị trí ban đầu (không cho thả vào cuối)

      // const ths = Array.from(theadRow.children);
      // for (let i = 0; i < ths.length; i++) {
      //   const rect = ths[i].getBoundingClientRect();
      //   //if (x < rect.left + rect.width / 2) { return i; }
      //   if (x < rect.left + rect.width) { return i; }
      // }
      // return ths.length;
    }

    function onDragging(e) {
      if (!dragState) return;

      // nếu chưa set dragging, kiểm tra ngưỡng di chuyển
      if (!dragState.dragging) {
        const dx = Math.abs(e.clientX - dragState.startX);
        const dy = Math.abs(e.clientY - dragState.startY);
        if (dx < 5 && dy < 5) return; // chưa đủ xa → coi như click, không drag
        dragState.dragging = true;

        // chỉ khi thật sự drag thì mới thêm style/indicator
        dragState.th.classList.add('th-dragging');
        dragState.th.appendChild(dragState.indicator);
      }

      const targetIdx = getTargetIndexFromX(e.clientX);// Lấy chỉ số cột mục tiêu
      const ths = Array.from(theadRow.children);// Lấy tất cả các th trong hàng tiêu đề
      const ref = ths[Math.min(targetIdx, ths.length - 1)];// Phần tử tham chiếu để hiển thị chỉ báo

      // Highlight target column
      if (dragState.currentTarget && dragState.currentTarget !== ref) {
        dragState.currentTarget.classList.remove('drop-target-highlight');
      }
      if (ref && ref !== dragState.th) {
        ref.classList.add('drop-target-highlight');
        dragState.currentTarget = ref;
      }

      const rect = ref.getBoundingClientRect();
      const left = targetIdx === ths.length
        ? (rect.right - theadRow.getBoundingClientRect().left)
        : (rect.left - theadRow.getBoundingClientRect().left);
      Object.assign(dragState.indicator.style, { display: 'block', left: left + 'px' });
    }

    function onDragEnd(e) {
      if (!dragState) return;

      const { th, startIdx } = dragState;
      if (dragState.dragging) { // chỉ xử lý reorder nếu thực sự drag
        th.classList.remove('th-dragging');
        dragState.indicator.remove();
        if (dragState.currentTarget) { dragState.currentTarget.classList.remove('drop-target-highlight'); }

        const toIdx = getTargetIndexFromX(e.clientX);
        if (toIdx !== startIdx && (startIdx !== (toIdx - 1))) {
          theadRow.insertBefore(th, theadRow.children[toIdx] || null);

          const theadFilter = tableobject.tableelement.querySelector(":scope > thead>tr.row-filter");
          const theadSummary = tableobject.tableelement.querySelector(":scope > thead>tr.row-summary");
          const theadAdd = tableobject.tableelement.querySelector(":scope > thead>tr.row-add");
          const tbodys = tableobject.tableelement.querySelectorAll(":scope > tbody");
          // filter row
          if (theadFilter) {
            const tdFilter = theadFilter.children[startIdx];
            if (tdFilter) {
              theadFilter.insertBefore(tdFilter, theadFilter.children[toIdx] || null);
            }
          }
          // summary row
          if (theadSummary) {
            const tdSummary = theadSummary.children[startIdx];
            if (tdSummary) {
              theadSummary.insertBefore(tdSummary, theadSummary.children[toIdx] || null);
            }
          }
          // add row
          if (theadAdd) {
            const tdAdd = theadAdd.children[startIdx];
            if (tdAdd) {
              theadAdd.insertBefore(tdAdd, theadAdd.children[toIdx] || null);
            }
          }

          // tbody
          Array.from(tbodys).forEach(tbody => {
            Array.from(tbody.rows).forEach(tr => {
              const td = tr.children[startIdx];
              if (td) {
                tr.insertBefore(td, tr.children[toIdx] || null);
              }
            });
          });

          const order = Array.from(theadRow.children).map(h => h.dataset['field']);
          tableobject.metacolumns = tableobject.metacolumns.map(col => {
            const newIndex = order.indexOf(col.field);
            if (newIndex !== -1) col.colorder = newIndex;
            return col;
          });
          tableobject.metacolumns.sort((a, b) => a.colorder - b.colorder);
          tableobject.saveUIState(); // Lưu trạng thái UI mỗi khi thay đổi
        }
      }

      document.removeEventListener('mousemove', onDragging);
      document.removeEventListener('mouseup', onDragEnd);
      dragState = null;
    }

    Array.from(theadRow.children).forEach(th => {
      th.addEventListener('mousedown', onDragStart);
    });

  }


  this.genCellHeaderNoExt = function () {
    const tableobject = this;
    const dropdown = document.createElement('span');
    dropdown.className = 'pe-1';
    dropdown.innerHTML = `
            <a href="#" data-bs-toggle="dropdown"><i class="fa-solid fa-ellipsis-vertical"></i></a>
            <div class="dropdown-menu" style=""></div>
          `;
    if (this.allowexport2excel && this.actionbuttons.exportexcel === true) {
      const exportItem = document.createElement('a');
      exportItem.className = 'dropdown-item';
      exportItem.onclick = function () { tableobject.export2Excel(); };
      exportItem.innerHTML = 'Export to Excel';
      //append vào dropdown-menu
      dropdown.querySelector('.dropdown-menu').appendChild(exportItem);
    }
    if (this.actionbuttons.viewcard === true) {
      const viewCardItem = document.createElement('a');
      viewCardItem.className = 'dropdown-item';
      viewCardItem.onclick = function () { tableobject.cardview(); };
      viewCardItem.innerHTML = 'View Card';
      dropdown.querySelector('.dropdown-menu').appendChild(viewCardItem);
    }

    if (this.actionbuttons.deleteselected === true && this.selectcolumn === true && this.deleterow === true && !this.readonly) {
      const deleteBySelectedItem = document.createElement('a');
      deleteBySelectedItem.className = 'dropdown-item';
      deleteBySelectedItem.onclick = function () { tableobject.deleteBySelected(); };
      deleteBySelectedItem.innerHTML = 'Delete Selected';
      dropdown.querySelector('.dropdown-menu').appendChild(deleteBySelectedItem);
    }

    //nếu dropdown-menu không có item nào thì ẩn dropdown
    if (dropdown.querySelector('.dropdown-menu').children.length === 0) { dropdown.classList.add('d-none'); }
    return dropdown;
  }

  this.genCellHeaderNo = function ({ metacolumn }) {
    if (metacolumn.visible === false) { return null; }
    const tableobject = this;
    //tạo cột số thứ tự
    const thnumber = document.createElement('th');
    thnumber.setAttribute('data-field', metacolumn.field);
    //thiết lập chiều rộng mặc định cho cột số thứ tự
    thnumber.style.width = '24px';
    // thnumber.classList.add('resizable'); // Thêm class resizable để có thể kéo rộng cột
    if (!metacolumn.show) { thnumber.classList.add('d-none'); }
    //div với class d-flex align-items-center flex-nowrap chứa ext và configbutton
    const div = document.createElement('div');
    div.className = 'd-flex align-items-center flex-nowrap';
    thnumber.appendChild(div);

    //tạo dropdown 
    const ext = tableobject.genCellHeaderNoExt()
    if (ext) { div.appendChild(ext); }
    //tạo thẻ a nút cấu hình cột
    const configButton = document.createElement('a');
    configButton.className = 'text-muted';
    configButton.innerHTML = '<i class="fas fa-cog"></i>';
    configButton.onclick = function () { tableobject.configColumn(); };
    div.appendChild(configButton);
    thnumber.appendChild(div);
    return thnumber;
  }
  this.genCellHeaderSelect = function ({ metacolumn }) {
    if (metacolumn.visible === false) { return null; }
    const tableobject = this;
    const thselect = document.createElement('th');
    thselect.setAttribute('data-field', metacolumn.field);
    //thiết lập chiều rộng mặc định cho cột số thứ tự
    thselect.style.width = '24px';
    thselect.classList.add('resizable'); // Thêm class resizable để có thể kéo rộng cột
    if (!metacolumn.show) { thselect.classList.add('d-none'); }
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input';
    checkbox.title = 'Select/Select All';

    checkbox.onclick = function () {
      const isChecked = this.checked;
      const tbody = tableobject.tableelement.querySelector(':scope > tbody.row-datas');
      const rows = tbody.querySelectorAll(':scope > tr');
      rows.forEach(row => {
        const cell = row.querySelector(`:scope > td[data-field="${metacolumn.field}"]`);
        if (cell) {
          const checkbox = cell.querySelector('input[type="checkbox"]');
          if (checkbox) {
            checkbox.checked = isChecked;
            // checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });
      tableobject.onChangeDataSelect(checkbox);
    }
    // cập nhật lại trạng thái của các dòng đã chọn
    // tableobject.updateSelectedRows();

    thselect.appendChild(checkbox);
    return thselect;
  }
  this.genCellHeaderAction = function ({ metacolumn }) {
    if (metacolumn.visible === false) { return null; }
    const th = document.createElement('th');
    th.setAttribute('data-field', metacolumn.field);
    th.classList.add('resizable'); // Thêm class resizable để có thể kéo rộng cột
    th.textContent = 'Actions';
    if (!metacolumn.show) { th.classList.add('d-none'); }
    return th;
  }
  this.genCellHeaderExt = function ({ metacolumn }) {
    //dùng để override
    return null;
  }
  this.genCellHeader = function ({ metacolumn }) {
    if (metacolumn.visible === false) { return null; }
    const tableobject = this;
    if (metacolumn.field === 'SysNo') {
      return this.genCellHeaderNo({ metacolumn: metacolumn });
    }
    if (metacolumn.field === 'SysSelect') {
      return this.genCellHeaderSelect({ metacolumn: metacolumn });
    }
    if (metacolumn.field === 'SysAction') {
      return this.genCellHeaderAction({ metacolumn: metacolumn });
    }
    const th = document.createElement('th');
    //nếu metacolumn.visible là false hoặc metacolumn.show là false thì không hiển thị cột này  gán class d-none
    if (!metacolumn.show) { th.classList.add('d-none'); }

    //tạo nội dung cho th gán trong span với class header-label
    const headerLabel = document.createElement('span');
    headerLabel.innerHTML = `${metacolumn.description || metacolumn.field}<span class="mx-1"></span>`; //(metacolumn.description || metacolumn.field) + '<span class="mx-1"></span>';
    //gán class header-label cho span
    headerLabel.className = 'header-label';
    // //nếu readonly là true thì font-weight normal
    // if (metacolumn.readonly) {
    //   headerLabel.style.fontWeight = 'normal';
    // }

    th.appendChild(headerLabel);

    th.setAttribute('data-field', metacolumn.field);
    th.classList.add('resizable'); // Thêm class resizable để có thể kéo rộng cột

    //nếu có trường metacolumn.gridwidth thì thiết lập chiều rộng cho cột
    if (metacolumn.gridwidth) {
      th.style.width = metacolumn.gridwidth + 'px';
      th.style.maxWidth = metacolumn.gridwidth + 'px';
      th.style.minWidth = metacolumn.gridwidth + 'px';
    }

    //onclick vào span header-label để thay đổi sort
    if (tableobject.allowsorting == true && metacolumn.sortable !== false) {
      headerLabel.onclick = function () { tableobject.changeSortFields({ field: this.closest('th').getAttribute('data-field') }); };
    }

    //gán headerext nếu có
    const headerExt = this.genCellHeaderExt({ metacolumn });
    if (headerExt) { th.appendChild(headerExt); }

    return th;

  };
  //hàm tạo header row trong bảng
  this.genRowHeader = function () {
    const tableobject = this;
    // //xóa theader nếu có
    // const existingThead = this.tableelement.querySelector('thead');
    // if (existingThead) { existingThead.remove(); }
    // //tạo tr thead của table căn cứ meta
    // const thead = document.createElement('thead');

    const thead = this.tableelement.querySelector('thead');
    const tr = document.createElement('tr');
    tr.className = 'row-header'; // Thêm class để có thể tùy chỉnh CSS nếu cần
    this.metacolumns.forEach(column => {
      const th = tableobject.genCellHeader({ metacolumn: column });
      if (th) {
        //gán class kiểu dữ liệu
        th.classList.add('type-' + (column.type || 'string').toLowerCase());
        tr.appendChild(th);
      }
    });
    thead.appendChild(tr);
    //this.tableelement.appendChild(thead);
  };
  //hàm map label sort trong meta sang biểu tượng sort trong header row
  this.mapSortLabelToRowHeader = function () {
    const tableobject = this;
    const thead = this.tableelement.querySelector('thead');
    if (!thead) return;

    // Lấy tất cả các th trong thead
    const ths = thead.querySelectorAll('th[data-field]');
    ths.forEach(th => {
      const field = th.getAttribute('data-field');
      const metaField = tableobject.meta.find(m => m.field === field);
      if (metaField) {
        //Gán lại label và thêm biểu tượng sort tương ứng 
        const headerLabel = th.querySelector('.header-label');
        if (!headerLabel) {
          // Nếu không có header-label thì tạo mới
          const newHeaderLabel = document.createElement('span');
          newHeaderLabel.className = 'header-label';
          newHeaderLabel.innerHTML = (metaField.description || metaField.field) + '<span class="mx-1"></span>';
          th.innerHTML = ''; // Xóa nội dung hiện tại của th
          th.appendChild(newHeaderLabel);
        }
        // Nếu đã có biểu tượng trong span header-label thì xóa nó trước khi thêm mới
        // Xóa biểu tượng sort chứa trong span.header-label >span cũ nếu có
        th.querySelectorAll('.header-label span').forEach(span => {
          span.innerHTML = ''; // Xóa nội dung của span
        });
        const existingSortIcon = th.querySelector('.fas');
        if (existingSortIcon) {
          existingSortIcon.remove();
        }
        //nếu có sorttype thì thêm biểu tượng sort
        if (metaField.sorttype) {
          const icon = document.createElement('i');
          icon.classList.add('fas', metaField.sorttype === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down');
          //gán icon nằm trong span
          const span = th.querySelector('.header-label span');
          span.appendChild(icon);
        }
      }

    });
  };
  //tạo hàm căn cứ vào meta và sortorder và sorttype để trả về biến sortfield và sortorder theo thứ tự sortorder và trả về dạng sortfield='Bigint,Numeric' và sortorder='asc,desc'
  this.getSortFields = function () {
    const sortedFields = this.meta
      .filter(m => m.sortorder)
      .sort((a, b) => a.sortorder - b.sortorder);

    return {
      sortfield: sortedFields.map(m => m.field).join(','),
      sorttype: sortedFields.map(m => m.sorttype || 'asc').join(',')
    };
  };
  // hàm để xóa các trường sortorder và sorttype trong meta
  this.clearSortFields = function ({ excludeSortFields } = {}) {
    this.meta.forEach(m => {
      if (!excludeSortFields || !excludeSortFields.includes(m.field)) {
        delete m.sortorder;
        delete m.sorttype;
      }
    });
  };
  this.addSortFields = function ({ sortFields } = {}) {
    //thêm các trường sortorder và sorttype vào meta
    const tableobject = this;
    const fields = sortFields.split(',');
    fields.forEach((field, index) => {
      const metaField = tableobject.meta.find(m => m.field === field);
      if (metaField) {
        //nếu đã có sorttype thì đảo ngược lại giữ nguyên sortorder
        if (metaField.sorttype) {
          metaField.sorttype = metaField.sorttype === 'asc' ? 'desc' : 'asc';
        } else {
          metaField.sortorder = Math.max(...tableobject.meta.map(m => m.sortorder || 0)) + 1;
          metaField.sorttype = 'asc'; // nếu chưa có thì mặc định là asc
        }
      }
    });
  };
  //hàm changeSortFields để thay đổi các trường sortorder và sorttype trong meta
  this.changeSortFields = async function ({ field }) {
    this.clearSortFields({ excludeSortFields: field });
    this.addSortFields({ sortFields: field });
    this.mapSortLabelToRowHeader();
    this.clearRowData();
    await this.loadData();
  };
  //#endregion
  //#region filter
  //xóa các filter đang lưu trữ trong trường field của meta
  this.metaClearFilter = function ({ meta }) {
    //xóa tòn bộ filter trong meta
    meta.forEach(m => { delete m.filter; });
  };

  //thêm filter vào trường field trong meta
  this.metaAddFilter = function ({ meta, field, op, value }) {
    //thêm filter vào trường field trong meta
    const metaField = meta.find(m => m.field === field);
    if (metaField) {
      if (!metaField.filter) { metaField.filter = []; }
      //kiểm tra nếu đã có filter với op thì cập nhật value
      const existingFilter = metaField.filter.find(f => f.op === op);
      if (existingFilter) {
        //nếu value là null hoặc undefined thì xóa filter
        if (value === null || value === undefined) {
          metaField.filter = metaField.filter.filter(f => f.op !== op);
        } else {
          //nếu đã có filter với op thì cập nhật value
          existingFilter.value = value;
        }
      } else {
        metaField.filter.push({ op: op, value: value });
      }
    }
  };

  //trả về đối tượng filter của trường field trong meta
  this.metaGetFilter = function ({ meta, field }) {
    const metaField = meta.find(m => m.field === field);
    return metaField ? metaField.filter : [];
  };

  //trả về tất cả đối tượng filter trong meta 
  this.metaGetAllFilters = function ({ meta }) {
    const filters = { logic: "and", conditions: [] };

    meta.forEach(m => {
      if (m.filter && Array.isArray(m.filter) && m.filter.length > 0) {
        m.filter.forEach(f => {
          //nếu giá trị là null hoặc undefined thì không thêm vào filter
          if (f.value === null || f.value === undefined) return;
          filters.conditions.push({ field: m.field, op: f.op, value: f.value });
        });
      }
    });

    const extfilters = this.getExtFilters();
    //nếu extfilters là một đối tượng không rỗng thì thêm vào conditions
    if (typeof extfilters === 'object' && !Array.isArray(extfilters) && Object.keys(extfilters).length > 0) { filters.conditions.push(extfilters); }
    return filters;
  };

  this.getExtFilters = function () {
    //trả về đối tượng filter của trường field trong meta
    let filters = {};
    if (this.searchelement && this.searchelement.value) {
      //nếu có giá trị tìm kiếm thì thêm vào filters
      filters = { field: 'searchTerm', op: 'includes', value: this.searchelement.value.trim() };
    }
    return filters;
  };

  //hàm changeRowFilter
  this.changeRowFilter = async function ({ meta, condition } = {}) {
    //điều kiện chỉ là đối tượng condition={field: 'fieldname', op: 'operator', value: 'value'}
    if (condition && condition.field && condition.op) {
      //nếu trường condition.value không có thì set là null
      if (condition.value === undefined || condition.value === null) { condition.value = null; }
      this.metaAddFilter({ meta: meta, field: condition.field, op: condition.op, value: condition.value });
    }
    else {
      //nếu không có điều kiện thì xóa tất cả filter
      this.metaClearFilter({ meta: meta });
      //map giá trị filter trong meta sang input điều kiện lọc của rowfilter
      this.mapMetaFilterToRowFilter();
    }
    this.filter = this.metaGetAllFilters({ meta: meta });
    //this.inittable();
    this.clearRowData();
    await this.loadData();
  };

  //hàm map giá trị filter trong meta sang input  điều kiện lọc của rowfilter
  this.mapMetaFilterToRowFilter = function () {
    const tableobject = this;
    const thead = this.tableelement.querySelector('thead');
    if (!thead) return;

    // Lấy tr filter nếu có
    const filterRow = thead.querySelector('tr.row-filter');
    if (!filterRow) return;

    // Duyệt qua các ô trong tr filter
    const tds = filterRow.querySelectorAll('td');
    tds.forEach(td => {
      //phải lấy input, select trong td   

      //trong td có nhiều input, select 
      const tdInputs = td.querySelectorAll('input, select');
      //quét từng input, select
      tdInputs.forEach(input => {
        if (input) {
          // Lấy field từ thuộc tính data-field
          const field = input.getAttribute('data-field');
          const metaField = tableobject.meta.find(m => m.field === field);
          if (metaField && metaField.filter && Array.isArray(metaField.filter)) {
            // Tìm toán tử và giá trị tương ứng
            const filterItem = metaField.filter.find(f => f.op === input.getAttribute('data-operator'));
            if (filterItem) {
              input.value = filterItem.value || '';
            } else {
              input.value = '';
            }
          } else {
            input.value = '';
          }
        }
      });
    });
  };

  this.genCellFilterNo = function ({ metacolumn }) {
    // Cột số thứ tự
    if (metacolumn.visible === false) { return null; }
    const tdnumber = document.createElement('td');
    if (!metacolumn.show) { tdnumber.classList.add('d-none'); }
    tdnumber.innerHTML = '<i class="fa fa-filter text-muted"></i>';
    return tdnumber;
  }

  this.genCellFilterSelect = function ({ metacolumn }) {
    if (metacolumn.visible === false) { return null; }
    const tdselect = document.createElement('td');
    if (!metacolumn.show) { tdselect.classList.add('d-none'); }
    tdselect.innerHTML = '';//'<i class="fa fa-filter text-muted"></i>';
    return tdselect;
  }

  this.genCellFilterAction = function ({ metacolumn }) {
    if (metacolumn.visible === false) { return null; }

    const tableobject = this;
    // Cột actions
    const tdaction = document.createElement('td');
    if (!metacolumn.show) { tdaction.classList.add('d-none'); }
    tdaction.innerHTML = '';
    //tạo nút Clear Filter
    const clearFilterBtn = document.createElement('button');
    //gán title cho nút Clear Filter
    clearFilterBtn.title = 'Clear Filter';
    //gán biểu tượng cho nút Clear Filter gán thêm biểu tượng hình phiễu kết hợp với biểu tượng xóa
    clearFilterBtn.innerHTML = '<i class="fas fa-times"></i>';
    clearFilterBtn.classList.add('btn', 'btn-sm', 'btn-subtle-secondary', 'me-1');
    //gán onclick cho nút Clear Filter
    clearFilterBtn.onclick = function () { tableobject.changeRowFilter({ meta: tableobject.meta }); };
    tdaction.appendChild(clearFilterBtn);
    return tdaction;
  }

  this.genCellFilter = function ({ metacolumn }) {
    if (metacolumn.field === 'SysNo') {
      return this.genCellFilterNo({ metacolumn: metacolumn });
    }
    if (metacolumn.field === 'SysSelect') {
      return this.genCellFilterSelect({ metacolumn: metacolumn });
    }
    if (metacolumn.field === 'SysAction') {
      return this.genCellFilterAction({ metacolumn: metacolumn });
    }
    if (metacolumn.visible === false) { return null; }
    const tableobject = this;
    const td = document.createElement('td');
    //nếu field.visible là false hoặc field.show là false thì không hiển thị cột này  gán class d-none
    if (!metacolumn.show) { td.classList.add('d-none'); }
    td.style.minWidth = '120px';
    td.setAttribute('data-field', metacolumn.field);

    if (metacolumn.type === 'string' || metacolumn.type === 'text') {
      // Ngầm định toán tử chứa
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'form-control form-control-sm';
      input.placeholder = 'Contains...';
      //set attribute data-operator="includes" vào input
      input.setAttribute('data-operator', 'includes');
      //set attribute data-field vào input
      input.setAttribute('data-field', metacolumn.field);

      // Gán giá trị từ meta.filter nếu có
      if (metacolumn.filter && Array.isArray(metacolumn.filter)) {
        const includesFilter = metacolumn.filter.find(f => f.op === 'includes');
        if (includesFilter && includesFilter.value) { input.value = includesFilter.value; }
      }
      input.onchange = function () {
        tableobject.changeRowFilter({ meta: tableobject.meta, condition: { field: input.getAttribute('data-field'), op: input.getAttribute('data-operator'), value: input.value } });
      };
      td.appendChild(input);
    } else if (
      metacolumn.type === 'number' ||
      metacolumn.type === 'numeric' ||
      metacolumn.type === 'bigint'
    ) {
      // 3 input cho =, >=, <=
      let operators = ['==', '>=', '<='];
      let placeholders = ['=', '>=', '<='];

      //nếu dùng compact
      if (this.filtercompact) {
        operators = ['=='];
        placeholders = ['='];
      }

      operators.forEach((op, idx) => {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'form-control form-control-sm d-inline-block me-1';
        input.placeholder = placeholders[idx];
        // Gán giá trị từ meta.filter nếu có
        if (metacolumn.filter && Array.isArray(metacolumn.filter)) {
          const filterItem = metacolumn.filter.find(f => f.op === op);
          if (filterItem && filterItem.value !== undefined) { input.value = filterItem.value; }
        }

        //set attribute data-operator="includes" vào input
        input.setAttribute('data-operator', op);
        //set attribute data-field vào input
        input.setAttribute('data-field', metacolumn.field);

        input.onchange = function () {
          //nếu giá trị input khác rỗng thì thêm điều kiện vào filter
          if (input.value !== '') {
            tableobject.changeRowFilter({ meta: tableobject.meta, condition: { field: this.getAttribute('data-field'), op: this.getAttribute('data-operator'), value: Number(this.value) } });
          } else {
            tableobject.changeRowFilter({ meta: tableobject.meta, condition: { field: this.getAttribute('data-field'), op: this.getAttribute('data-operator'), value: null } });
          }
        };
        td.appendChild(input);
      });
    } else if (metacolumn.type === 'date' || metacolumn.type === 'datetime') {
      // 3 input cho =, >=, <=
      let operators = metacolumn.type === 'date'
        ? ['dateEquals', 'dateGreaterThanOrEquals', 'dateLessThanOrEquals']
        : ['dateTimeEquals', 'dateTimeGreaterThanOrEquals', 'dateTimeLessThanOrEquals'];
      let placeholders = ['=', '>=', '<='];

      //nếu dùng compact
      if (this.filtercompact) {
        operators = metacolumn.type === 'date'
          ? ['dateEquals']
          : ['dateTimeEquals'];
        placeholders = ['='];
      }

      operators.forEach((op, idx) => {
        const input = document.createElement('input');
        input.type = metacolumn.type === 'date' ? 'date' : 'datetime-local';
        input.className = 'form-control form-control-sm d-inline-block me-1';
        input.placeholder = placeholders[idx];
        // Gán giá trị từ meta.filter nếu có
        if (metacolumn.filter && Array.isArray(metacolumn.filter)) {
          const filterItem = metacolumn.filter.find(f => f.op === op);
          if (filterItem && filterItem.value !== undefined) {
            // Chuyển đổi giá trị date/datetime về định dạng input
            let inputValue = filterItem.value;
            if (filterItem.value instanceof Date) {
              if (metacolumn.type === 'date') {
                inputValue = filterItem.value.toISOString().split('T')[0];
              } else {
                inputValue = filterItem.value.toISOString().slice(0, 16);
              }
            } else if (typeof filterItem.value === 'string') {
              if (metacolumn.type === 'date') {
                inputValue = filterItem.value.split('T')[0];
              } else {
                inputValue = filterItem.value.slice(0, 16);
              }
            }
            input.value = inputValue;
          }
        }
        //set attribute data-operator="includes" vào input
        input.setAttribute('data-operator', op);
        //set attribute data-field vào input
        input.setAttribute('data-field', metacolumn.field);

        input.onchange = function () {
          //nếu giá trị input khác rỗng thì thêm điều kiện vào filter
          if (this.value !== '') {
            tableobject.changeRowFilter({ meta: tableobject.meta, condition: { field: this.getAttribute('data-field'), op: this.getAttribute('data-operator'), value: this.value } });
          } else {
            tableobject.changeRowFilter({ meta: tableobject.meta, condition: { field: this.getAttribute('data-field'), op: this.getAttribute('data-operator'), value: null } });
          }
        };
        td.appendChild(input);
      });
    } else if (metacolumn.type === 'bool' || metacolumn.type === 'boolean') {
      // Dropdown cho boolean
      const select = document.createElement('select');
      select.className = 'form-select form-select-sm';

      // Thêm option rỗng
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = 'All';
      select.appendChild(emptyOption);

      // Thêm option true/false
      ['true', 'false'].forEach(val => {
        const option = document.createElement('option');
        option.value = val;
        option.textContent = val === 'true' ? 'True' : 'False';

        //trường hợp inputtype là checkbox thì đổi label thành Checked/Unchecked
        if (metacolumn.inputtype === 'checkbox') {
          option.textContent = val === 'true' ? 'Checked' : 'Unchecked';
        }

        select.appendChild(option);
      });

      // Gán giá trị từ meta.filter nếu có
      if (metacolumn.filter && Array.isArray(metacolumn.filter)) {
        const eqFilter = metacolumn.filter.find(f => f.op === '==');
        if (eqFilter && eqFilter.value !== undefined) {
          select.value = eqFilter.value.toString();
        }
      }

      //set attribute data-operator="includes" vào input
      select.setAttribute('data-operator', '==');
      //set attribute data-field vào input
      select.setAttribute('data-field', metacolumn.field);

      select.onchange = function () {
        if (this.value !== '') {
          tableobject.changeRowFilter({ meta: tableobject.meta, condition: { field: metacolumn.field, op: this.getAttribute('data-operator'), value: this.value === 'true' } });
        } else {
          tableobject.changeRowFilter({ meta: tableobject.meta, condition: { field: metacolumn.field, op: this.getAttribute('data-operator'), value: null } });
        }
      };
      td.appendChild(select);
    } else {
      td.innerHTML = '';
    }
    return td;
  }

  //hàm tạo filter row trong bảng
  this.genRowFilter = function () {
    const tableobject = this;
    const thead = this.tableelement.querySelector('thead');
    if (!thead) return;
    // Xóa tr filter cũ nếu có
    const oldFilterRow = thead.querySelector('tr.row-filter');
    if (oldFilterRow) oldFilterRow.remove();

    const tr = document.createElement('tr');
    tr.className = 'row-filter';
    if (!this.filterrow) {
      tr.classList.add('d-none'); // nếu không hiển thị filter row thì thêm class d-none
    }
    this.metacolumns.forEach(column => {
      const td = tableobject.genCellFilter({ metacolumn: column });
      if (td) { tr.appendChild(td); }
    });
    thead.appendChild(tr);
  };
  //#endregion

  //hàm tạo summary row trong bảng
  this.genCellSummary = function ({ metacolumn }) {
    if (metacolumn.field === 'SysNo') {
      if (metacolumn.visible === false) { return null; }
      const td = document.createElement('td');
      if (!metacolumn.show) { td.classList.add('d-none'); }
      //chèn biểu tượng tổng vào td
      td.innerHTML = '<i class="uil-sigma text-muted fs-8"></i>';
      return td;
    }
    if (metacolumn.field === 'SysSelect' || metacolumn.field === 'SysAction') {
      if (metacolumn.visible === false) { return null; }
      const td = document.createElement('td');
      if (!metacolumn.show) { td.classList.add('d-none'); }
      td.innerHTML = '';
      return td;
    }
    // const tableobject = this;
    const data = this.datasummary[0] || {};
    if (metacolumn.visible === false) { return null; }
    const td = document.createElement('td');
    td.setAttribute('data-field', metacolumn.field);
    //set tabindex
    td.setAttribute('tabindex', '0');
    //gán class kiểu dữ liệu
    td.classList.add('type-' + (metacolumn.type || 'string').toLowerCase());

    //nếu field.show là false thì không hiển thị cột này  gán class d-none
    if (!metacolumn.show) { td.classList.add('d-none'); }
    if (metacolumn.type === 'number' || metacolumn.type === 'numeric') {
      if (data[metacolumn.field] !== undefined) {
        td.innerHTML = senapp.data.stringifyValue(data[metacolumn.field], metacolumn);
      }
    }
    // //gán quyền chỉnh sửa cho cell
    // this.mapCellEditable({ td: td, data: data, metacolumn: metacolumn });
    return td;
  }
  this.genRowSummary = function () {
    //nếu không cho phép hiển thị summary thì không tạo row summary
    if (!this.allowsummary) { return; }
    const tableobject = this;
    const thead = this.tableelement.querySelector('thead');
    if (!thead) return;
    // Xóa tr summary cũ nếu có
    const oldSummaryRow = thead.querySelector('tr.row-summary');
    if (oldSummaryRow) oldSummaryRow.remove();

    const tr = document.createElement('tr');
    tr.className = 'row-summary';
    // if (!this.filterrow) {
    //   tr.classList.add('d-none'); // nếu không hiển thị summary row thì thêm class d-none
    // }
    this.metacolumns.forEach(column => {
      const td = tableobject.genCellSummary({ metacolumn: column });
      if (td) { tr.appendChild(td); }
    });
    thead.appendChild(tr);
  };
  this.refreshRowSummary = function () {
    //nếu không cho phép hiển thị summary thì không tạo row summary
    if (!this.allowsummary) { return; }
    const tableobject = this;
    const thead = this.tableelement.querySelector('thead');
    if (!thead) return;
    const summaryRow = thead.querySelector('tr.row-summary');
    if (!summaryRow) return;
    const tds = summaryRow.querySelectorAll('td[data-field]');
    tds.forEach(td => {
      const field = td.getAttribute('data-field');
      const metacolumn = tableobject.metacolumns.find(m => m.field === field);
      const data = tableobject.datasummary[0] || {};
      if (metacolumn.type === 'number' || metacolumn.type === 'numeric') {
        if (data[metacolumn.field] !== undefined) {
          td.innerHTML = senapp.data.stringifyValue(data[metacolumn.field], metacolumn);
        }
        else {
          td.innerHTML = '';
        }
      }
    });

  }
  //#region rowadd
  //hàm onChangeCellAdd khi td mất focus và có thay đổi dữ liệu
  this.onChangeCellAdd = async function ({ td, data } = {}) {
    // console.log('onChangeCellAdd:', td, data);
    //nếu chứa class edited thì cập nhật lên server
    if (td.parentElement.classList.contains('edited')) {
      // const tableobject = this;
      // if (!this.addrow || this.readonly) {
      //   // senapp.window.toast({ message: 'Bạn không có quyền sửa dòng này', type: 'danger' });
      //   senapp.window.toast({ message: 'You do not have permission to edit this row', type: 'danger' });
      //   return;
      // }
      // //nếu data rỗng thì lấy data từ tableobject.datas theo keyfield
      // if (!data) {
      //   const keyvalue = td.parentElement.getAttribute('data-id');
      //   data = tableobject.datas.find(item => item[tableobject.keyfield] == keyvalue);
      // }
    }
  }

  //hàm onChangeRowAdd khi tr mất focus và có thay đổi dữ liệu
  this.onChangeRowAdd = async function ({ tr, data } = {}) {
    //dùng để override
    if (tr.classList.contains('edited')) {
      // console.log('onChangeRowAdd:', tr, data);
      tr.classList.remove('edited'); // Xóa class edited nếu đồng bộ thành công
    }
  }

  this.genRowAdd = function ({ data } = {}) {
    const tableobject = this;
    const thead = this.tableelement.querySelector('thead');
    if (!thead) return;
    // xóa tr add cũ nếu có
    const oldAddRow = thead.querySelector('tr.row-add');
    if (oldAddRow) oldAddRow.remove();

    const tr = document.createElement('tr');
    //nếu data trống thì gán this.datanew
    if (!data) { data = this.datanew; }
    //gán giá trị keyfield vào thuộc tính data-id của tr
    tr.setAttribute('data-id', data[tableobject.keyfield]);
    tr.className = 'row-add';
    if (!this.addrow) {
      tr.classList.add('d-none'); // nếu không hiển thị add row thì thêm class d-none
    }
    this.metacolumns.forEach(column => {
      const td = tableobject.genCellNewData({ data: data, metacolumn: column, typemode: 'row-add' });
      // Bắt event trực tiếp ở chính cell
      if (td) {
        td.addEventListener("cellchange", async (e) => {
          // console.log("Old:", e.detail.oldValue, "New:", e.detail.newValue);
          if (e.detail.oldValue === e.detail.newValue) return;
          //nếu giá trị cũ khác giá trị mới thì mới thì đánh dấu dòng thay đổi
          tr.classList.add('edited');
          await tableobject.onChangeCell({ td: td, data: data });
        });
        //gán class kiểu dữ liệu
        td.classList.add('type-' + (column.type || 'string').toLowerCase());
        tr.appendChild(td);
      }
    });
    thead.appendChild(tr);

    // //gán phiếm tắt cho tr nếu nhấn F4 thì kích hoạt onAddRowNewData(); // Thêm dòng mới
    // tr.addEventListener('keydown', (e) => {
    //   if (e.key === 'F4') {
    //     e.preventDefault();
    //     this.onAddRowNewData();
    //   }
    // });
    tr.addEventListener("focusin", () => {
      // tr.classList.add("table-active");
      // console.log("focus in row", tr.rowIndex);
    });

    tr.addEventListener("focusout", async (e) => {
      // e.relatedTarget = phần tử chuẩn bị được focus tiếp theo
      // nếu phần tử đó vẫn nằm trong cùng tr thì KHÔNG xoá active
      if (!tr.contains(e.relatedTarget)) {
        // tr.classList.remove("table-active");
        await tableobject.onChangeRow({ tr: tr, data: data });
      }
    });


  }

  //#endregion

  //#region data

  //#region rownew
  this.initRowNewDragDrop = function () {
    const tableobject = this;
    const table = tableobject.tableelement;
    const tbody = table.querySelector('tbody.row-new-datas');

    let draggingRow = null;
    let allowDrag = false;

    // Chỉ bật draggable khi mousedown trên nút 3 chấm
    tbody.addEventListener('mousedown', (e) => {
      if (e.target.closest('.drag-handle')) {
        const row = e.target.closest('tr');
        if (row) {
          row.setAttribute('draggable', 'true');
          allowDrag = true;
        }
      }
    });

    // Khi thả chuột ra ở bất cứ đâu -> tắt draggable để không kéo nhầm
    document.addEventListener('mouseup', () => {
      allowDrag = false;
      tbody.querySelectorAll('tr[draggable="true"]').forEach(tr => tr.removeAttribute('draggable'));
    });

    // Bắt đầu kéo
    tbody.addEventListener('dragstart', (e) => {
      const row = e.target.closest('tr');
      if (!allowDrag || !row) {
        e.preventDefault();
        return;
      }
      draggingRow = row;
      row.classList.add('dragging');

      // Cần setData cho Firefox
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', row.dataset.id || '');

      // Tạo ghost image đẹp hơn
      const ghost = row.cloneNode(true);
      ghost.style.background = 'rgba(0,0,0,0.05)';
      ghost.style.width = `${row.offsetWidth}px`;
      ghost.style.position = 'absolute';
      ghost.style.top = '-9999px';
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 20, 10);
      // Xóa ghost ngay sau khi set
      setTimeout(() => document.body.removeChild(ghost), 0);
    });

    // Trong khi kéo: tính vị trí chèn
    tbody.addEventListener('dragover', (e) => {
      if (!draggingRow) return;
      e.preventDefault();

      // Xóa highlight cũ
      tbody.querySelectorAll('tr.drop-before, tr.drop-after').forEach(tr => {
        tr.classList.remove('drop-before', 'drop-after');
      });

      const afterEl = getDragAfterElement(tbody, e.clientY);
      if (!afterEl) {
        // nếu không có phần tử sau -> chèn cuối
        tbody.appendChild(draggingRow);
      } else {
        tbody.insertBefore(draggingRow, afterEl);
        // tạo highlight gợi ý
        afterEl.classList.add('drop-before');
      }
    });

    // Kéo ra ngoài tbody rồi vào lại vẫn cho phép sắp xếp
    tbody.addEventListener('drop', (e) => {
      e.preventDefault();
    });

    tbody.addEventListener('dragend', () => {
      if (draggingRow) draggingRow.classList.remove('dragging');
      draggingRow = null;
      // Xóa highlight
      tbody.querySelectorAll('tr.drop-before, tr.drop-after').forEach(tr => {
        tr.classList.remove('drop-before', 'drop-after');
      });
      //cập nhật lại vị trí trong mảng dữ liệu datanews nếu cần
      const rownews = tbody.querySelectorAll('tr.row-new-data');
      //thay thứ tự của mảng datanews theo thứ tự index
      // Lấy id các dòng theo thứ tự mới
      const newOrder = Array.from(rownews).map(tr => parseInt(tr.dataset.id));
      // Sắp xếp lại datanews theo thứ tự id mới
      tableobject.datanews.sort((a, b) => newOrder.indexOf(a[tableobject.keyfield]) - newOrder.indexOf(b[tableobject.keyfield]));
      tableobject.resetNewSysNo();

    });

    // Hàm tìm phần tử ngay sau vị trí con trỏ (để chèn trước nó)
    function getDragAfterElement(container, y) {
      const rows = [...container.querySelectorAll('tr:not(.dragging)')];
      let closest = { offset: Number.NEGATIVE_INFINITY, element: null };

      for (const row of rows) {
        const box = row.getBoundingClientRect();
        const offset = y - (box.top + box.height / 2);
        if (offset < 0 && offset > closest.offset) {
          closest = { offset, element: row };
        }
      }
      return closest.element;
    }
  }

  this.clearRowNewData = function () {
    //xóa data trong tableobject.datanews
    this.datanews = [];
    //xóa tbody nếu có
    const tbody = this.tableelement.querySelector('tbody.row-new-datas');
    if (tbody) { tbody.innerHTML = '<tr></tr>'; }
  };
  //Hàm genCellDataAction để tạo dữ liệu cho ô td của cột Action
  this.genCellNewDataAction = function ({ data, metacolumn, typemode } = {}) {
    if (metacolumn.visible === false) { return null; }
    const tableobject = this;
    const tdaction = document.createElement('td');
    tdaction.setAttribute('data-field', metacolumn.field);
    //nếu field.visible là false hoặc field.show là false thì không hiển thị cột này  gán class d-none
    if (!metacolumn.show) { tdaction.classList.add('d-none'); }

    if (typemode === 'row-new-data') {
      const deleteLink = document.createElement('a');
      deleteLink.dataset.id = data[tableobject.keyfield];
      deleteLink.href = 'javascript:;';
      deleteLink.onclick = function () {
        const row = this.closest('tr');
        tableobject.newDelete(row);
      };
      deleteLink.className = 'btn btn-sm btn-reveal py-0';
      deleteLink.innerHTML = '<i class="fas fa-times"  style="padding-top:1px;"></i>';
      tdaction.appendChild(deleteLink);
    }

    if (typemode === 'row-add') {
      const addLink = document.createElement('a');
      addLink.dataset.id = data[tableobject.keyfield];
      addLink.href = 'javascript:;';
      addLink.onclick = function () { tableobject.onAddRowNewData(); };
      addLink.className = 'btn btn-sm btn-reveal py-0';
      addLink.innerHTML = '<i class="fas fa-plus"  style="padding-top:1px;"></i>';
      tdaction.appendChild(addLink);
    }

    return tdaction;
  };

  //hàm reset số thứ tự
  this.resetNewSysNo = function () {
    const rowsysno = this.tableelement.querySelectorAll('tbody.row-new-datas tr td[data-field="SysNo"] span.sysno');
    rowsysno.forEach((span, index) => {
      span.innerHTML = `${index + 1}`;
    });
  }

  //Hàm genCellDataNo để tạo dữ liệu cho ô td của cột số thứ tự
  this.genCellNewDataNo = function ({ data, metacolumn, typemode } = {}) {
    if (metacolumn.visible === false) { return null; }
    const tableobject = this;
    const td = document.createElement('td');
    td.setAttribute('data-field', metacolumn.field);
    //nếu field.visible là false hoặc field.show là false thì không hiển thị cột này  gán class d-none
    if (!metacolumn.show) { td.classList.add('d-none'); }
    const rownumber = this.datanews.findIndex(item => item[tableobject.keyfield] === data[tableobject.keyfield]) + 1; // Tìm vị trí của dòng trong mảng dữ liệu
    //td.textContent = rownumber; // Gán số thứ tự vào ô td
    td.innerHTML = `<div class="d-flex align-items-center flex-nowrap"> <a class="drag-handle p-0 text-muted fs-10" aria-label="Kéo để sắp xếp" title="Kéo để sắp xếp"><i class="fas fa-grip-vertical"></i>
                    </a><span class="sysno">${rownumber}</span></div>`;
    td.classList.add('drag-cell'); // Căn giữa nội dung số thứ tự
    if (typemode === 'row-add') {
      td.innerHTML = '';
      //nếu có khai báo nút savenews:true thì tạo nút lưu saveNews nếu là row-add
      if (this.actionbuttons.savenews === true) {
        //tạo nút lưu saveNews nếu là row-add 
        const saveLink = document.createElement('a');
        saveLink.dataset.id = data[tableobject.keyfield];
        saveLink.href = 'javascript:;';
        saveLink.onclick = function () { tableobject.saveNews(); };
        saveLink.className = 'btn btn-sm btn-reveal p-0 opacity-75';
        saveLink.innerHTML = '<i class="fas fa-save"  style="padding-top:1px;"></i>';
        td.appendChild(saveLink);
        // td.innerHTML = ''; 
      }
    }
    return td; // Trả về td ngay nếu là SysNo
  };

  //hàm genCellDataSelect để tạo dữ liệu cho ô td của cột Select
  this.genCellNewDataSelect = function ({ data, metacolumn } = {}) {
    if (metacolumn.visible === false) { return null; }
    const td = document.createElement('td');
    // td.setAttribute('data-field', metacolumn.field);
    // //nếu field.visible là false hoặc field.show là false thì không hiển thị cột này  gán class d-none
    // if (!metacolumn.show) { td.classList.add('d-none'); }
    // const checkbox = document.createElement('input');
    // checkbox.type = 'checkbox';
    // checkbox.className = 'form-check-input';
    // checkbox.value = data[this.keyfield];
    // td.appendChild(checkbox);
    return td;
  };


  //hàm map quyền editable cho cell dùng cho override
  this.mapCellNewEditableExt = function ({ td, data, metacolumn }) {
    return true;
  }

  //hàm map quyền editable cho cell
  this.mapCellNewEditable = function ({ td, data, metacolumn }) {
    if (this.readonly === true || this.addrow === false || metacolumn.readonly === true) {
      //nếu bên trong td là checbox thì không cho chỉnh sửa
      const checkbox = td.querySelector('input[type="checkbox"]');
      if (checkbox) { checkbox.disabled = true; }
      return; //nếu bảng ở chế độ readonly thì không cho chỉnh sửa      
    }
    //nếu metacolumn.editable là false thì không cho chỉnh sửa
    if (this.mapCellNewEditableExt({ td, data, metacolumn }) === true) {
      td.classList.add('editable');
    }
    else {
      //nếu bên trong td là checbox thì không cho chỉnh sửa
      const checkbox = td.querySelector('input[type="checkbox"]');
      if (checkbox) { checkbox.disabled = true; }
    }
  }

  //hàm genCellData để tạo dữ liệu cho bảng
  this.genCellNewData = function ({ data, metacolumn, typemode } = {}) {
    //nếu metacolumn.field chứa trong customcolumns thì gọi hàm genCellDataCustom
    if (this.customcolumns && this.customcolumns.includes(metacolumn.field)) {
      return this.genCellDataCustom({ data, metacolumn });
    }

    //nếu metacolumn.field là 'SysNo' thì nội dung bằng số dòng trong tbody tr trong bảng
    if (metacolumn.field === 'SysNo') {
      return this.genCellNewDataNo({ data: data, metacolumn: metacolumn, typemode: typemode });
    }

    //nếu metacolumn.field là 'SysSelect' thì trả về tdselect
    if (metacolumn.field === 'SysSelect') {
      return this.genCellNewDataSelect({ data: data, metacolumn: metacolumn });
      // //tạo td nội dung trống
      // const tdSysSelect = document.createElement('td');
      // return tdSysSelect;
    }

    //nếu metacolumn.field là 'SysAction' thì trả về tdaction
    if (metacolumn.field === 'SysAction') {
      return this.genCellNewDataAction({ data: data, metacolumn: metacolumn, typemode: typemode });
    }

    if (metacolumn.visible === false) { return null; }
    const td = document.createElement('td');
    td.setAttribute('data-field', metacolumn.field);
    //set tabindex
    td.setAttribute('tabindex', '0');
    //nếu field.show là false thì không hiển thị cột này  gán class d-none
    if (!metacolumn.show) { td.classList.add('d-none'); }

    //nếu trường có tồn tại data thì map giá trị với data 
    if (metacolumn.data) {
      const mappedValue = metacolumn.data.find(item => item.id === data[metacolumn.field]);
      td.textContent = mappedValue ? mappedValue.label : '';
      //gán quyền chỉnh sửa cho cell
      this.mapCellNewEditable({ td: td, data: data, metacolumn: metacolumn });
      return td;
    }

    //nếu có inputtype== 'checkbox' 
    if (metacolumn.inputtype && metacolumn.inputtype === 'checkbox' && (metacolumn.type === 'bool' || metacolumn.type === 'boolean')) {
      // check của fontawesome  nếu data[metacolumn.field] là true thì checked nếu false thì unchecked
      // td.innerHTML = `<div class="form-check"> <input style="opacity:1;" class="form-check-input" type="checkbox" ${data[metacolumn.field] ? 'checked' : ''}></div>`;
      // td.innerHTML = `<div class="form-check form-switch"> <input class="form-check-input" type="checkbox" disabled ${data[metacolumn.field] ? 'checked' : ''}></div>`;
      // td.innerHTML = `<i class="fa-regular ${data[metacolumn.field] ? 'fa-square-check' : 'fa-square'}"></i>`;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-check-input';
      checkbox.classList.add('cell-editor');
      checkbox.value = data[metacolumn.field];
      checkbox.style.opacity = '1';
      //nếu data[metacolumn.field]==true thì checkbox chọn
      if (data[metacolumn.field] == true) { checkbox.checked = true; }
      //khi thay đổi thì gọi hàm updateData của  tableobject
      checkbox.onchange = function () {
        data[metacolumn.field] = this.checked;
        // phát sự kiện nếu thay đổi
        td.dispatchEvent(new CustomEvent("cellchange", {
          bubbles: true,
          detail: { oldValue: !data[metacolumn.field], newValue: this.checked, cell: td }
        }));
      };
      td.appendChild(checkbox);
      //gán quyền chỉnh sửa cho cell
      this.mapCellNewEditable({ td: td, data: data, metacolumn: metacolumn });
      return td;
    }
    // debugger;
    td.innerHTML = senapp.data.stringifyValue(data[metacolumn.field], metacolumn);
    //gán quyền chỉnh sửa cho cell
    this.mapCellNewEditable({ td: td, data: data, metacolumn: metacolumn });
    return td;
  };

  //hàm onChangeCellNew khi td mất focus và có thay đổi dữ liệu
  this.onChangeCellNew = async function ({ td, data } = {}) {
    //tạm dùng chung 
    await this.onChangeCellAdd({ td, data });

    // console.log('onChangeCellNew:', td, data);
    // //nếu chứa class edited thì cập nhật lên server
    // if (td.parentElement.classList.contains('edited')) {
    //   // const tableobject = this;
    //   // if (!this.addrow || this.readonly) {
    //   //   // senapp.window.toast({ message: 'Bạn không có quyền sửa dòng này', type: 'danger' });
    //   //   senapp.window.toast({ message: 'You do not have permission to edit this row', type: 'danger' });
    //   //   return;
    //   // }
    //   // //nếu data rỗng thì lấy data từ tableobject.datas theo keyfield
    //   // if (!data) {
    //   //   const keyvalue = td.parentElement.getAttribute('data-id');
    //   //   data = tableobject.datas.find(item => item[tableobject.keyfield] == keyvalue);
    //   // }
    // }
  }

  //hàm onChangeRowNew khi tr mất focus và có thay đổi dữ liệu
  this.onChangeRowNew = async function ({ tr, data } = {}) {
    //dùng để override
    if (tr.classList.contains('edited')) {
      // console.log('onChangeRowNew:', tr, data);
      tr.classList.remove('edited'); // Xóa class edited nếu đồng bộ thành công
    }
  }

  //hàm genRowData để tạo dữ liệu cho bảng
  this.genRowNewData = function ({ data }) {
    const tableobject = this;
    const tr = document.createElement('tr');
    tr.classList.add('row-new-data');
    //gán giá trị keyfield vào thuộc tính data-id của tr
    tr.setAttribute('data-id', data[tableobject.keyfield]);

    this.metacolumns.forEach(column => {
      const td = tableobject.genCellNewData({ data: data, metacolumn: column, typemode: 'row-new-data' });
      // Bắt event trực tiếp ở chính cell
      if (td) {
        td.addEventListener("cellchange", async (e) => {
          // console.log("Old:", e.detail.oldValue, "New:", e.detail.newValue);
          if (e.detail.oldValue === e.detail.newValue) return;
          //nếu giá trị cũ khác giá trị mới thì mới thì đánh dấu dòng thay đổi
          tr.classList.add('edited');
          await tableobject.onChangeCell({ td: td, data: data });
        });
        //gán class kiểu dữ liệu
        td.classList.add('type-' + (column.type || 'string').toLowerCase());
        tr.appendChild(td);
      }

    });

    // //gán phím tắt F8 xóa
    // tr.addEventListener('keydown', (e) => {
    //   if (e.key === 'F8') {
    //     e.preventDefault();
    //     tableobject.newDelete(tr);
    //   }
    // });

    tr.addEventListener("focusin", () => {
      // tr.classList.add("table-active");
      // console.log("focus in row", tr.rowIndex);
    });

    tr.addEventListener("focusout", async (e) => {
      // e.relatedTarget = phần tử chuẩn bị được focus tiếp theo
      // nếu phần tử đó vẫn nằm trong cùng tr thì KHÔNG xoá active
      if (!tr.contains(e.relatedTarget)) {
        // tr.classList.remove("table-active");
        await tableobject.onChangeRow({ tr: tr, data: data });
      }
    });

    return tr;
  }

  this.loadNewData = async function ({ page = 1 } = {}) {
    const tableobject = this;
    if (this.urldata && this.urldata.listnews) {
      const resdata = await senapp.data.getServerData({ url: this.urldata.listnews });
      senapp.data.parseDataFromServer({ datas: resdata.datas, meta: tableobject.meta });
      //gán dữ liệu cho tableobject.datanews
      tableobject.datanews.push(...resdata.datas);
    }

    const tbody = tableobject.tableelement.querySelector('tbody.row-new-datas');
    tableobject.datanews.forEach((data, index) => {
      const tr = tableobject.genRowNewData({ data: data });
      tbody.appendChild(tr);
    });
  };

  this.addRowNewData = function ({ data }) {
    //kiểm tra nếu dữ liệu có keyfield thì thêm vào tableobject.datas
    if (data[this.keyfield]) {
      //this.addData({ data: data });
      const tr = this.genRowNewData({ data: data });
      const tbody = this.tableelement.querySelector('tbody.row-new-datas');
      tbody.appendChild(tr);
    }
  }

  //thêm dữ liệu vào tableobject.datanews
  this.addNewData = function ({ data }) {
    this.datanews.push(data);
  }

  //hàm trả về giá trị key tự sinh để thêm dòng mới tạm
  this.genKeyValue = function () {
    //gán giá trị keyfield nhỏ nhất từ this.datanews
    const minKeyField = Math.min(...this.datanews.map(item => item[this.keyfield]));
    //nếu minKeyField>=0 thì trả về -1
    //nếu minKeyField<0 thì trả về minKeyField-1
    if (minKeyField >= 0) return -1;
    return ((isNaN(minKeyField) || minKeyField === Infinity) ? 0 : parseInt(minKeyField)) - 1;
  };
  //hàm này sẽ được gọi khi thêm một dòng dữ liệu mới vào bảng thêm mới
  this.onAddRowNewData = function ({ data } = {}) {
    //nếu data trống thì gán this.datanew
    if (!data) { data = JSON.parse(JSON.stringify(this.datanew)); }
    data[this.keyfield] = this.genKeyValue();
    this.addNewData({ data: data });
    this.addRowNewData({ data: data });
  }
  //#endregion


  //viết hàm clearrowdata để xóa dữ liệu trong bảng
  this.clearRowData = function () {
    //xóa data trong tableobject.datas
    this.datas.length = 0;
    //xóa data trong tableobject.datadeleteds
    this.datadeleteds.length = 0;
    //xóa tbody nếu có
    const tbody = this.tableelement.querySelector('tbody.row-datas');
    if (tbody) { tbody.innerHTML = ''; }
  };

  //hàm reset số thứ tự
  this.resetSysNo = function () {
    const rowsysno = this.tableelement.querySelectorAll('tbody.row-datas tr td[data-field="SysNo"] span.sysno');
    rowsysno.forEach((span, index) => {
      span.innerHTML = `${index + 1}`;
    });
  }

  //Hàm genCellDataNo để tạo dữ liệu cho ô td của cột số thứ tự
  this.genCellDataNo = function ({ data, metacolumn } = {}) {
    if (metacolumn.visible === false) { return null; }
    const tableobject = this;
    const td = document.createElement('td');
    td.setAttribute('data-field', metacolumn.field);
    //nếu field.visible là false hoặc field.show là false thì không hiển thị cột này  gán class d-none
    if (!metacolumn.show) { td.classList.add('d-none'); }
    const rownumber = this.datas.findIndex(item => item[tableobject.keyfield] === data[tableobject.keyfield]) + 1; // Tìm vị trí của dòng trong mảng dữ liệu
    if (tableobject.sysnoviewcard) {
      const alink = document.createElement('a');
      alink.href = 'javascript:;';
      alink.onclick = function () { tableobject.cardview({ datas: [data] }); };
      alink.innerHTML = `<span class="sysno">${rownumber}</span>`;
      td.appendChild(alink);// Gán số thứ tự vào ô td
    }
    else {
      td.innerHTML = `<span class="sysno">${rownumber}</span>`; // Gán số thứ tự vào ô td
    }
    return td; // Trả về td ngay nếu là SysNo
  };

  //DataSelectOnChange khi checkbox của cột Select thay đổi trạng thái (hàm dùng cho override)
  this.onChangeDataSelect = function (checkbox, data) {
    // if (!data) {
    //   //chọn từ header
    // }
    // else {
    //   //chọn từ dòng
    // }
    const rowselection = this.getDataSelected();
    const summary = {};
    const metacolumns = this.metacolumns;
    rowselection.forEach(row => {
      metacolumns.forEach(col => {
        if (col.allowsummary === true) {
          if (col.type === 'number' || col.type === 'numeric' || col.type === 'decimal') {
            const value = parseFloat(row[col.field]);
            if (!isNaN(value)) {
              summary[col.field] = (summary[col.field] || 0) + value;
            }
          }
        }
      });
    });
    this.datasummary = [summary];
    this.refreshRowSummary();
  }

  //hàm genCellDataSelect để tạo dữ liệu cho ô td của cột Select
  this.genCellDataSelect = function ({ data, metacolumn } = {}) {
    if (metacolumn.visible === false) { return null; }
    const td = document.createElement('td');
    td.setAttribute('data-field', metacolumn.field);
    //nếu field.visible là false hoặc field.show là false thì không hiển thị cột này  gán class d-none
    if (!metacolumn.show) { td.classList.add('d-none'); }
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input';
    checkbox.value = data[this.keyfield];
    //gọi hàm onChangeDataSelect khi checkbox thay đổi trạng thái
    const tableobject = this;
    checkbox.onchange = function () {
      tableobject.onChangeDataSelect(this, data);
    };

    td.appendChild(checkbox);
    return td;
  };


  //dùng override hàm genCellDataAction để tạo dữ liệu cho ô td của cột Action có điều kiện hiển thị nút sửa và xóa dựa trên dữ liệu của dòng đó
  this.genCellDataActionCheck = function ({ data, metacolumn, actionbuttons } = {}) {

  }

  //Hàm genCellDataAction để tạo dữ liệu cho ô td của cột Action
  this.genCellDataAction = function ({ data, metacolumn } = {}) {
    if (metacolumn.visible === false) { return null; }
    const tableobject = this;
    const tdaction = document.createElement('td');
    tdaction.setAttribute('data-field', metacolumn.field);
    //nếu field.visible là false hoặc field.show là false thì không hiển thị cột này  gán class d-none
    if (!metacolumn.show) { tdaction.classList.add('d-none'); }
    // Tạo nút hành động với dropdown với nút xóa và nút sửa gán sự kiện onclick cho nút sửa và nút xóa   vào this.delete và this.edit

    const actionbuttonscheckbydata = Object.assign({}, this.actionbuttons);
    this.genCellDataActionCheck({ data, metacolumn, actionbuttons: actionbuttonscheckbydata });

    if (this.actionbuttons.edit === false && this.actionbuttons.delete === false) return tdaction;

    tdaction.innerHTML = `
                <div class="btn-reveal-trigger position-static">
                  <button class="btn btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal py-0" type="button" data-bs-toggle="dropdown" data-boundary="window" data-bs-reference="parent"><span class="fas fa-ellipsis-h fs-10"></span></button>
                  <div class="dropdown-menu py-2" data-popper-placement="bottom-end">
                  </div>
                </div>
              `;
    const dropdownMenu = tdaction.querySelector('.dropdown-menu');
    let hasAction = false;
    if (this.actionbuttons.edit === true && actionbuttonscheckbydata.edit === true) {
      const editLink = document.createElement('a');
      editLink.dataset.id = data[tableobject.keyfield];
      editLink.href = 'javascript:;';
      editLink.onclick = function () {
        tableobject.edit(this);
      };
      editLink.className = 'dropdown-item';
      editLink.textContent = 'Edit';
      dropdownMenu.appendChild(editLink);
      hasAction = true;
    }
    // const deleteDivider = document.createElement('div');
    // deleteDivider.className = 'dropdown-divider';
    // dropdownMenu.appendChild(deleteDivider);
    if (this.actionbuttons.delete === true && actionbuttonscheckbydata.delete === true) {
      const deleteLink = document.createElement('a');
      deleteLink.dataset.id = data[tableobject.keyfield];
      deleteLink.href = 'javascript:;';
      deleteLink.onclick = function () {
        const row = $(this).closest('tr');
        tableobject.delete(row);
      };
      deleteLink.className = 'dropdown-item text-danger';
      deleteLink.textContent = 'Delete';
      dropdownMenu.appendChild(deleteLink);
      hasAction = true;
    }
    if (!hasAction) {
      tdaction.innerHTML = '';
    }
    return tdaction;
  };

  //hàm genCellDataCustom để tạo dữ liệu cho các cột tùy chỉnh
  this.genCellDataCustom = function ({ data, metacolumn }) {
    if (metacolumn.visible === false) { return null; }
    // Hàm này sẽ được sử dụng để tạo dữ liệu cho các cột tùy chỉnh
    const td = document.createElement('td');
    td.setAttribute('data-field', metacolumn.field);
    //nếu field.visible là false hoặc field.show là false thì không hiển thị cột này  gán class d-none
    if (!metacolumn.show) { td.classList.add('d-none'); }
    return td; // Trả về td ngay nếu là cột tùy chỉnh
  }

  //hàm map quyền editable cho cell dùng cho override
  this.mapCellEditableExt = function ({ td, data, metacolumn }) {
    return true;
  }

  //hàm map quyền editable cho cell
  this.mapCellEditable = function ({ td, data, metacolumn }) {
    //20250930
    if (this.readonly === true || this.editrow === false || metacolumn.readonly === true) {
      //nếu bên trong td là checbox thì không cho chỉnh sửa
      const checkbox = td.querySelector('input[type="checkbox"]');
      if (checkbox) { checkbox.disabled = true; }
      return; //nếu bảng ở chế độ readonly thì không cho chỉnh sửa      
    }
    //nếu metacolumn.editable là false thì không cho chỉnh sửa
    if (this.mapCellEditableExt({ td, data, metacolumn }) === true) {
      td.classList.add('editable');
    }
    else {
      //nếu bên trong td là checbox thì không cho chỉnh sửa
      const checkbox = td.querySelector('input[type="checkbox"]');
      if (checkbox) { checkbox.disabled = true; }
    }
  }

  //hàm genCellData để tạo dữ liệu cho bảng
  this.genCellData = function ({ data, metacolumn }) {
    //nếu metacolumn.field chứa trong customcolumns thì gọi hàm genCellDataCustom
    if (this.customcolumns && this.customcolumns.includes(metacolumn.field)) {
      return this.genCellDataCustom({ data, metacolumn });
    }

    //nếu metacolumn.field là 'SysNo' thì nội dung bằng số dòng trong tbody tr trong bảng
    if (metacolumn.field === 'SysNo') {
      return this.genCellDataNo({ data: data, metacolumn: metacolumn });
    }

    //nếu metacolumn.field là 'SysSelect' thì trả về tdselect
    if (metacolumn.field === 'SysSelect') {
      return this.genCellDataSelect({ data: data, metacolumn: metacolumn });
    }

    //nếu metacolumn.field là 'SysAction' thì trả về tdaction
    if (metacolumn.field === 'SysAction') {
      return this.genCellDataAction({ data: data, metacolumn: metacolumn });
    }
    if (metacolumn.visible === false) { return null; }
    const td = document.createElement('td');
    td.setAttribute('data-field', metacolumn.field);
    //set tabindex
    td.setAttribute('tabindex', '0');
    //nếu field.show là false thì không hiển thị cột này  gán class d-none
    if (!metacolumn.show) { td.classList.add('d-none'); }

    //nếu trường có tồn tại data thì map giá trị với data 
    if (metacolumn.data) {
      const mappedValue = metacolumn.data.find(item => item.id === data[metacolumn.field]);
      td.textContent = mappedValue ? mappedValue.label : '';
      //gán quyền chỉnh sửa cho cell
      this.mapCellEditable({ td: td, data: data, metacolumn: metacolumn });
      return td;
    }

    //nếu có inputtype== 'checkbox' 
    if (metacolumn.inputtype && metacolumn.inputtype === 'checkbox' && (metacolumn.type === 'bool' || metacolumn.type === 'boolean')) {
      // check của fontawesome  nếu data[metacolumn.field] là true thì checked nếu false thì unchecked
      // td.innerHTML = `<div class="form-check"> <input style="opacity:1;" class="form-check-input" type="checkbox" disabled ${data[metacolumn.field] ? 'checked' : ''}></div>`;
      // td.innerHTML = `<div class="form-check form-switch"> <input class="form-check-input" type="checkbox" disabled ${data[metacolumn.field] ? 'checked' : ''}></div>`;
      // td.innerHTML = `<i class="fa-regular ${data[metacolumn.field] ? 'fa-square-check' : 'fa-square'}"></i>`;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-check-input';
      checkbox.classList.add('cell-editor');
      checkbox.value = data[metacolumn.field];
      checkbox.style.opacity = '1';
      //nếu data[metacolumn.field]==true thì checkbox chọn
      if (data[metacolumn.field] == true) { checkbox.checked = true; }
      //khi thay đổi thì gọi hàm updateData của  tableobject
      checkbox.onchange = function () {
        data[metacolumn.field] = this.checked;
        // phát sự kiện nếu thay đổi
        td.dispatchEvent(new CustomEvent("cellchange", {
          bubbles: true,
          detail: { oldValue: !data[metacolumn.field], newValue: this.checked, cell: td }
        }));
        //tableobject.updateByKey(data[tableobject.keyfield]);
      };
      td.appendChild(checkbox);
      //gán quyền chỉnh sửa cho cell
      this.mapCellEditable({ td: td, data: data, metacolumn: metacolumn });
      return td;
    }

    td.innerHTML = senapp.data.stringifyValue(data[metacolumn.field], metacolumn);
    //gán quyền chỉnh sửa cho cell
    this.mapCellEditable({ td: td, data: data, metacolumn: metacolumn });
    return td;
  };

  //cập nhật lại giao diện của cell dữ liệu trong bảng
  this.updateCellData = function ({ data, metacolumn }) {
    //sẽ phát triển sau này
  }

  //hàm onChangeCellData khi td mất focus và có thay đổi dữ liệu
  this.onChangeCellData = async function ({ td, data } = {}) {
    if (td.parentElement.classList.contains('edited')) {
      // const tableobject = this;
      // if (!this.editrow || this.readonly) {
      //   // senapp.window.toast({ message: 'Bạn không có quyền sửa dòng này', type: 'danger' });
      //   senapp.window.toast({ message: 'You do not have permission to edit this row', type: 'danger' });
      //   return;
      // }
      // //nếu data rỗng thì lấy data từ tableobject.datas theo keyfield
      // if (!data) {
      //   const keyvalue = td.parentElement.getAttribute('data-id');
      //   data = tableobject.datas.find(item => item[tableobject.keyfield] == keyvalue);
      // }
    }
  };

  //hàm onChangeCell khi td mất focus và có thay đổi dữ liệu
  this.onChangeCell = async function ({ td, data } = {}) {
    // console.log('onChangeCell:', td, data);
    //phân loại cell thuộc tr có chứa class row-new-data hay class row-data hay row-add
    if (td.parentElement.classList.contains('row-new-data')) {
      await this.onChangeCellNew({ td: td, data: data });
      return;
    }
    if (td.parentElement.classList.contains('row-add')) {
      await this.onChangeCellAdd({ td: td, data: data });
      return;
    }

    //nếu chứa class edited thì cập nhật lên server
    if (td.parentElement.classList.contains('row-data')) {
      await this.onChangeCellData({ td: td, data: data });
      return;
    }
  }

  //hàm gen định dạng class cho row dữ liệu dùng để override
  this.genRowDataExtClass = function ({ tr, data }) {
  }
  //hàm genRowData để tạo dữ liệu cho bảng
  this.genRowData = function ({ data }) {
    const tableobject = this;
    const tr = document.createElement('tr');
    //gán giá trị keyfield vào thuộc tính data-id của tr
    tr.setAttribute('data-id', data[tableobject.keyfield]);
    tr.className = 'row-data';

    this.metacolumns.forEach(column => {
      const td = tableobject.genCellData({ data: data, metacolumn: column });
      // Bắt event trực tiếp ở chính cell
      if (td) {
        td.addEventListener("cellchange", async (e) => {
          // console.log("Old:", e.detail.oldValue, "New:", e.detail.newValue);
          if (e.detail.oldValue === e.detail.newValue) return;
          //nếu giá trị cũ khác giá trị mới thì mới thì đánh dấu dòng thay đổi
          tr.classList.add('edited');
          await tableobject.onChangeCell({ td: td, data: data });

          // //nếu tùy chọn cập nhật theo từng cell thì gọi hàm cập nhật dữ liệu
          // if (!tableobject.updatebycell) return;
          // //đồng bộ lên server
          // const response = await tableobject.synData({ data: { [tableobject.metakey.field]: data[tableobject.metakey.field], [column.field]: data[column.field] }, type: 'edit' });
          // const row = td.closest('tr');
          // //xóa class callout-danger trong row
          // row.classList.remove('callout-danger');
          // row.removeAttribute('title');
          // //xóa định dạng lỗi
          // td.classList.remove('cell-danger');
          // //xóa cell title
          // td.removeAttribute('title');
          // if (response.status == 0) {
          //   //cập nhật có lỗi
          //   if (column.field && response.errors[column.field]) {
          //     td.classList.add('cell-danger');
          //     td.setAttribute('title', response.errors[column.field]);
          //   }
          //   row.classList.add('callout-danger');
          //   row.setAttribute('title', response.message);
          //   //senapp.window.toast({ message: response.message || 'Lỗi cập nhật dữ liệu!', type: 'danger' });
          // }

        });
        //gán class kiểu dữ liệu
        td.classList.add('type-' + (column.type || 'string').toLowerCase());
        tr.appendChild(td);
      }

    });

    tr.addEventListener("focusin", () => {
      // tr.classList.add("table-active");
      // console.log("focus in row", tr.rowIndex);
    });

    tr.addEventListener("focusout", async (e) => {
      // e.relatedTarget = phần tử chuẩn bị được focus tiếp theo
      // nếu phần tử đó vẫn nằm trong cùng tr thì KHÔNG xoá active
      if (!tr.contains(e.relatedTarget)) {
        // tr.classList.remove("table-active");
        await tableobject.onChangeRow({ tr: tr, data: data });
      }
    });

    this.genRowDataExtClass({ tr: tr, data: data });
    return tr;
  }

  //hàm này sẽ được gọi khi thêm một dòng dữ liệu mới vào bảng
  this.onAddRowData = function ({ data }) {
    this.addData({ data: data });
    this.addRowData({ data: data });
    this.reloaddata = true; // Đặt lại trạng thái reloaddata để tải lại dữ liệu
  }

  this.addRowData = function ({ data }) {
    //kiểm tra nếu dữ liệu có keyfield thì thêm vào tableobject.datas
    if (data[this.keyfield]) {
      //this.addData({ data: data });
      const tr = this.genRowData({ data: data });
      const tbody = this.tableelement.querySelector('tbody.row-datas');
      //gán vào dòng đầu tiên của tbody
      const firstRow = tbody.querySelector('tr');
      if (this.addnewfirst === true && firstRow) {
        tbody.insertBefore(tr, firstRow);
        this.resetSysNo();
      } else {
        tbody.appendChild(tr);
      }
    }
  }

  //thêm dữ liệu vào tableobject.datas
  this.addData = function ({ data }) {
    // nếu addnewfirst true thì thêm vào đầu mảng
    if (this.addnewfirst === true) {
      this.datas.unshift(data);
    } else {
      this.datas.push(data);
    }
  }

  //cập nhật lại giao diện của dòng dữ liệu trong bảng
  this.updateRowData = function ({ data }) {
    const tr = this.genRowData({ data: data });
    //tìm kiếm tr trong tbody theo data[tableobject.keyfield]
    const tbody = this.tableelement.querySelector('tbody.row-datas');
    const existingRow = tbody.querySelector(`tr[data-id="${data[this.keyfield]}"]`);
    if (existingRow) {
      existingRow.replaceWith(tr);
    } else {
      tbody.appendChild(tr);
    }
  };

  //hàm onChangeRowData để thay đổi dữ liệu trong bảng
  this.onChangeRowData = function ({ data }) {
    this.updateData({ data: data });
    this.updateRowData({ data: data });
  };

  //hàm onChangeRow khi tr mất focus và có thay đổi dữ liệu
  this.onChangeRow = async function ({ tr, data } = {}) {
    //phân biệt loại tr là row-data hay row-new-data hay row-add
    if (tr.classList.contains('row-new-data')) {
      await this.onChangeRowNew({ tr: tr, data: data });
      return;
    }
    if (tr.classList.contains('row-add')) {
      await this.onChangeRowAdd({ tr: tr, data: data });
      return;
    }

    //nếu chứa class edited thì cập nhật lên server
    if (tr.classList.contains('edited') && tr.classList.contains('row-data')) {
      // console.log('onChangeRowEdit:', tr, data);
      const tableobject = this;
      if (!this.editrow || this.readonly) {
        // senapp.window.toast({ message: 'Bạn không có quyền sửa dòng này', type: 'danger' });
        senapp.window.toast({ message: 'You do not have permission to edit this row', type: 'danger' });
        return;
      }
      //nếu data rỗng thì lấy data từ tableobject.datas theo keyfield
      if (!data) {
        const keyvalue = tr.getAttribute('data-id');
        data = tableobject.datas.find(item => item[tableobject.keyfield] == keyvalue);
      }

      //đồng bộ lên server
      const response = await tableobject.synData({ data: data, type: 'edit' });
      //xóa class callout-danger trong row
      tableobject.clearErrorsRow({ row: tr });
      if (response.status == 'false' || response.status == 0) {
        //cập nhật có lỗi
        tableobject.mapErrorsRow({ row: tr, errors: response.errors, message: response.message });
        //senapp.window.toast({ message: response.message || 'Lỗi cập nhật dữ liệu!', type: 'danger' });
      }
      else {
        tr.classList.remove('edited'); // Xóa class edited nếu đồng bộ thành công
        //this.refreshRowDisplayByData({ data: response.data });
        // //nếu cần thiết thì redraw lại dòng dữ liệu
        // if (tableobject.redrawonchange) {
        //   tableobject.updateRowData({ data: data });
        // }
      }
    }
  }

  //cập nhật dữ liệu trong tableobject.datas
  this.updateData = function ({ data }) {
    //tìm trong datas của tableobject dữ liệu có keyfield trùng với data[tableobject.keyfield] thì update dữ liệu đó
    const index = this.datas.findIndex(item => item[this.keyfield] === data[this.keyfield]);
    if (index !== -1) {
      //cập nhật dữ liệu tại index đó
      this.datas[index] = data;
    }
  };

  //hàm genRowDataLoadMore
  this.genRowDataLoadMore = function ({ page = 1, pagesize = 10, totalpages = 1, total = 0 } = {}) {
    const rowmore = total - (page) * pagesize;
    const tableobject = this;
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = tableobject.metacolumns.length;
    const a = document.createElement('a');


    td.style.textAlign = "center";
    a.href = "javascript:void(0);";
    a.className = "btn btn-link w-100";
    a.textContent = `Load More (${rowmore})`;
    a.onclick = async function (e) {
      e.preventDefault();
      if (tableobject.loadmoreshowtoast) { senapp.window.toast({ message: `Load More (${rowmore})`, type: 'info', duration: 250, container: tableobject.container }); }
      tr.remove();
      await tableobject.loadData({ page: page + 1 });
    };
    td.appendChild(a);
    tr.appendChild(td);
    if (this.loadmoreonvisible === true) {
      this.observer.observe(a); // Thêm observer để theo dõi sự kiện click
    }
    return tr;
  }

  this.loadData = async function ({ page = 1 } = {}) {

    //nếu this.urldata.lists không tồn tại thì thoát
    if (!this.urldata || !this.urldata.lists) return;

    if (this.reloaddata === true) {
      this.clearRowData(); // Xóa dữ liệu cũ trước khi tải lại
      page = 1; // Đặt lại trang về 1
      this.reloaddata = false; // Đặt lại trạng thái reloaddata
    }

    const tableobject = this;
    const sort = this.getSortFields();
    const filter = this.filter;
    const url = new URL(this.urldata.lists, window.location.origin);
    url.searchParams.set("page", page);
    url.searchParams.set("sortfield", sort.sortfield);
    url.searchParams.set("sorttype", sort.sorttype);
    url.searchParams.set("filter", JSON.stringify(filter));
    const urldata = url.toString();

    senapp.window.loading.show(tableobject.tableelement.parentElement);
    try {
      const resdata = await senapp.data.getServerData({ url: urldata });
      // xử lý dữ liệu ở đây
      senapp.data.parseDataFromServer({ datas: resdata.datas, meta: tableobject.meta });
      //gán dữ liệu cho tableobject.datas
      tableobject.datas.push(...resdata.datas);

      const tbody = tableobject.tableelement.querySelector('tbody.row-datas');
      resdata.datas.forEach(data => {
        const tr = tableobject.genRowData({ data: data });
        tbody.appendChild(tr);
      });

      if (resdata.page < resdata.totalpages) {
        const tr = this.genRowDataLoadMore({ page: resdata.page, pagesize: resdata.pagesize, totalpages: resdata.totalpages, total: resdata.total });
        tbody.appendChild(tr);
      }

      senapp.window.loading.hide(tableobject.tableelement.parentElement);
    } catch (err) {
      console.error(err);
      // alert("Error loading data");
      senapp.window.loading.hide(tableobject.tableelement.parentElement);
    }
  };

  this.loadDataCurrent = async function ({ datas } = {}) {
    if (!datas) { datas = this.datas; }
    const tableobject = this;
    senapp.window.loading.show(tableobject.tableelement.parentElement);
    try {
      //gán dữ liệu cho tableobject.datas
      tableobject.datas = datas;
      const tbody = tableobject.tableelement.querySelector('tbody.row-datas');
      datas.forEach(data => {
        const tr = tableobject.genRowData({ data: data });
        tbody.appendChild(tr);
      });
      senapp.window.loading.hide(tableobject.tableelement.parentElement);
    } catch (err) {
      console.error(err);
      // alert("Error loading data");
      senapp.window.loading.hide(tableobject.tableelement.parentElement);
    }
  };

  //#endregion

  //#region server

  //đồng bộ dữ liệu với server
  this.synData = async function ({ data, type, mode } = {}) {
    //type = 'create' | 'edit'| 'delete' (nếu để trống căn cứ vào data có keyfield hay không để xác định (nếu giá trị keyfield tồn tại và >0 thì là edit, ngược lại là create))
    if (!type) { type = data[this.keyfield] && data[this.keyfield] > 0 ? 'edit' : 'add'; }
    const tableobject = this;
    switch (type) {
      case 'add':
        if (!tableobject.urldata || !tableobject.urldata.create) {
          console.warn(`URL for create is not defined.`);
        }
        else {
          const url = new URL(tableobject.urldata.create, window.location.origin);
          if (mode) { url.searchParams.append('mode', mode); }
          return await senapp.data.synServer({ url: url, data: data, meta: tableobject.meta });
        }
      case 'edit':
        if (!tableobject.urldata || !tableobject.urldata.edit) {
          console.warn(`URL for edit is not defined.`);
        }
        else {
          const url = new URL(tableobject.urldata.edit, window.location.origin);
          if (mode) { url.searchParams.append('mode', mode); }
          return await senapp.data.synServer({ url: url, data: data, meta: tableobject.meta });
        }
      case 'delete':
        if (!tableobject.urldata || !tableobject.urldata.delete) {
          console.warn(`URL for delete is not defined.`);
        }
        else {
          const url = new URL(`${tableobject.urldata.delete}${tableobject.deletepara(data)}`, window.location.origin);
          if (mode) { url.searchParams.append('mode', mode); }
          return await senapp.data.synServer({ url: url, data: data, meta: tableobject.meta });
        }
      default:
        console.warn(`Invalid type: ${type}`);
    }

    return { status: 0, message: 'Error in synData', data: {}, errors: {} };

    // //type = 'create' | 'edit'| 'delete' (nếu để trống căn cứ vào data có keyfield hay không để xác định (nếu giá trị keyfield tồn tại và >0 thì là edit, ngược lại là create))
    // if (!type) { type = data[this.keyfield] && data[this.keyfield] > 0 ? 'edit' : 'add'; }
    // const tableobject = this;
    // const datapost = Object.assign({}, data); //clone data để tránh thay đổi dữ liệu gốc
    // //chuyển các trường ngày tháng về dạng chuỗi theo định dạng yyyy-MM-dd hoặc yyyy-MM-dd HH:mm:ss
    // tableobject.meta.forEach(meta => { datapost[meta.field] = senapp.data.parseValueForPost(datapost[meta.field], meta); });

    // let resdata = { status: 1, message: 'completed', data: {}, errors: {} };
    // switch (type) {
    //   case 'add':
    //     if (!tableobject.urldata || !tableobject.urldata.create) {
    //       console.warn(`URL for create is not defined.`);
    //     }
    //     else {
    //       try {
    //         const response = await fetch(tableobject.urldata.create, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datapost) });
    //         resdata = await response.json();
    //       } catch (error) {
    //         console.error(`Error in synData: ${error}`);
    //         resdata = { status: 0, message: error.message || 'Error in synData', data: {}, errors: {} };
    //       }
    //       return resdata;
    //     }
    //     break;
    //   case 'edit':
    //     if (!tableobject.urldata || !tableobject.urldata.edit) {
    //       console.warn(`URL for edit is not defined.`);
    //     }
    //     else {
    //       try {
    //         const response = await fetch(tableobject.urldata.edit, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datapost) });
    //         resdata = await response.json();
    //       } catch (error) {
    //         console.error(`Error in synData: ${error}`);
    //         resdata = { status: 0, message: error.message || 'Error in synData', data: {}, errors: {} };
    //       }
    //       return resdata;
    //     }
    //     break;
    //   case 'delete':
    //     if (!tableobject.urldata || !tableobject.urldata.delete) {
    //       console.warn(`URL for delete is not defined.`);
    //       return;
    //     }
    //     else {
    //       try {
    //         const response = await fetch(`${tableobject.urldata.delete}${tableobject.deletepara(datapost)}`, { method: 'POST' });
    //         resdata = await response.json();
    //       } catch (error) {
    //         console.error(`Error in synData: ${error}`);
    //         resdata = { status: 0, message: error.message || 'Error in synData', data: {}, errors: {} };
    //       }
    //       return resdata;
    //     }
    //     break;
    //   default:
    //     console.warn(`Invalid type: ${type}`);
    //     return;
    // }

  };

  //#endregion server

  //#region utilities

  //đồng bộ dữ liệu xóa với server
  this.synDeleteDatas = async function ({ deleteonsuccess = true } = {}) {
    if (!this.deleterow || this.readonly) {
      // senapp.window.toast({ message: 'Bạn không có quyền xóa dòng này', type: 'danger' });
      console.warn('You do not have permission to delete rows.');
      senapp.window.toast({ message: 'You do not have permission to delete this row', type: 'danger' });
      return;
    }
    const tableobject = this;
    //lấy deletedDatas từ datadeleteds có keyfield > 0
    const deletedDatas = this.datadeleteds.filter(item => item[tableobject.keyfield] && item[tableobject.keyfield] > 0);
    if (deletedDatas.length === 0) { return; }
    //xóa từng dòng dữ liệu
    for (const data of deletedDatas) {
      const response = await tableobject.synData({ data: data, type: 'delete' });
      if (response.status == 'false' || response.status == 0) {
        console.warn('Error deleting data:', response.message);
        senapp.window.toast({ message: response.message || 'Error deleting data!', type: 'danger' });
        continue;
      }
      //xóa dữ liệu khỏi datadeleteds
      if (deleteonsuccess) {
        const index = tableobject.datadeleteds.findIndex(item => item[tableobject.keyfield] === data[tableobject.keyfield]);
        if (index !== -1) { tableobject.datadeleteds.splice(index, 1); }
      }
    }
  }

  //xóa errors trên dòng
  this.clearErrorsRow = function ({ row }) {
    //xóa class callout-danger trong row
    row.classList.remove('callout-danger');
    row.removeAttribute('title');
    //xóa định dạng lỗi trong trong tất cả các td
    const tds = row.querySelectorAll('td');
    tds.forEach(td => {
      td.classList.remove('cell-danger');
      //xóa cell title
      td.removeAttribute('title');
    });
  }

  //map errors vào dòng
  this.mapErrorsRow = function ({ row, errors = {}, message = '' } = {}) {
    const tds = row.querySelectorAll('td');
    //cập nhật có lỗi
    tds.forEach(td => {
      if (td.dataset.field && errors[td.dataset.field]) {
        td.classList.add('cell-danger');
        td.setAttribute('title', errors[td.dataset.field]);
      }
    });
    row.classList.add('callout-danger');
    row.setAttribute('title', message);
  }

  this.getDataSelected = function () {
    //trả về mảng các dữ liệu được chọn trong bảng
    const tableobject = this;
    const selectedRows = [];
    const tbody = this.tableelement.querySelector('tbody.row-datas');
    const checkboxes = tbody.querySelectorAll('td[data-field="SysSelect"] input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
      const row = checkbox.closest('tr');
      if (row) {
        const keyField = tableobject.metacolumns.find(m => m.field === tableobject.keyfield);
        const rowData = tableobject.datas.find(data => data[tableobject.keyfield] === senapp.data.parseValue(checkbox.value, keyField));
        if (rowData) { selectedRows.push(rowData); }
      }
    });
    return selectedRows;
  };

  this.getKeySelected = function () {
    //trả về mảng các khóa của dữ liệu được chọn trong bảng
    const tableobject = this;
    const selectedKeys = [];
    const tbody = this.tableelement.querySelector('tbody.row-datas');
    const checkboxes = tbody.querySelectorAll('td[data-field="SysSelect"] input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
      const row = checkbox.closest('tr');
      if (row) {
        const keyField = tableobject.metacolumns.find(m => m.field === tableobject.keyfield);
        const keyData = senapp.data.parseValue(checkbox.value, keyField);
        if (keyData) { selectedKeys.push(keyData); }
      }
    });
    return selectedKeys;
  };

  //#region excel
  this.export2Excel = function () {
    if (!this.allowexport2excel) {
      console.warn('Export to Excel is not allowed.');
      return;
    }
    const tableobject = this;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Lấy dữ liệu từ bảng
    const data = tableobject.datas || [];
    const excludeFields = ['SysNo', 'SysSelect', 'SysAction'];
    // Tạo tiêu đề cột từ meta sắp xếp theo thứ tự order và chỉ lấy các cột có visible = true và show = true 
    const metacolumns = tableobject.metacolumns
      .filter(m => m.visible === true && m.show === true && !excludeFields.includes(m.field))
      .sort((a, b) => a.colorder - b.colorder);

    const header = metacolumns.map(m => m.description);

    // Thêm tiêu đề cột
    worksheet.addRow(header);
    // Thêm dữ liệu vào worksheet
    data.forEach(row => {
      const rowData = metacolumns.map(m => {
        //nếu m.field nằm trong customcolumns thì xử lí riêng
        if (tableobject.customcolumns && tableobject.customcolumns.includes(m.field)) {
          const td = tableobject.genCellData({ data: row, metacolumn: m });
          return td.textContent; // Trả về nội dung HTML cho các cột tùy chỉnh
        }

        let value = row[m.field];
        // Định dạng ngày tháng
        if (m.type === 'date' && value) { value = new Date(value).toLocaleDateString(); }
        //ngày giờ
        if (m.type === 'datetime' && value) { value = new Date(value).toLocaleString(); }
        // Định dạng số
        if (m.type === 'number' && value !== undefined && value !== null) { value = Number(value); }
        // Định dạng boolean
        if (m.type === 'boolean') { value = value ? 'Yes' : 'No'; }
        //trường hợp của optionlist nếu m.data tồn tại thì map label để xuất
        if (m.data && Array.isArray(m.data)) {
          const option = m.data.find(opt => opt.id === value);
          value = option ? option.label : value;
        }
        return value;
      });
      worksheet.addRow(rowData);
    });

    // Tải file Excel
    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, 'data.xlsx');
    });
  }
  // Hàm parse (Excel) -> mảng 2D, xử lý cả dấu xuống dòng trong cell
  this.parseExcel = function (str) {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const next = str[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          cell += '"'; // dấu "" thành "
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === '\t' && !inQuotes) {
        row.push(cell);
        cell = "";
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (cell !== "" || row.length > 0) {
          row.push(cell);
          rows.push(row);
          row = [];
          cell = "";
        }
        if (char === '\r' && next === '\n') i++; // bỏ qua \r\n
      } else {
        cell += char;
      }
    }

    if (cell !== "" || row.length > 0) {
      row.push(cell);
      rows.push(row);
    }

    return rows;
  }

  //#endregion excel

  this.parseValueKey = function (value) {
    const keymeta = this.meta.find(m => m.key === true);
    return senapp.data.parseValue(value, keymeta);
  };

  this.getRowByKey = function (key) {
    //lấy tr trong this.tableelement có chứa class row-add, row-new-data, row-data theo data-id bằng key
    return this.tableelement.querySelector(
      `thead > tr.row-add[data-id="${key}"], tbody.row-new-datas > tr.row-new-data[data-id="${key}"], tbody.row-datas > tr.row-data[data-id="${key}"]`
    );
    //return this.tableelement.querySelector(`tbody.row-datas> tr[data-id="${key}"]`);
  };

  this.getRowNewByKey = function (key) {
    return this.tableelement.querySelector(`tbody.row-new-datas> tr[data-id="${key}"]`);
  };

  this.getCellByRow = function ({ row, field } = {}) {
    if (!row || !field) return null;
    return row.querySelector(`td[data-field="${field}"]`);
  }

  this.setValue4Cell = function ({ cell, data } = {}) {
    const tableobject = this;
    //gọi gencell của tableobject
    if (data) {
      const column = tableobject.metacolumns.find(m => m.field === cell.getAttribute("data-field"));
      let td = null;
      const classesToCheck = ['row-add', 'row-new-data', 'row-data'];
      //kiểm tra bao gồm vị trí cls trong classesToCheck
      classesToCheck.forEach(cls => {
        if (cell.parentElement.classList.contains(cls)) {
          //vị trí thứ tự cls trong classesToCheck
          const index = classesToCheck.indexOf(cls);
          switch (index) {
            case 0:
            case 1:
              td = tableobject.genCellNewData({ data: data, metacolumn: column, typemode: cls });
              break;
            case 2:
              td = tableobject.genCellData({ data: data, metacolumn: column, typemode: cls });
              break;
          }
        }
      });

      if (td) {
        // cell.innerHTML = td.innerHTML;
        // Di chuyển tất cả node con của td sang cell
        cell.innerHTML = ''; // Xóa nội dung hiện tại của cell
        while (td.firstChild) {
          cell.appendChild(td.firstChild);
        }
        // cell = td;
      }
    }
  }

  //làm mới hiển thị dữ liệu trong table 
  this.refreshDataDisplay = function () {
    this.changeRowFilter({ meta: this.meta });
  }

  //làm mới hiển thị tr  của table
  this.refreshRowDisplay = function ({ row, data }) {
    if (!row) return;
    const cells = row.querySelectorAll('td');
    cells.forEach(cell => {
      const field = cell.getAttribute('data-field');
      if (field) { this.setValue4Cell({ cell, data }); }
    });
  }

  //làm mới hiển thị tr của table theo data 
  this.refreshRowDisplayByData = function ({ data }) {
    if (!data) return;
    const row = this.getRowByKey(data[this.keyfield]);
    if (row) { this.refreshRowDisplay({ row, data }); }
  }

  //làm mới hiển thị td của table theo data và field
  this.refreshCellDisplayByData = function ({ data, fields }) {
    if (!data || !fields) return;
    const row = this.getRowByKey(data[this.keyfield]);
    if (row) {
      fields.forEach(field => {
        const cell = this.getCellByRow({ row, field });
        if (cell) {
          this.setValue4Cell({ cell, data });
        }
      });
    }
  }


  this.cardview = function ({ datas, viewmode = 'offcanvas' } = {}) {
    if (!datas || datas.length === 0) datas = this.datas;
    const tableobject = this;
    const metacolumns = tableobject.metacolumns;
    const excludeFields = ['SysNo', 'SysSelect', 'SysAction'];
    //tạo bảng có 2 cột
    const columns = metacolumns.filter(col => col.visible === true && !excludeFields.includes(col.field)).slice();
    //tạo thẻ table với class table
    const table = document.createElement('table');
    table.classList.add('table');
    datas.forEach((data, index) => {
      const tbody = document.createElement('tbody');
      //<tr class="table-secondary"><td colspan="4">Nhóm A</td></tr>
      //tạo dòng làm header
      const headerRow = document.createElement('tr');
      const headerCell = document.createElement('td');
      headerCell.colSpan = 3;
      headerCell.innerHTML = `<b>#${index + 1}</b>`;
      headerRow.appendChild(headerCell);
      tbody.appendChild(headerRow);

      //chỉ lấy columns có visible = true để hiển thị
      columns.forEach((col, index) => {
        const tr = document.createElement('tr');
        const tdnumber = document.createElement('td');
        tdnumber.textContent = index + 1;

        const td1 = document.createElement('td');
        td1.textContent = col.description || '';
        // const td2 = document.createElement('td');
        // td2.textContent = senapp.data.stringifyValue(data[col.field], col);
        const metacolumn = JSON.parse(JSON.stringify(col));//20250930
        metacolumn.readonly = true;//20250930

        const td2 = tableobject.genCellData({ data: data, metacolumn: metacolumn });
        //remove class d-none của td2 nếu có
        td2.classList.remove('d-none');

        tr.appendChild(tdnumber);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
    });

    //tạo thẻ div
    const div = document.createElement('div');
    div.classList.add('table-responsive');
    div.appendChild(table);
    if (viewmode == 'offcanvas') {
      senapp.window.offcanvas({ title: `Card`, contentel: div });
      return;
    }

    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('p-3');
    card.appendChild(div);
    senapp.window.modal({ title: `Card`, contentel: card, size: 'lg' });
  }

  // https://chatgpt.com/c/6938f1f8-b178-8320-b4a1-701a3d981c6c
  this.filterData = function (source, conditions = {}) {
    return source.filter(item => {
      return Object.keys(conditions).every(key => {
        const condValue = conditions[key];

        // Nếu điều kiện null/undefined/'' thì bỏ qua
        if (condValue === null || condValue === undefined || condValue === '') {
          return true;
        }

        // Nếu là function: cho phép tự custom điều kiện
        if (typeof condValue === 'function') {
          return condValue(item[key]);
        }

        // Mặc định so sánh bằng
        return item[key] === condValue;
      });
    });
  }

  this.lookupparam = function ({ lookup, data }) {
    return `pagesize=${lookup.pagesize || 0}&filter=${encodeURIComponent(JSON.stringify(lookup.filter))}`;
  }


  this.initUtils = function () {
    //khởi tạo table navigator
    this.tablenavigator = new senapp.utils.tablenavigator(this.tableelement, {
      meta: this.meta,
      tableobject: this,
      regiondatas: [this.datanew, this.datanews, this.datas],
      regions: [
        this.tableelement.querySelector("thead"),
        this.tableelement.querySelector("tbody:nth-of-type(1)"),
        this.tableelement.querySelector("tbody:nth-of-type(2)")
      ]
    });
    // //khởi tạo kéo rê chuột thì kéo thanh cuộn theo
    // new senapp.utils.dragscroll(this.tableelement.closest('.table-responsive'), { axis: 'x', multiplier: 1 });
  }

  this.formatHeader = function () {
    if (this.allowformatheader !== true || this.readonly === true) return;
    //gán định dạng tiêu đề cột được phép sửa
    const headers = this.container.querySelectorAll('th');
    headers.forEach(th => {
      const field = th.getAttribute('data-field');
      const metacolumn = this.metacolumns.find(col => col.field === field);
      if (metacolumn) {
        const isEditable = metacolumn.readonly !== true;// metacolumn.edit;
        if (isEditable) {
          th.classList.add('text-primary');
        }
      }
    });
  }

  this.pinHeader = function () {
    if (this.allowpinheader !== true) return;
    //ghim header
    const tableobject = this;
    const gridcontainer = $(tableobject.tableelement).closest('div');
    //tìm trong thead tìm tr có class row-header thì lấy chiều cao của nó để tính toán chiều cao khi ghim
    const headerrow = $(tableobject.tableelement).find('thead tr.row-header');
    const headerheight = $(headerrow).outerHeight();
    $(headerrow).addClass('pin-header');
    if ($(gridcontainer).css("max-height") == "none") //nếu chưa giới hạn chiều cao thì giới hạn
    {
      const h = "calc(100vh - " + headerheight + "px - 10vh)";
      // const h = "calc(100vh - " + (headerheight + 200).toString() + "px)";
      $(gridcontainer).css("max-height", h);
      //$(gridcontainer).slimScroll({ height: h });//làm đẹp nhưng ảnh hưởng trải nghiệm
    }
    else //nếu đã giới hạn thì bỏ giới hạn
    {
      $(gridcontainer).css("max-height", "none");
    }
  }


  //#endregion
}

senapp.utils.tablenavigator = class {
  constructor(tableSelector, options = {}) {
    this.table = tableSelector;
    if (!this.table) return;

    // vùng điều hướng (mặc định: tbody đầu)
    this.regions = options.regions || [this.table.querySelector("tbody")];

    //meta
    this.meta = options.meta || {};
    //data cho từng vùng
    this.regiondatas = options.regiondatas || [];
    //đối tượng tableobject
    this.tableobject = options.tableobject || {};

    this.makeCellsFocusable();
    this.bindEvents();
  }

  // Gắn tabindex cho các cell trong từng vùng
  makeCellsFocusable() {
    this.regions.forEach(region => {
      region.querySelectorAll("td:not(.no-focus), th:not(.no-focus)")
        .forEach(cell => cell.setAttribute("tabindex", "0"));
    });
  }

  bindEvents() {
    const tableobject = this.tableobject;
    // Điều hướng & bật edit (ngoài input)
    this.table.addEventListener("keydown", (e) => {
      // nếu đang ở trong input editor → bỏ qua (đã xử lý riêng)
      if (e.target && e.target.classList && e.target.classList.contains("cell-editor")) return;

      const current = document.activeElement;
      if (!current || !["TD", "TH"].includes(current.tagName)) return;

      const { region, rowIndex, colIndex } = this.getRegionPosition(current);
      let targetCell = null;

      switch (e.key) {
        // case "v":
        // case "V":
        //   if (e.ctrlKey) {
        //     e.preventDefault();
        //     e.stopPropagation();
        //     // xử lý Ctrl+V tại đây
        //     // ví dụ: lấy dữ liệu clipboard
        //     navigator.clipboard.readText().then((clipText) => {
        //       console.log("Clipboard:", clipText);
        //       // có thể đưa thẳng vào startEdit cell
        //       this.startEdit(current, clipText);
        //     }).catch(err => {
        //       console.error("Clipboard read failed:", err);
        //     });
        //     return;
        //   }
        //   break;
        case "ArrowRight":
          e.preventDefault();
          //ngăn ảnh hưởng của tab trên đối tượng table lồng nhau
          e.stopPropagation();
          if (e.ctrlKey) {
            //di chuyển về ô cuối cùng
            targetCell = this.findLastFocusCell(current.parentElement);
          }
          else {
            targetCell = this.findNextVisibleCell(current.parentElement, colIndex, 1);
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          //ngăn ảnh hưởng của tab trên đối tượng table lồng nhau
          e.stopPropagation();
          if (e.ctrlKey) {
            //di chuyển về ô đầu tiên
            targetCell = this.findFirstFocusCell(current.parentElement);
          }
          else {
            targetCell = this.findNextVisibleCell(current.parentElement, colIndex, -1);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          //ngăn ảnh hưởng của tab trên đối tượng table lồng nhau
          e.stopPropagation();
          targetCell = this.findCellInOtherRow(region, rowIndex + 1, colIndex, 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          //ngăn ảnh hưởng của tab trên đối tượng table lồng nhau
          e.stopPropagation();
          targetCell = this.findCellInOtherRow(region, rowIndex - 1, colIndex, -1);
          break;
        //nếu nhấn home
        case "Home":
          e.preventDefault();
          //ngăn ảnh hưởng của tab trên đối tượng table lồng nhau
          e.stopPropagation();
          targetCell = this.findFirstFocusCell(current.parentElement);
          break;
        //nếu nhấn end
        case "End":
          e.preventDefault();
          //ngăn ảnh hưởng của tab trên đối tượng table lồng nhau
          e.stopPropagation();
          targetCell = this.findLastFocusCell(current.parentElement);
          break;
        case "Enter":
          // Enter ở TD → mở edit
          e.preventDefault();
          //ngăn ảnh hưởng của tab trên đối tượng table lồng nhau
          e.stopPropagation();
          this.startEdit(current);
          return;
        case "Tab":
          // Tab trong vùng, có vòng lặp
          e.preventDefault();
          //ngăn ảnh hưởng của tab trên đối tượng table lồng nhau
          e.stopPropagation();
          targetCell = this.moveByTabLoop(current, !e.shiftKey);
          break;
        case "F3":
          if (this.tableobject.actionbuttons.savenews == true) {
            e.preventDefault();
            //ngăn ảnh hưởng của tab trên đối tượng table lồng nhau
            e.stopPropagation();
            // console.log('F4 pressed - custom action can be implemented here.', region);
            //nếu region là THEAD thì thêm dòng mới
            if (region.tagName === 'THEAD') {
              this.tableobject.saveNews(); // Thêm dòng mới
            }
            else if (region.tagName === 'TBODY' && region.classList.contains('row-new-datas')) {
              this.tableobject.saveNews();
            }
          }
          break;
        case "F4":
          e.preventDefault();
          //ngăn ảnh hưởng của tab trên đối tượng table lồng nhau
          e.stopPropagation();
          // console.log('F4 pressed - custom action can be implemented here.', region);
          //nếu region là THEAD thì thêm dòng mới
          if (region.tagName === 'THEAD') {
            this.tableobject.onAddRowNewData(); // Thêm dòng mới
          }
          else if (region.tagName === 'TBODY' && region.classList.contains('row-new-datas')) {
            this.tableobject.onAddRowNewData();
          }
          break;
        case "F8":
          e.preventDefault();
          //ngăn ảnh hưởng của tab trên đối tượng table lồng nhau
          e.stopPropagation();
          // console.log('F8 pressed - custom action can be implemented here.', region);
          //nếu là TBODY và chứa class row-new-datas
          if (region.tagName === 'TBODY' && region.classList.contains('row-new-datas')) {
            const { region, rowIndex, colIndex } = this.getRegionPosition(current);
            const step = e.shiftKey ? -1 : 1; // Shift+Enter = lên
            const nextCell = this.findCellInOtherRow(region, rowIndex + step, colIndex, step);
            //this.finishEdit(current, input.value, false);
            //xóa dòng hiện tại
            const row = current.closest("tr");
            this.tableobject.newDelete(row);
            if (nextCell) { nextCell.focus(); }
            else {
              const PrevCell = this.findCellInOtherRow(region, rowIndex - 1, colIndex, -1);
              if (PrevCell) PrevCell.focus();
            }
          }
          break;
        default:
          // gõ ký tự thường → mở edit, khởi tạo bằng ký tự đó
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            //ngăn ảnh hưởng của tab trên đối tượng table lồng nhau
            e.stopPropagation();
            this.startEdit(current, e.key);
            return;
          }
      }
      if (targetCell) targetCell.focus();
    });

    //bắt copy dán từ excel
    this.table.addEventListener("paste", async function (e) {
      // nếu đang ở trong input editor → bỏ qua (đã xử lý riêng)
      if (e.target && e.target.classList && e.target.classList.contains("cell-editor")) return;
      const current = document.activeElement;
      if (!current || !["TD", "TH"].includes(current.tagName)) return;
      e.preventDefault();
      //ngăn ảnh hưởng của tab trên đối tượng table lồng nhau
      e.stopPropagation();
      const clipboardData = e.clipboardData || window.clipboardData;
      const text = clipboardData.getData("text/plain");
      // Parse dữ liệu (hỗ trợ xuống dòng trong cell)
      const datas = tableobject.parseExcel(text);
      //nếu data rỗng thì bỏ qua
      if (!datas || datas.length === 0) return;
      //lấy các cột đang hiển thị (visible = true và show = true)
      const visibleColumns = tableobject.metacolumns.filter(m => m.show === true).sort((a, b) => a.colorder - b.colorder).map(m => m.field);
      const fieldStart = current.getAttribute('data-field');
      const startColIndex = visibleColumns.indexOf(fieldStart);
      if (startColIndex === -1) return; //nếu không tìm thấy cột bắt đầu thì bỏ qua
      //xóa các cột nhỏ hơn startColIndex và chỉ lấy số cột < hơn hoặc bằng các cột trong data[0]
      //nếu data[0].length + startColIndex > visibleColumns.length thì lấy đến hết
      //ngược lại lấy từ startColIndex đến startColIndex + data[0].length -1
      const visibleColumnsToUse = visibleColumns.slice(startColIndex, startColIndex + datas[0].length);
      //chuyển đỗi dữ liệu trong datas theo visibleColumnsToUse trong các trường hợp checkbox, select
      //lấy ra các cột có kiểu là checkbox và select trong visibleColumnsToUse
      datas.forEach(row => {
        visibleColumnsToUse.forEach((col, index) => {
          const fieldMeta = tableobject.metacolumns.find(m => m.field === col);
          if (fieldMeta && fieldMeta.inputtype === 'checkbox') {
            const val = row[index].toString().toLowerCase();
            row[index] = (val === 'true' || val === '1' || val === 'yes' || val === 'on') ? true : false;
          }
          //nếu fieldMeta có kiểu là select thì kiểm tra row[index] có nằm trong fieldMeta.data không
          if (fieldMeta && fieldMeta.inputtype === 'select' && fieldMeta.data && Array.isArray(fieldMeta.data)) {
            const option = fieldMeta.data.find(opt => opt.label == row[index]);
            if (option) {
              row[index] = option.id;
            }
            else {
              row[index] = ''; //nếu không tìm thấy thì gán trống (hoặc có thể giữ nguyên giá trị dán vào tùy yêu cầu)
            }
          }
        });
      });
      //kiểm tra xem dòng được dán vào thuộc loại nào (row-add, row-new-data, row-data)
      const classesToCheck = ['row-add', 'row-new-data', 'row-data'];
      let rowType = null;
      classesToCheck.forEach(cls => {
        if (current.parentElement.classList.contains(cls)) {
          rowType = cls;
        }
      });
      console.log('rowType:', rowType);
      if (!rowType) return; //nếu không xác định được loại dòng thì bỏ qua
      //nếu rowType == row-add thì thêm mới dòng mới vào datanews
      if (rowType === 'row-add') {
        //cho vòng lặp thêm từng dòng trong data vào datanews
        datas.forEach(data => {
          //gán lại datanew với data tương ứng các cột visibleColumnsToUse
          visibleColumnsToUse.forEach((col, index) => {
            const fieldMeta = tableobject.metacolumns.find(m => m.field === col);
            //nếu tableobject.datanew có field tên col thì gán giá trị đã chuyển đổi
            if (tableobject.datanew && col in tableobject.datanew) tableobject.datanew[col] = senapp.data.parseValue(data[index], fieldMeta);
          });
          tableobject.onAddRowNewData();
        });
        //render lại dòng thêm mới với dữ liệu mới (không render từng dòng vì tối ưu hiệu năng)
        tableobject.refreshRowDisplayByData({ data: tableobject.datanew });
      }
      // if (rowType === 'row-new-data') {
      else if (rowType === 'row-new-data') {
        //tìm vị trí của current trong datanews
        const keyField = tableobject.metacolumns.find(m => m.key === true);
        const keyValue = senapp.data.parseValue(current.parentElement.getAttribute('data-id'), keyField); //giá trị khóa của dòng hiện tại
        const data = tableobject.datanews.find(d => d[tableobject.keyfield] === keyValue);
        if (!data) return;  //nếu không tìm thấy data tương ứng thì bỏ qua
        //tìm vị trí dòng thứ bao nhiêu trong datanews và gán giá trị tương ứng trong datas nếu datas.length + vị trí dòng hiện tại < datanews.length nếu lớn hơn thì thêm mới vào datanews
        //nếu datas.length + vị trí dòng hiện tại > datanews.length thì chỉ lấy số dòng còn lại trong datanews để gán giá trị
        //nếu datas.length + vị trí dòng hiện tại <= datanews.length thì lấy hết datas để gán giá trị vào datanews
        //nếu datas.length + vị trí dòng hiện tại > datanews.length thì thêm mới các dòng còn lại vào datanews
        //nếu datas.length + vị trí dòng hiện tại <= datanews.length thì chỉ gán giá trị vào datanews
        //lấy vị trí của data trong datanews
        //  const rowIndexInDataNews = tableobject.datanews.indexOf(data);  
        const rowIndexInDataNews = tableobject.datanews.indexOf(data);
        console.log('rowIndexInDataNews:', rowIndexInDataNews);
        //nếu rowIndexInDataNews = -1 thì bỏ qua
        if (rowIndexInDataNews === -1) return;
        //nếu datas.length + rowIndexInDataNews > tableobject.datanews.length thì chỉ lấy số dòng còn lại trong datanews để gán giá trị
        const rowsToUpdate = Math.min(datas.length, tableobject.datanews.length - rowIndexInDataNews);
        console.log('rowsToUpdate:', rowsToUpdate);
        for (let i = 0; i < rowsToUpdate; i++) {
          const data = datas[i];
          const targetData = tableobject.datanews[rowIndexInDataNews + i];
          // Gán giá trị từ rowData vào targetData
          visibleColumnsToUse.forEach((col, index) => {
            const fieldMeta = tableobject.metacolumns.find(m => m.field === col);
            //nếu tableobject.datanew có field tên col thì gán giá trị đã chuyển đổi
            if (targetData && col in targetData) targetData[col] = senapp.data.parseValue(data[index], fieldMeta);
          });
          //render từng dòng đã cập nhật
          tableobject.refreshRowDisplayByData({ data: targetData });
        }
        //nếu datas.length + rowIndexInDataNews > tableobject.datanews.length thì thêm mới các dòng còn lại vào datanews
        if (datas.length + rowIndexInDataNews > tableobject.datanews.length) {
          for (let i = rowsToUpdate; i < datas.length; i++) {
            const data = datas[i];
            //gán lại datanew với data tương ứng các cột visibleColumnsToUse
            visibleColumnsToUse.forEach((col, index) => {
              const fieldMeta = tableobject.metacolumns.find(m => m.field === col);
              //nếu tableobject.datanew có field tên col thì gán giá trị đã chuyển đổi
              if (tableobject.datanew && col in tableobject.datanew) tableobject.datanew[col] = senapp.data.parseValue(data[index], fieldMeta);
            });
            tableobject.onAddRowNewData();
          }
          //render lại dòng thêm mới với dữ liệu mới (không render từng dòng vì tối ưu hiệu năng)
          tableobject.refreshRowDisplayByData({ data: tableobject.datanew });
        }
      }
      // if (rowType === 'row-data') {
      else if (rowType === 'row-data') {
        //tìm vị trí của current trong datanews
        const keyField = tableobject.metacolumns.find(m => m.key === true);
        const keyValue = senapp.data.parseValue(current.parentElement.getAttribute('data-id'), keyField); //giá trị khóa của dòng hiện tại
        const data = tableobject.datas.find(d => d[tableobject.keyfield] === keyValue);
        if (!data) return;  //nếu không tìm thấy data tương ứng thì bỏ qua
        const rowIndexInDatas = tableobject.datas.indexOf(data);
        console.log('rowIndexInDatas:', rowIndexInDatas);
        //nếu rowIndexInDatas = -1 thì bỏ qua
        if (rowIndexInDatas === -1) return;
        //nếu datas.length + rowIndexInDatas > tableobject.datas.length thì chỉ lấy số dòng còn lại trong datas để gán giá trị
        const rowsToUpdate = Math.min(datas.length, tableobject.datas.length - rowIndexInDatas);
        console.log('rowsToUpdate:', rowsToUpdate);
        for (let i = 0; i < rowsToUpdate; i++) {
          const data = datas[i];
          const targetData = tableobject.datas[rowIndexInDatas + i];
          // Gán giá trị từ rowData vào targetData
          visibleColumnsToUse.forEach((col, index) => {
            const fieldMeta = tableobject.metacolumns.find(m => m.field === col);
            //nếu tableobject.datas có field tên col thì gán giá trị đã chuyển đổi
            if (targetData && col in targetData) targetData[col] = senapp.data.parseValue(data[index], fieldMeta);
          });
          //render từng dòng đã cập nhật
          tableobject.refreshRowDisplayByData({ data: targetData });
          //cập nhật dữ liệu đã thay đổi
          const tr = tableobject.getRowByKey(targetData[tableobject.keyfield]);
          //thêm lớp edited vào tr
          tr.classList.add('edited');
          //gọi onChangeRow
          await tableobject.onChangeRow({ tr: tr, data: targetData });
        }
        // //nếu datas.length + rowIndexInDatas > tableobject.datanews.length thì thêm mới các dòng còn lại vào datanews
        // if (datas.length + rowIndexInDatas > tableobject.datanews.length) {
        //   for (let i = rowsToUpdate; i < datas.length; i++) {
        //     const data = datas[i];
        //     //gán lại datanew với data tương ứng các cột visibleColumnsToUse
        //     visibleColumnsToUse.forEach((col, index) => {
        //       const fieldMeta = tableobject.metacolumns.find(m => m.field === col);
        //       //nếu tableobject.datanew có field tên col thì gán giá trị đã chuyển đổi
        //       if (tableobject.datanew && col in tableobject.datanew) tableobject.datanew[col] = senapp.data.parseValue(data[index], fieldMeta);
        //     });
        //     tableobject.onAddRowNewData();
        //   }
        //   //render lại dòng thêm mới với dữ liệu mới (không render từng dòng vì tối ưu hiệu năng)
        //   tableobject.refreshRowDisplayByData({ data: tableobject.datanew });
        // }
      }

    });

    // dblclick mở edit
    this.table.addEventListener("dblclick", (e) => {
      //nếu đối tượng có thuộc tính tabindex
      if (["TD", "TH"].includes(e.target.tagName) && e.target.hasAttribute("tabindex")) {
        this.startEdit(e.target);
      }
      else {
        //nếu là TD thì select nội dung nó
        if (e.target.tagName === "TD") {
          const range = document.createRange();
          range.selectNodeContents(e.target);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }

    });
  }

  // Lấy vị trí trong region
  getRegionPosition(cell) {
    const row = cell.parentElement;
    const region = this.regions.find(r => r.contains(row));
    if (!region) return {};
    const rows = Array.from(region.rows);
    const rowIndex = rows.indexOf(row);
    const cells = Array.from(row.cells);
    const colIndex = cells.indexOf(cell);
    return { region, rowIndex, colIndex };
  }

  // Lấy cell focusable trong 1 region (không xuyên vùng)
  getAllFocusableCells(region) {

    // //20250916
    // giải pháp cũ lấy hết con nên sẽ xung đột với các table lồng nhau
    // const list = Array.from(region.querySelectorAll("td[tabindex], th[tabindex]"));
    // //20250916
    //chỉ lấy td và th trực tiếp con của tr
    const list = Array.from(region.querySelectorAll("tr > td[tabindex], tr > th[tabindex]"));
    return list.filter(c => this.isVisible(c));
  }

  // Tab có vòng lặp TRONG VÙNG
  moveByTabLoop(currentCell, forward = true) {
    const { region } = this.getRegionPosition(currentCell);
    if (!region) return null;
    const list = this.getAllFocusableCells(region);
    const idx = list.indexOf(currentCell);
    if (idx === -1 || list.length === 0) return null;
    const next = (idx + (forward ? 1 : -1) + list.length) % list.length;
    //tìm vị trí của currentCell trong list
    const currentIndex = list.indexOf(currentCell);
    //nếu vị trí next ==0 và vị trí currentIndex = list.length - 1 thì quay về đầu
    if (next === 0 && currentIndex === list.length - 1) {
      // console.log('Quay về đầu vùng từ ô cuối', region, region.tagName);
      if (region.tagName === 'THEAD') {
        this.tableobject.onAddRowNewData(); // Thêm dòng mới
      }
      else if (region.tagName === 'TBODY' && region.classList.contains('row-new-datas')) {
        this.tableobject.onAddRowNewData(); // Thêm dòng mới
        //quay lại vị trí đầu của dòng thêm mới này
        return this.getAllFocusableCells(region)[list.length];
      }
    }

    return list[next];
  }

  // Bắt đầu edit; firstChar: ký tự người dùng gõ để khởi tạo
  startEdit(cell, firstChar = null) {
    //nếu cell có chưa class editable = false thì không cho edit
    if (!cell.classList.contains('editable')) return;

    const tablenavigatorobject = this;
    const tableobject = this.tableobject;
    const metacolumn = tableobject.metacolumns.find(m => m.field === cell.getAttribute("data-field"));
    //nếu là loại checkbox thì xử lí riêng
    if (firstChar && metacolumn.inputtype === 'checkbox') {
      //console.log('Enter pressed - edit mode started.', firstChar);
      //tìm checkbox trong cell
      const checkbox = cell.querySelector('input[type="checkbox"]');
      if (checkbox) { checkbox.click(); }
      return;
    }

    if (cell.querySelector("input.cell-editor")) return;
    //const oldValue = cell.textContent;//nội dung từ cell
    //nếu là trường khóa thì giải pháp là không cho phép chỉnh sửa (nếu có nhu cầu khác thì chỉnh sau)
    if (metacolumn.key) { return; }
    const oldValue = this.getValueByCell(cell);//nội dung từ data
    const value = firstChar !== null ? senapp.data.parseValue(firstChar.trim(), metacolumn) || '' : oldValue;
    // lưu old vào cả cell (để finish so sánh) và input (phòng hờ)
    cell.setAttribute("data-old", oldValue);
    cell.textContent = "";
    let input = document.createElement("input");
    //input.type = "text";
    //tùy loại trong metacolumn.type mà tạo input.type khác nhau
    switch (metacolumn.type) {
      case "bigint":
      case "int":
      case "numeric":
      case "number":
        input.type = "number";
        input.step = senapp.utils.getStepFromDec(metacolumn.dec);
        break;
      case "datetime":
        input.type = "datetime-local";
        break;
      case "date":
        input.type = "date";
        break;
      case "boolean":
      case "bool":

        //tạo select
        const select = document.createElement("select");
        [{ id: true, value: true, label: "True" }, { id: false, value: false, label: "False" }].forEach(option => {
          const opt = document.createElement("option");
          opt.value = option.value;
          opt.textContent = option.label;
          select.appendChild(opt);
          //nếu option được chọn thì đánh dấu
          if (value === option.value) { opt.selected = true; }
        });
        input = select;
        // //input.type = "checkbox";
        // //nếu inputtype = checkbox thì tạo checkbox
        // if (metacolumn.inputtype && metacolumn.inputtype === 'checkbox') {
        //   // input = document.createElement("input");
        //   // input.type = "checkbox";
        //   // input.checked = value === true; //nếu value là true thì checked
        //   console.log('Chuyển thành checkbox:', firstChar);
        //   //tìm checkbox trong cell
        //   const checkbox = cell.querySelector('input[type="checkbox"]');
        //   if (checkbox) { checkbox.focus(); }
        //   return;
        // }
        break;
      case "text":
        input = document.createElement("textarea");
        input.style.width = "100%";
        //input.type = "textarea";
        break;
      default:
        //nếu metacolumn.lookup tồn tại thì tạo select
        if (metacolumn.lookup) {
          //input = document.createElement("select");

          const select = document.createElement("select");
          if (metacolumn.lookup.multiple) {
            select.multiple = true;
          }
          //gán giá trị vào input
          senapp.utils.data2input({ fieldmeta: metacolumn, value: value, input: select });

          const choices = senapp.utils.lookup(select, {
            itemSelectText: '',     // Ẩn "Press to select"
            noChoicesText: '',      // Ẩn "No choices to choose from"
            removeItemButton: true,
            searchEnabled: true,
            searchChoices: false
          })
          const lookup = metacolumn.lookup;
          select.addEventListener('search', async function (e) {
            const keyword = e.detail.value;
            if (!keyword.endsWith(' ')) return;
            const trimmed = keyword.trim();
            lookup.filter.conditions[0].value = trimmed;
            try {
              const data = tablenavigatorobject.getDataByCell(cell);
              const paramStr = tableobject.lookupparam({ lookup: lookup, data: data });// `pagesize=${lookup.pagesize || 0}&filter=${encodeURIComponent(JSON.stringify(lookup.filter))}`;
              const res = await fetch(`${lookup.url}?${paramStr}`);
              lookup.data = [];
              if (res.ok) {
                const data = await res.json();
                lookup.data = data.datas.map(item => ({ id: eval(lookup.fields.id), value: eval(lookup.fields.value), label: eval(lookup.fields.label) }));
              }
            } catch (err) { console.error('Lỗi khi gọi API:', err); }
            choices.setChoices(lookup.data, 'value', 'label', true);
          });

          if (lookup.searchwheninit) {
            // Gọi event search khi khởi tạo
            select.dispatchEvent(new CustomEvent('search', {
              detail: { value: ' ' } // Thêm dấu cách để pass qua điều kiện endsWith(' ')
            }));
          }

          input = choices.containerOuter.element; // Lấy input từ choices
          input.classList.add("cell-editor");
          input.setAttribute("data-old", oldValue);
          cell.appendChild(input);
          choices.showDropdown();
          choices.input.element.focus();
          //khi input mất focus
          input.addEventListener("focusout", (e) => {
            // e.relatedTarget = phần tử sẽ nhận focus tiếp theo
            if (!input.contains(e.relatedTarget)) {
              //console.log("Parent thật sự mất focus!");
              if (!input.isConnected) return;
              let selectvalue;
              //nếu multiple thì lấy giá trị của các option được chọn
              if (select.multiple) {
                selectvalue = Array.from(select.selectedOptions).map(option => option.value).join(',');
              } else {
                selectvalue = select.value;
              }

              this.finishEdit(cell, selectvalue, false);
              cell.focus();

            } else {
              //console.log("Chỉ chuyển focus sang phần tử con, không tính");
            }
          });

          // phím trong input
          input.addEventListener("keydown", async (e) => {
            // chặn bubble để Enter không dội lên table
            const stop = () => { e.preventDefault(); e.stopPropagation(); };

            if (e.key === "Enter") {
              // Enter hoặc Shift+Enter: lưu và di chuyển lên/xuống cùng cột TRONG VÙNG
              stop();
              const { region, rowIndex, colIndex } = this.getRegionPosition(cell);
              const step = e.shiftKey ? -1 : 1; // Shift+Enter = lên
              const nextCell = this.findCellInOtherRow(region, rowIndex + step, colIndex, step);
              let selectvalue;
              //nếu multiple thì lấy giá trị của các option được chọn
              if (select.multiple) {
                selectvalue = Array.from(select.selectedOptions).map(option => option.value).join(',');
              } else {
                selectvalue = select.value;
              }
              this.finishEdit(cell, selectvalue, false);
              if (nextCell) {
                await tableobject.onChangeRow({ tr: cell.parentElement });
                nextCell.focus();
              }
              else cell.focus(); // không có ô kế tiếp → giữ nguyên
            } else if (e.key === "Escape") {
              stop();
              this.finishEdit(cell, input.getAttribute("data-old"), true); // hủy về giá trị cũ & refocus cell
            } else if (e.key === "Tab") {
              // Tab/Shift+Tab: lưu và qua trái/phải TRONG VÙNG
              stop();
              // const forward = !e.shiftKey;
              // const nextCell = this.moveByTabLoop(cell, forward);
              let selectvalue;
              //nếu multiple thì lấy giá trị của các option được chọn
              if (select.multiple) {
                selectvalue = Array.from(select.selectedOptions).map(option => option.value).join(',');
              } else {
                selectvalue = select.value;
              }

              this.finishEdit(cell, selectvalue, false);
              const forward = !e.shiftKey;
              const nextCell = this.moveByTabLoop(cell, forward);
              // if (nextCell) nextCell.focus(); else cell.focus();
              if (nextCell) {
                //nếu nextCell không thuộc tr hiện tại thì gọi onChangeRow
                if (nextCell.parentElement !== cell.parentElement) {
                  await tableobject.onChangeRow({ tr: cell.parentElement });
                }
                nextCell.focus();
              } else {
                cell.focus();
              }
            }
          });

          //xử lí giao diện xung đột khi hiển thị lookup trong table nằm trong class table-responsive
          const tableResponsive = cell.closest('.table-responsive');
          if (tableResponsive) { tableResponsive.style.setProperty('overflow-x', 'clip'); }

          return;

        } else {
          if (metacolumn.data && Array.isArray(metacolumn.data)) {
            //tạo select
            const select = document.createElement("select");
            select.multiple = metacolumn.multiple || false;
            metacolumn.data.forEach(option => {
              const opt = document.createElement("option");
              opt.value = option.value;
              opt.textContent = option.label;
              select.appendChild(opt);
              //nếu option được chọn thì đánh dấu
              if (Array.isArray(value) ? value.includes(option.value) : value === option.value) {
                opt.selected = true;
              }
            });
            input = select;
          } else {
            input.type = "text";
            //if input is text set width 100%
            input.style.width = "100%";
          }
        }
    }
    input.className = "cell-editor";//ưu điểm là khi cột ngắn nó tự dài ra cho phù hợp
    // input.className = "cell-editor form-control";//khi cần thiết mở ra nó sẽ không bị co ra vào ảnh hưởng độ dài cột


    //gán giá trị vào input
    senapp.utils.data2input({ fieldmeta: metacolumn, value: value, input: input });
    //input.value = firstChar !== null ? firstChar.trim() : oldValue;
    input.setAttribute("data-old", oldValue);
    cell.appendChild(input);

    input.focus();
    if (firstChar === null && (!['SELECT', 'DIV'].includes(input.tagName))) input.select();

    // blur → lưu & giữ focus cell
    input.addEventListener("blur", () => {
      if (!input.isConnected) return;
      this.finishEdit(cell, input.value, false);
      cell.focus();
    }, { once: true });

    if (input.tagName === 'TEXTAREA') {
      //textarea
      input.addEventListener("keydown", async (e) => {
        // chặn bubble để Enter không dội lên table
        const stop = () => { e.preventDefault(); e.stopPropagation(); };
        if (e.key === "Enter" && !e.ctrlKey) {
          // Enter hoặc Shift+Enter: lưu và di chuyển lên/xuống cùng cột TRONG VÙNG
          stop();
          const { region, rowIndex, colIndex } = this.getRegionPosition(cell);
          const step = e.shiftKey ? -1 : 1; // Shift+Enter = lên
          const nextCell = this.findCellInOtherRow(region, rowIndex + step, colIndex, step);
          this.finishEdit(cell, input.value, false);
          if (nextCell) {
            await tableobject.onChangeRow({ tr: cell.parentElement });
            nextCell.focus();
          }
          else cell.focus(); // không có ô kế tiếp → giữ nguyên


        } else if (e.key === "Escape") {
          stop();
          this.finishEdit(cell, input.getAttribute("data-old"), true); // hủy về giá trị cũ & refocus cell
        } else if (e.key === "Tab") {
          // Tab/Shift+Tab: lưu và qua trái/phải TRONG VÙNG
          stop();
          // const forward = !e.shiftKey;
          // const nextCell = this.moveByTabLoop(cell, forward);
          this.finishEdit(cell, input.value, false);
          const forward = !e.shiftKey;
          const nextCell = this.moveByTabLoop(cell, forward);
          if (nextCell) {
            //nếu nextCell không thuộc tr hiện tại thì gọi onChangeRow
            if (nextCell.parentElement !== cell.parentElement) {
              await tableobject.onChangeRow({ tr: cell.parentElement });
            }
            nextCell.focus();
          } else {
            cell.focus();
          }
        } else if (e.key === "Enter" && e.ctrlKey) {
          stop();
          const pos = input.selectionStart;
          const text = input.value;
          input.value = text.slice(0, pos) + "\n" + text.slice(pos);
          input.selectionStart = input.selectionEnd = pos + 1;
        }
      });
    } else {
      // phím trong input
      input.addEventListener("keydown", async (e) => {
        // chặn bubble để Enter không dội lên table
        const stop = () => { e.preventDefault(); e.stopPropagation(); };
        if (e.key === "Enter") {
          // Enter hoặc Shift+Enter: lưu và di chuyển lên/xuống cùng cột TRONG VÙNG
          stop();
          const { region, rowIndex, colIndex } = this.getRegionPosition(cell);
          const step = e.shiftKey ? -1 : 1; // Shift+Enter = lên
          const nextCell = this.findCellInOtherRow(region, rowIndex + step, colIndex, step);
          this.finishEdit(cell, input.value, false);
          if (nextCell) {
            await tableobject.onChangeRow({ tr: cell.parentElement });
            nextCell.focus();
          }
          else cell.focus(); // không có ô kế tiếp → giữ nguyên
        } else if (e.key === "Escape") {
          stop();
          this.finishEdit(cell, input.getAttribute("data-old"), true); // hủy về giá trị cũ & refocus cell
        } else if (e.key === "Tab") {
          // Tab/Shift+Tab: lưu và qua trái/phải TRONG VÙNG
          stop();
          // const forward = !e.shiftKey;
          // const nextCell = this.moveByTabLoop(cell, forward);
          this.finishEdit(cell, input.value, false);
          const forward = !e.shiftKey;
          const nextCell = this.moveByTabLoop(cell, forward);
          if (nextCell) {
            //nếu nextCell không thuộc tr hiện tại thì gọi onChangeRow
            if (nextCell.parentElement !== cell.parentElement) {
              console.log('Gọi onChangeRow do chuyển vùng:', nextCell, nextCell.parentElement, cell.parentElement);
              await tableobject.onChangeRow({ tr: cell.parentElement });
            }
            nextCell.focus();
          } else {
            cell.focus();
          }
        }
      });
    }

  }

  // Kết thúc edit
  finishEdit(cell, value, refocus = true) {
    //gán giá trị mới vào data
    this.setValueByCell(cell, value);
    const old = cell.getAttribute("data-old");
    cell.textContent = value; // an toàn (không innerHTML)
    this.setValue4Cell(cell); // cập nhật lại giao diện của cell từ dữ liệu trong bảng

    cell.setAttribute("tabindex", "0");
    if (refocus) cell.focus();

    // phát sự kiện nếu thay đổi
    if (old !== null && value !== old) {
      cell.dispatchEvent(new CustomEvent("cellchange", {
        bubbles: true,
        detail: { oldValue: old, newValue: value, cell }
      }));
    }

    //xử lí giao diện xung đột khi hiển thị lookup trong table nằm trong class table-responsive
    const tableResponsive = cell.closest('.table-responsive');
    if (tableResponsive) {
      //xóa thuộc tính overflowX đã thêm trước đó
      tableResponsive.style.removeProperty('overflow-x');
    }
  }

  // Tìm ô kế tiếp trên cùng hàng (bỏ qua ô ẩn và ô không được tabbable)
  findNextVisibleCell(rowElement, startCol, step) {
    const cells = Array.from(rowElement.cells);
    for (let i = startCol + step; i >= 0 && i < cells.length; i += step) {
      if (this.isVisible(cells[i]) && this.isTabbableCell(cells[i])) return cells[i];
    }
    return null;
  }
  //tìm ô đầu tiên trên cùng hàng (bỏ qua ô ẩn) 
  findFirstFocusCell(rowElement) {
    const cells = Array.from(rowElement.cells);
    for (let i = 0; i < cells.length; i++) {
      if (this.isVisible(cells[i]) && this.isTabbableCell(cells[i])) return cells[i];
    }
    return null;
  }
  //tìm ô sau cùng trên cùng hàng (bỏ qua ô ẩn)
  findLastFocusCell(rowElement) {
    const cells = Array.from(rowElement.cells);
    for (let i = cells.length - 1; i >= 0; i--) {
      if (this.isVisible(cells[i]) && this.isTabbableCell(cells[i])) return cells[i];
    }
    return null;
  }

  // // Tìm ô cùng cột tại hàng khác TRONG VÙNG
  // findCellInOtherRow(region, rowIndex, colIndex, step) {
  //   for (let r = rowIndex; r >= 0 && r < region.rows.length; r += step) {
  //     const row = region.rows[r];
  //     const cell = row.cells[colIndex];
  //     if (cell && this.isVisible(cell)) return cell;
  //   }
  //   return null;
  // }

  // Tìm ô cùng cột tại hàng khác, cho phép xuyên vùng (vượt qua các region)
  findCellInOtherRow(region, rowIndex, colIndex, step) {
    // Tìm trong region hiện tại
    for (let r = rowIndex; r >= 0 && r < region.rows.length; r += step) {
      const row = region.rows[r];
      const cell = row.cells[colIndex];
      if (cell && this.isVisible(cell) && this.isEditableRow(row)) return cell;
      // if (cell && this.isVisible(cell)) return cell;
    }
    // Nếu không tìm thấy, thử sang region tiếp theo (hoặc trước đó) theo hướng step
    const regionIdx = this.regions.indexOf(region);
    let nextRegionIdx = step > 0 ? regionIdx + 1 : regionIdx - 1;

    // while (nextRegionIdx >= 0 && nextRegionIdx < this.regions.length && !(this.regions[nextRegionIdx].tagName === "TBODY" && this.regions[nextRegionIdx].classList.contains("row-datas"))) {
    while (nextRegionIdx >= 0 && nextRegionIdx < this.regions.length) {
      //nếu vùng là THEAD hoặc vùng là TBODY với class row-data-news thì mới xuyên vùng
      const nextRegion = this.regions[nextRegionIdx];
      const rows = Array.from(nextRegion.rows);
      // console.log('Tìm kiếm trong region:', nextRegion, rows);
      if (rows.length > 0) {
        // Thay vì chỉ kiểm tra hàng đầu/cuối, quét qua tất cả các hàng trong region mới
        // theo thứ tự phù hợp với hướng di chuyển (từ đầu đến cuối hoặc từ cuối lên đầu)
        const startIdx = step > 0 ? 0 : rows.length - 1;
        const endIdx = step > 0 ? rows.length : -1;
        for (let r = startIdx; step > 0 ? r < endIdx : r > endIdx; r += step) {
          if (rows[r] && rows[r].cells[colIndex] && this.isVisible(rows[r].cells[colIndex]) && this.isEditableRow(rows[r])) {
            return rows[r].cells[colIndex];
          }
        }
      }
      // Tiếp tục sang region tiếp theo
      nextRegionIdx += step > 0 ? 1 : -1;
    }

    return null;
  }

  // Cell được xem là visible?
  isVisible(cell) {
    const cs = getComputedStyle(cell);
    return cs.display !== "none" && cs.visibility !== "hidden" && cell.offsetParent !== null;
  }

  // Cell được phép tab
  isTabbableCell(cell) {
    const tabindex = cell.getAttribute("tabindex") || "-1";
    return tabindex !== "-1";
  }

  //Row cho phép chỉnh sửa gồm class row-add hoặc row-data-new  
  isEditableRow(rowElement) {
    // return rowElement.classList.contains("row-add") || rowElement.classList.contains("row-new-data");
    return rowElement.classList.contains("row-add") || rowElement.classList.contains("row-new-data") || rowElement.classList.contains("row-data");
  }

  //#region custom
  //lấy vị trí region trong regions
  getRegionIndex(cell) {
    for (let i = 0; i < this.regions.length; i++) {
      if (this.regions[i].contains(cell)) {
        return i;
      }
    }
    return -1; // không tìm thấy
  }

  getValueByCell(cell) {
    //dùng nội dung từ region data
    const datas = this.regiondatas[this.getRegionIndex(cell)];
    const keyvalue = senapp.data.parseValue(cell.parentElement.getAttribute("data-id"), this.tableobject.metakey);
    //nếu data không phải là mảng
    const data = Array.isArray(datas) ? datas.find(d => d[this.tableobject.metakey.field] === keyvalue) : datas;
    return data[cell.getAttribute("data-field")];// || '';
  }

  setValueByCell(cell, value) {
    const datas = this.regiondatas[this.getRegionIndex(cell)];
    const keyvalue = senapp.data.parseValue(cell.parentElement.getAttribute("data-id"), this.tableobject.metakey);

    //nếu data không phải là mảng
    const data = Array.isArray(datas) ? datas.find(d => d[this.tableobject.metakey.field] === keyvalue) : datas;
    const metacolumn = this.tableobject.metacolumns.find(m => m.field === cell.getAttribute("data-field"));
    if (metacolumn.type == 'boolean' || metacolumn.type == 'bool') {
      data[cell.getAttribute("data-field")] = senapp.data.parseValue(value, metacolumn); // nếu là boolean thì gán false nếu không có giá trị
    }
    else {
      data[cell.getAttribute("data-field")] = senapp.data.parseValue(value, metacolumn);// || '';
    }

  }

  getDataByCell(cell) {
    //dùng nội dung từ region data
    const datas = this.regiondatas[this.getRegionIndex(cell)];
    const keyvalue = senapp.data.parseValue(cell.parentElement.getAttribute("data-id"), this.tableobject.metakey);
    //nếu data không phải là mảng
    const data = Array.isArray(datas) ? datas.find(d => d[this.tableobject.metakey.field] === keyvalue) : datas;
    return data || {};
  }

  setValue4Cell(cell) {
    //gọi gencell của tableobject
    const data = this.getDataByCell(cell);
    if (data) {
      const column = this.tableobject.metacolumns.find(m => m.field === cell.getAttribute("data-field"));
      let td = null;
      const classesToCheck = ['row-add', 'row-new-data', 'row-data'];
      //kiểm tra bao gồm vị trí cls trong classesToCheck
      classesToCheck.forEach(cls => {
        if (cell.parentElement.classList.contains(cls)) {
          //vị trí thứ tự cls trong classesToCheck
          const index = classesToCheck.indexOf(cls);
          switch (index) {
            case 0:
            case 1:
              td = this.tableobject.genCellNewData({ data: data, metacolumn: column, typemode: cls });
              break;
            case 2:
              td = this.tableobject.genCellData({ data: data, metacolumn: column, typemode: cls });
              break;
          }
        }
      });
      if (td) {
        // cell.innerHTML = td.innerHTML;
        // Di chuyển tất cả node con của td sang cell
        cell.innerHTML = ''; // Xóa nội dung hiện tại của cell
        while (td.firstChild) {
          cell.appendChild(td.firstChild);
        }
        // cell = td;
      }
    }
  }

  //#endregion custom
}

senapp.utils.dragscroll = class {
  constructor(container, options = {}) {
    if (!container) throw new Error('DragScroll: container không hợp lệ');
    this.el = container;
    this.opts = Object.assign({
      axis: 'x',
      multiplier: 1,
      ignoreSelector: 'a,button,input,textarea,select,label,.row-header' // thêm mặc định
    }, options);

    this._isDown = false;
    this._startX = 0;
    this._startY = 0;
    this._scrollLeft = 0;
    this._scrollTop = 0;
    this._downTime = 0;
    this._moved = false;

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);

    this.el.addEventListener('mousedown', this._onMouseDown, { passive: false });
    window.addEventListener('mousemove', this._onMouseMove, { passive: false });
    window.addEventListener('mouseup', this._onMouseUp, { passive: true });

    // Ngăn click vào td khi vừa kéo
    const dragScroll = this;
    container.addEventListener("click", function (e) {
      if (dragScroll.preventClick) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
  }

  destroy() {
    this.el.removeEventListener('mousedown', this._onMouseDown);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);
  }

  _shouldIgnore(target) {
    if (!this.opts.ignoreSelector) return false;
    return !!(target.closest && target.closest(this.opts.ignoreSelector));
  }

  _activate() {
    this._isDown = true;
    this._moved = false;
    this.el.classList.add('drag-scroll-active');
  }

  _deactivate() {
    this._isDown = false;
    this.el.classList.remove('drag-scroll-active');
  }

  _onMouseDown(e) {
    if (e.button !== 0) return;
    if (this._shouldIgnore(e.target)) return;

    // bỏ qua nếu nằm trong thead
    if (e.target.closest('.row-header')) return;

    this._activate();
    this._startX = e.pageX - this.el.offsetLeft;
    this._startY = e.pageY - this.el.offsetTop;
    this._scrollLeft = this.el.scrollLeft;
    this._scrollTop = this.el.scrollTop;
    this._downTime = Date.now();

    e.preventDefault();
  }

  _onMouseMove(e) {
    if (!this._isDown) return;
    const x = e.pageX - this.el.offsetLeft;
    const y = e.pageY - this.el.offsetTop;
    const walkX = (x - this._startX) * this.opts.multiplier;
    const walkY = (y - this._startY) * this.opts.multiplier;

    if (Math.abs(walkX) > 3 || Math.abs(walkY) > 3) {
      this._moved = true;
    }

    if (this.opts.axis === 'x' || this.opts.axis === 'both') {
      this.el.scrollLeft = this._scrollLeft - walkX;
    }
    if (this.opts.axis === 'y' || this.opts.axis === 'both') {
      this.el.scrollTop = this._scrollTop - walkY;
    }
  }

  _onMouseUp(e) {
    if (!this._isDown) return;
    const isClick = !this._moved && (Date.now() - this._downTime < 250);

    if (isClick && e.target.tagName === 'TD') {
      e.target.focus(); // focus vào td
    }
    this._deactivate();
  }
};

//#endregion table

//#region form
senapp.utils.form = function form(options) {
  const defaults = {
    container: null, // Khu vực chứa form
    formelement: null, // đối tượng form
    meta: {}, // Thông tin cấu trúc dữ liệu
    metacolumns: [], // danh sách các cột trong bảng
    data: {}, // Dữ liệu của form
    urldata: {}, // Dữ liệu URL để gửi đi
    keyfield: null, // Trường khóa chính
    mode: 'view' // Khởi tạo mode nếu chưa có (mode có thể là 'view', 'edit', 'create')
  };
  Object.assign(this, defaults, options);

  //nếu meta khác rỗng
  this.metakey = {}; //meta của trường key
  if (this.meta && this.meta.length > 0) {
    //nếu this.meta không có trường khóa thì tìm trường đầu tiên có key = true
    if (!this.keyfield) {
      this.keyfield = this.meta.find(m => m.key == true).field;//gán trường khóa để thuận tiện xử lý
      if (!this.keyfield) {
        this.keyfield = this.meta[0].field; // Gán trường đầu tiên nếu không có trường khóa
      }
    }
    if (this.keyfield) {
      this.metakey = this.meta.find(m => m.field === this.keyfield);
    }
    //trộn các trường meta vào metacolumns nếu có nếu trong metacolumns không có trường nào trùng với meta thì thêm vào
    this.meta.forEach(m => {
      //nếu metacolumns không có trường nào trùng với meta thì thêm vào
      if (!this.metacolumns.some(mc => mc.field === m.field)) {
        //nếu không có trường colorder thì gán colorder thứ tự trường trong meta
        m.colorder = m.colorder || this.metacolumns.length + 1;
        //sao chép m để tránh thay đổi meta gốc
        const newField = JSON.parse(JSON.stringify(m));
        this.metacolumns.push(newField);
      }
    });
  }

  //nếu formelement không được gán thì tìm trong container
  if (!this.formelement) {
    this.formelement = this.container.querySelector('form');
    if (!this.formelement) {
      console.error('Form element not found in container');
      return;
    }
  }

  this.saveBefore = async function () {
    return true;
  };

  this.save = async function () {
    const formobject = this;
    if (!(await this.saveBefore())) return;
    senapp.window.loading.show(this.container); // Hiển thị loading
    // Gửi dữ liệu đến server để cập nhật data
    //map dữ liệu từ form vào model
    senapp.utils.input2datas({ meta: this.meta, data: this.data, container: this.container });
    const url = this.urldata.path;
    const response = await senapp.data.synServer({ url: url, data: this.data, meta: this.meta });
    senapp.window.loading.hide(); // Ẩn loading

    if (!(await this.saveAfter(response))) return;

    if (response.status == 'false' || response.status == 0) {
      this.mapErrors(response);
    } else {
      //alert(response.message);
      //đóng modal nếu có
      const modal = formobject.container.closest('.modal');
      if (modal) {
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
      }
      else {
        //nếu có offcanvas thì đóng offcanvas
        const offcanvas = formobject.container.closest('.offcanvas');
        if (offcanvas) {
          const bootstrapOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
          bootstrapOffcanvas.hide();
        }
      }
      //nếu có callback thì gọi callback
      if (formobject.urldata.query.callback) {
        senapp.utils.executefunctionbyname(formobject.urldata.query.callback, window, [response]);
      }
    }

  };

  this.saveAfter = async function (response) {
    return true;
  };

  this.cancel = function () {
    //đóng modal nếu có
    const modal = this.container.closest('.modal');
    if (modal) {
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      bootstrapModal.hide();
    } else {
      //nếu có offcanvas thì đóng offcanvas
      const offcanvas = this.container.closest('.offcanvas');
      if (offcanvas) {
        const bootstrapOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
        bootstrapOffcanvas.hide();
      }
    }
    //nếu có callback thì gọi callback
    if (this.urldata.query.callback) {
      senapp.utils.executefunctionbyname(this.urldata.query.callback, window, []);
    }

  };

  this.onInputChange = async function ({ input, fieldmeta }) {
    // //trường hợp input là select có nhiều lựa chọn
    // if (input.tagName.toLowerCase() === 'select' && input.multiple) {
    //   //nếu là select nhiều lựa chọn thì lấy tất cả các lựa chọn đã chọn
    //   const selectedOptions = Array.from(input.selectedOptions);
    //   this.data[field] = selectedOptions.map(option => option.value);
    // } else {
    //   this.data[field] = input.value;
    // }

    //console.log(`Input changed: ${field}, ${input.value}`);

  };

  //hàm khởi tạo lookup gán vào choices
  this.initLookup = async function () {
    //quét meta có thuộc tính lookup rồi lấy field name ra lấy input có field name tương ứng
    const lookupMeta = this.meta.filter(field => field.lookup);
    lookupMeta.forEach(field => {
      //tìm input loại select có name tương ứng với field
      const input = this.container.querySelector(`[name='${field.field}']`);
      if (input) {
        //nếu input là select thì thêm các option từ lookup
        if (input.tagName.toLowerCase() === 'select') {
          const choices = senapp.utils.lookup(input, {
            itemSelectText: '',     // Ẩn "Press to select"
            noChoicesText: '',      // Ẩn "No choices to choose from"
            removeItemButton: true,
            searchEnabled: true,
            searchChoices: false
          })
          const lookup = field.lookup;
          input.addEventListener('search', async function (e) {
            const keyword = e.detail.value;
            if (!keyword.endsWith(' ')) return;
            const trimmed = keyword.trim();
            lookup.filter.conditions[0].value = trimmed;
            try {
              let url = `${lookup.url}?pagesize=${lookup.pagesize || 0}&filter=${JSON.stringify(lookup.filter)}`;
              //nếu url có chứa dấu ? thì bỏ dấu ?
              if (lookup.url.includes('?')) {
                url = `${lookup.url}&pagesize=${lookup.pagesize || 0}&filter=${JSON.stringify(lookup.filter)}`;
              }


              const res = await fetch(`${url}`);
              lookup.data = [];
              if (res.ok) {
                const data = await res.json();
                lookup.data = data.datas.map(item => ({ id: eval(lookup.fields.id), value: eval(lookup.fields.value), label: eval(lookup.fields.label) }));
              }
            } catch (err) { console.error('Lỗi khi gọi API:', err); }
            choices.setChoices(lookup.data, 'value', 'label', true);
          });
        }
      }
    });
  };

  this.initOptions = function () {
    const formobject = this;
    this.meta.map(item => {
      if (item.data) {
        //tìm input select
        const input = formobject.container.querySelector(`select[name="${item.field}"]`);
        if (input) {
          const selected = formobject.data[item.field];
          item.data.forEach(option => {
            //nếu tồn tại option có value = option.id thì xóa đối tượng option
            const existingOption = Array.from(input.options).find(opt => opt.value === option.id);
            if (existingOption) { input.removeChild(existingOption); }
            const opt = document.createElement('option');
            opt.value = option.id;
            opt.textContent = option.label;
            if (option.id === selected) { opt.selected = true; }
            input.appendChild(opt);
          });
        }
      }
    });
  }

  this.initForm = async function () {
    if (!this.formelement) {
      console.error('Form element is not defined');
      return;
    }
    //gán sự kiện submit cho form
    this.formelement.addEventListener('submit', (event) => {
      event.preventDefault(); // Ngăn chặn hành động mặc định của form
      this.save(); // Gọi hàm save khi submit
    });
    //gán meta vào label
    senapp.utils.meta2labels({ meta: this.meta, container: this.container });
    //map các trường nội dung vào input
    senapp.utils.data2inputs({ meta: this.meta, data: this.data, container: this.container });
    //gán readonly cho các trường khóa trong trường hợp edit
    if (this.mode == 'edit') {
      senapp.utils.meta2inputs({ meta: this.meta, container: this.container });
    }

    //gán input type number cho các trường số
    this.container.querySelectorAll('input[type="number"]').forEach(input => {
      if (input.step) return; //nếu đã có step thì bỏ qua
      const metacolumn = this.meta.find(m => m.field === input.name);
      if (metacolumn) {
        input.step = senapp.utils.getStepFromDec(metacolumn.dec);
      }
    });

    //khởi tạo lookup nếu có
    this.initLookup();
    //khởi tạo các lựa chọn cho select nếu có
    this.initOptions();

    //gán sự kiện change cho các input trong form có thuộc tính data-field
    this.container.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('change', async () => {
        //console.log('Input changed:', input);
        const fieldmeta = this.meta.find(m => m.field === input.name);
        if (fieldmeta) {
          await this.onInputChange({ input: input, fieldmeta: fieldmeta });
        }
      });
    });

    //focus vào trường đầu tiên
    const firstInput = this.container.querySelector('input, select, textarea');
    if (firstInput) {
      //nếu trường hợp là select
      if (firstInput.tagName.toLowerCase() === 'select' && firstInput.classList.contains('choices__input')) {
        //nếu là choices js
        setTimeout(() => {
          //nếu nằm trong modal thì focus vào trường đầu tiên
          if (this.container.closest('.modal')) {
            $(this.container).closest('.modal').off('shown.bs.modal').on('shown.bs.modal', function () {
              firstInput.closest('.choices').focus();
            });
          } else  //nếu không nằm trong modal thì focus vào trường đầu tiên
            firstInput.closest('.choices').focus();
        }, 0);
      }
      else {
        //nếu nằm trong modal thì focus vào trường đầu tiên
        if (this.container.closest('.modal')) {
          $(this.container).closest('.modal').off('shown.bs.modal').on('shown.bs.modal', function () {
            firstInput.focus();
          });
        } else  //nếu không nằm trong modal thì focus vào trường đầu tiên
          firstInput.focus();
      }
    }

    //gán giá trị vào thẻ p để hiển thị số liệu
    this.mapdata2display();

    //khởi tạo lại label nếu có thay đổi ngôn ngữ
    await senapp.utils.text.initLocaleLabels({ container: this.container });

  };

  //#region utils
  this.mapErrors = async function (response) {
    senapp.utils.errors2inputs({ errors: response.errors, container: this.container });
    //hiển thị thông báo chung vào class message-all
    const messageDiv = this.container.querySelector('.message-all');
    if (!messageDiv) {
      console.error('Message div not found');
      return;
    }
    messageDiv.textContent = response.message;
    messageDiv.classList.remove('d-none');
    messageDiv.classList.add('callout-danger');
  }
  //hàm gán giá trị vào cho thẻ p để hiển thị số liệu
  this.mapdata2display = function ({ data, metacolumns } = {}) {
    //senapp.data.stringifyValue(data[metacolumn.field], metacolumn);
    // Gán giá trị vào thẻ p tương ứng 
    const formobject = this;
    data = data || formobject.data;
    metacolumns = metacolumns || formobject.metacolumns;
    senapp.utils.data2displays({ data: data, metas: metacolumns, container: formobject.container });
    // metacolumns.forEach(metacolumn => {
    //   //tìm class sen-display có data-field tương ứng với metacolumn.field
    //   const displayElement = formobject.container.querySelector(`.sen-display[name="${metacolumn.field}"]`);
    //   const displayElementValue = senapp.data.stringifyValue(data[metacolumn.field], metacolumn);
    //   if (displayElement && displayElementValue) {
    //     displayElement.innerHTML = displayElementValue;
    //   }
    //   // const pElement = formobject.container.querySelector(`#contractlineperformreview-${metacolumn.field}`);
    //   // if (pElement) {
    //   //   // //console.log(metacolumn.field);
    //   //   pElement.innerHTML = senapp.data.stringifyValue(data[metacolumn.field], metacolumn) || '<div style="height:20px;"></div>';
    //   // }
    // });
  };


  //#endregion utils

}
//#endregion form


