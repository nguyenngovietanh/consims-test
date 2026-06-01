const senserver = require("../models/senserver.js");
const datademo = require("../models/datademo");
const option = require("../models/option.js");

const login = async (req, res) => {
    const { username, password } = req.body;
    const para = JSON.stringify({
        "Email": username,
        "Password": password,
        "ClientId": req.app.locals.env.api.ClientId
    });
    const url = `${req.app.locals.env.api.host}/api/validate-user?params=${encodeURIComponent(para)}`;
    if (req.app.locals.env.mode !== "development" || true) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            // xử lý tiếp
            if (data.Success !== 'true') {
                res.locals.model = { error: `${data.Message}`, user: { username: username, password: password } };
                return res.render("pages/login", { layout: 'layout-authen', title: 'Login', isajax: senserver.utils.isajax({ req: req }) });
            }
            //gán session id
            req.session.sessionid = data.Data[0].SessionId;

        } catch (error) { return res.render(`pages/500`, { title: `Error 500`, message: `api error: ${error}`, layout: 'layout-authen' }); }
    }

    // Lưu user vào session
    req.session.user = { username: username, name: username, department: username };
    //map menu (sẽ lấy từ api sau này)

    //nếu trường hợp mode='development' thì lấy hết menu    
    if (req.app.locals.env.mode !== "development") {
        // req.session.menu = datademo.menus.filter(menu => menu.mode !== 'development');
        req.session.menu = datademo.menus.filter(menu => !menu.mode || menu.mode.indexOf(req.app.locals.env.mode) !== -1);
    }
    else {
        req.session.menu = datademo.menus;
    }

    //cho vòng lặp dịch menu
    for (let i = 0; i < req.session.menu.length; i++) {
        const menu = req.session.menu[i];
        menu.menuname = await senserver.utils.text.t({ req, text: menu.menuname });
    }

    res.redirect("/client/select");

    // res.redirect("/");
}
const register = async (req, res) => {
    const { username, password, confirmpassword, fullname } = req.body;
    if (!username || !password || !fullname) {
        //res.locals.flash("error", "Please fill all fields.");
        res.locals.model = { error: senserver.utils.text.t({ req, text: "Please fill all fields." }), username: username, fullname: fullname, password: password, confirmpassword: confirmpassword };
        return res.render("pages/register", { layout: 'layout-authen', title: senserver.utils.text.t({ req, text: 'Register' }) });
    }
    if (password !== confirmpassword) {
        //req.flash("error", "Passwords do not match.");
        res.locals.model = { error: senserver.utils.text.t({ req, text: "Passwords do not match." }), username: username, fullname: fullname, password: password, confirmpassword: confirmpassword };
        return res.render("pages/register", { layout: 'layout-authen', title: senserver.utils.text.t({ req, text: 'Register' }) });
    }
    // Giả sử đăng ký thành công, lưu thông tin người dùng vào session
    const para = JSON.stringify({
        "params": {
            "WSId": req.app.locals.env.api.WSId,
            "Email": username,
            "Password": password,
            "LoginName": username,
            "Phone": "",
            "FullName": fullname,
            "Address": "",
            "Sex": "",
            "Birthday": "",
            "IsActive": "No",
            "ClientId": req.app.locals.env.api.ClientId,
            "UpdateMode": "create_user"
        }
    });
    const url = `${req.app.locals.env.api.host}/api/upsert-user`;
    try {
        const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
        const data = await response.json();

        // xử lý tiếp
        if (data.Success !== 'true') {
            res.locals.model = { error: data.Message, username: username, fullname: fullname, password: password, confirmpassword: confirmpassword };
            return res.render("pages/register", { layout: 'layout-authen', title: senserver.utils.text.t({ req, text: 'Register' }) });
        }
        res.redirect("/");
    } catch (error) { return res.render(`pages/500`, { title: `Error 500`, message: `api error: ${error}`, layout: 'layout-authen' }); }
}

