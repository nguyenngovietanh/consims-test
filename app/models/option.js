// option.js
//thông tin chung ví dụ: danh sách giới tính, loại công việc,....

//danh sách giới tính
const sexlist = [
    { id: "", value: "", label: "" },
    { id: "Male", value: "Male", label: "Male" },
    { id: "Female", value: "Female", label: "Female" },

];

//Hàm lấy danh sách data với phân trang và sắp xếp
const getWorkingPlace = async ({ req, page = 1, pagesize = 10, sortFields = '', sortTypes = '', filterConditions = {} }) => {
    //   let keyword = '';
    //   //nếu filterConditions không là đối tượng rỗng thì thêm vào điều kiện lọc
    //   if (Object.keys(filterConditions).length > 0) {
    //     //nếu filterConditions.Conditions là mảng thì thêm vào điều kiện lọc
    //     if (Array.isArray(filterConditions.conditions)) {
    //       //tìm điều kiện trường searchTerm có thì gán nếu không thì cho =''
    //       const keywordCondition = filterConditions.conditions.find(cond => cond.field === 'searchTerm');
    //       //nếu keywordCondition có thì gán giá trị cho keyword
    //       if (keywordCondition) { keyword = keywordCondition.value; }
    //     }
    //   }

    const para = JSON.stringify({ "LogIn": req.session.user.username, "SessionId": req.session.sessionid });
    const url = `${req.app.locals.env.api.host}/api/get-workplace?params=${encodeURIComponent(para)}`;
    const response = await fetch(url);
    const data = await response.json();
    // xử lý tiếp
    if (data.Success !== 'true') { return null; }
    if (!data.Data || data.Data.length === 0) { return null; }

    //map trường trước khi return
    const mappedData = data.Data.map(item => ({
        id: item.WorkingPlace,
        value: item.WorkingPlace,
        label: item.WorkingPlace
    }));
    return mappedData;
};


module.exports = {
    sexlist,
    getWorkingPlace
};