const profile = async (req, res) => {
    const data = req.body;
    res.locals.model.data = data;
    // const para = JSON.stringify({
    //     "params": {
    //         "WSId": req.app.locals.env.api.WSId,
    //         "UserId": data.UserId,
    //         "Email": req.session.user.username,
    //         "Phone": data.PhoneDirect,
    //         "FullName": data.FullName,
    //         "Address": data.Address,
    //         "Sex": data.Sex,
    //         "Birthday": data.BirthDay,
    //         "ClientId": req.app.locals.env.api.ClientId,
    //         "UpdateMode": "update_user_info"
    //     }
    // });

    const para = JSON.stringify({
        "params": {
            "SessionId": req.session.sessionid,
            "LogIn": req.session.user.username,
            "FullName": data.FullName,
            "Email": req.session.user.username,
            "PhoneDirect": data.PhoneDirect,
            "Sex": data.Sex,
            "BirthDay": data.BirthDay,
            "Address": data.Address,
            "UpdateMode": "update_user_info"
        }
    });

    const url = `${req.app.locals.env.api.host}/api/upsert-user`;
    const requestOptions = { method: "POST", headers: req.app.locals.env.api.headerpost, body: para, redirect: "follow" };
    try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        // xử lý tiếp
        if (data.Success !== 'true') { res.locals.model.error = data.Message; }
        else { res.locals.model.success = data.Message; }
        //lấy các tùy chọn 
        res.locals.model.sexlist = option.sexlist;
        res.render('pages/profile', {
            layout: 'layout',
            title: 'Profile'
        });
    } catch (error) { return res.render(`pages/500`, { title: `Error 500`, message: `api error: ${error}`, layout: 'layout-authen' }); }
}

const forgotpassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.locals.model = { error: "Please enter your email." };
        return res.render("pages/forgotpassword", { layout: 'layout-authen', title: 'Forgot Password' });
    }
    //gửi api
    // const para = JSON.stringify({
    //     "params": {
    //         "Email": email,
    //         "ClientId": req.app.locals.env.api.ClientId,
    //         "UpdateMode": "reset_password"
    //     }
    // });

    const para = JSON.stringify({
        "params": {
            "LogIn": email,
            "UpdateMode": "reset_password"
        }
    });

    const url = `${req.app.locals.env.api.host}/api/upsert-user`;
    const requestOptions = { method: "POST", headers: req.app.locals.env.api.headerpost, body: para, redirect: "follow" };
    try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        console.log(data);
        // Giả sử gửi email thành công
        res.locals.model = { message: "Password reset instructions have been sent to your email.", data: data };
        return res.render("pages/forgotpassword", { layout: 'layout-authen', title: 'Forgot Password' });
    } catch (error) { return res.render(`pages/500`, { title: `Error 500`, message: `api error: ${error}`, layout: 'layout-authen' }); }

}
const resetpassword = async (req, res) => {
    const { oldpassword, password, confirmpassword } = req.body;
    if (!password || !confirmpassword) {
        res.locals.model = { error: senserver.utils.text.t({ req, text: "Please fill all fields." }) };
        return res.render("pages/resetpassword", { layout: 'layout-authen', title: senserver.utils.text.t({ req, text: 'Reset Password' }) });
    }
    if (password !== confirmpassword) {
        res.locals.model = { error: senserver.utils.text.t({ req, text: "Passwords do not match." }) };
        return res.render("pages/resetpassword", { layout: 'layout-authen', title: senserver.utils.text.t({ req, text: 'Reset Password' }) });
    }
    // Giả sử reset mật khẩu thành công
    // const para = JSON.stringify({
    //     "params": {
    //         "Email": req.session.user.username,
    //         "OldPassword": oldpassword,
    //         "Password": password,
    //         "ClientId": req.app.locals.env.api.ClientId,
    //         "UpdateMode": "change_password"
    //     }
    // });

    const para = JSON.stringify({
        "params": {
            "SessionId": req.session.sessionid,
            "LogIn": req.session.user.username,
            "Email": req.session.user.username,
            "OldPassword": oldpassword,
            "Password": password,
            "UpdateMode": "change_password"
        }
    });


    const url = `${req.app.locals.env.api.host}/api/upsert-user`;
    const requestOptions = { method: "POST", headers: req.app.locals.env.api.headerpost, body: para, redirect: "follow" };
    try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data.Success !== 'true') {
            res.locals.model = { error: data.Message };
            return res.render("pages/resetpassword", { layout: 'layout-authen', title: senserver.utils.text.t({ req, text: 'Reset Password' }) });
        }
        res.redirect("/");
    } catch (error) { return res.render(`pages/500`, { title: `Error 500`, message: `api error: ${error}`, layout: 'layout-authen' }); }

    //res.redirect("/login");
}
const usermenu = async (req, res) => {
    if (!req.session.menu) { return res.status(404).json({ status: 1, message: "Menu not found" }); }
    res.json({ status: 0, message: 'completed' });
};

module.exports = { login, register, profile, resetpassword, forgotpassword, usermenu };

