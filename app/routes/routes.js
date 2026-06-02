const senserver = require("../models/senserver.js");
const express = require('express');
const route = express.Router();
const option = require("../models/option.js");
const senobjectcontroller = require("../controllers/senobjectcontroller.js");//dùng để phát triển các đối tượng mẫu
const senobjectlinecontroller = require("../controllers/senobjectlinecontroller.js");//dùng để phát triển các đối tượng mẫu

const commoncontroller = require("../controllers/commoncontroller.js")
const usercontroller = require("../controllers/usercontroller.js")
const rolecontroller = require("../controllers/rolecontroller.js");
const modulecontroller = require("../controllers/modulecontroller.js");
const clientcontroller = require("../controllers/clientcontroller.js");
const workcategorycontroller = require("../controllers/workcategorycontroller.js");
const membercontroller = require("../controllers/membercontroller.js");
const clientmembercontroller = require("../controllers/clientmembercontroller.js");
const rolemembercontroller = require("../controllers/rolemembercontroller.js");
const modulemembercontroller = require("../controllers/modulemembercontroller.js");
const rolemodulecontroller = require("../controllers/rolemodulecontroller.js");
const contractcontroller = require("../controllers/contractcontroller.js");
const contractmembercontroller = require("../controllers/contractmembercontroller.js");
const contractlinecontroller = require("../controllers/contractlinecontroller.js");
const contractlinemembercontroller = require("../controllers/contractlinemembercontroller.js");

const contractlineperformcontroller = require("../controllers/contractlineperformcontroller.js");

const paymentordercontroller = require("../controllers/paymentordercontroller.js");
const paymentorderipccontroller = require("../controllers/paymentorderipccontroller.js");
//-----------test------
const filecontroller = require("../controllers/filecontroller.js");

module.exports = function (route) {
    // Trang chủ
    route.get("/", (req, res) => {
        res.render('pages/consims_dashboard', { layout: 'layout', title: senserver.utils.text.t({ req, text: 'Contract Dashboard' }) });
    });

    //ngôn ngữ
    route.get("/change-language", (req, res, next) => {
        if (req.query.language) {
            req.app.locals.env.lang = req.query.language || "en";//lấy ngôn ngữ từ session hoặc mặc định là 'en'
        }
        return res.redirect("/");
    });

    //Page profile
    //route.get("/profile"), (req, res) => { res.render("pages/profile", { layout: 'layout-authen', title: 'Profile' }); }

    // Trang đăng nhập
    route.get("/login", (req, res) => {
        //nếu trường hợp mode='development' thì lấy hết menu    
        if (req.app.locals.env.mode == "development") {
            res.locals.model = { user: { username: 'lotusviet@lotusviet.vn', password: 'StrongPassw0rd!' } };
        }
        res.render("pages/login", { layout: senserver.utils.isajax({ req: req }) ? false : 'layout-authen', title: 'Login', isajax: senserver.utils.isajax({ req: req }) });
    });
    route.post("/login", usercontroller.login);
    // Đăng xuất
    route.get("/logout", (req, res) => { req.session.destroy(() => { res.redirect("/login"); }); });
    //trang đăng ký
    route.get("/register", (req, res) => {
        if (req.app.locals.env.mode === "development") {
            //dữ liệu test
            const id = `${(new Date()).getTime().toString().substring(0, 10)}`;
            res.locals.model = { username: `user${id}@test.com`, password: "123", confirmpassword: "123", fullname: `Test User ${id}` };
        }

        res.render("pages/register", { layout: 'layout-authen', title: 'Sign Up' });
    });
    route.post("/register", usercontroller.register);
    //page reset password
    route.get("/resetpassword", (req, res) => { res.render("pages/resetpassword", { layout: 'layout-authen', title: senserver.utils.text.t({ req, text: 'Reset Password' }) }); });
    route.post("/resetpassword", usercontroller.resetpassword);
    //page forgot password
    route.get("/forgotpassword", (req, res) => { res.render("pages/forgotpassword", { layout: 'layout-authen', title: senserver.utils.text.t({ req, text: 'Forgot Password' }) }); });
    route.post("/forgotpassword", usercontroller.forgotpassword);

    route.get('/profile', async (req, res) => {
        //nếu có api thì cần lấy data từ api với key là req.session.user
        if (req.app.locals.env.mode === "development") {
            //dữ liệu mẫu dùng tạm
            res.locals.model.data = {
                Email: req.session.user,
                FullName: "Nguyen Van A",
                Address: "123 Đường Lý Thường Kiệt, Quận 10, TP.HCM",
                Phone: "0912345678",
                Sex: "Male",
                Birthday: new Date(),
            };
        }

        const para = JSON.stringify({
            "SessionId": req.session.sessionid,
            "LogIn": req.session.user.username,
            "UserEmail": req.session.user.username,
            "ActivateStatus": "All"
        });

        const url = `${req.app.locals.env.api.host}/api/get-client-user?params=${encodeURIComponent(para)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            // xử lý tiếp
            if (data.Success == 'true') {
                res.locals.model.data = data.Data[0];
            }
        } catch (error) { return res.render(`pages/500`, { title: `Error 500`, message: `api error: ${error}`, layout: 'layout-authen' }); }

        //lấy các tùy chọn 
        res.locals.model.sexlist = option.sexlist;
        res.render('pages/profile', {
            layout: 'layout',
            title: 'Profile'
        });
    });
    route.post("/profile", usercontroller.profile);

    // Trang menu người dùng
    route.get("/usermenu", (req, res) => { res.render("pages/usermenu", { title: senserver.utils.text.t({ req, text: 'User Menu' }) }); });
    route.post("/usermenu", (req, res) => { usercontroller.usermenu(req, res); });

    route.use("/senobject", senobjectcontroller);//điều khiển các đối tượng mẫu
    route.use("/senobjectline", senobjectlinecontroller);//điều khiển các đối tượng mẫu

    route.use("/common", commoncontroller);//điều khiển các chức năng chung
    route.use("/role", rolecontroller);
    route.use("/module", modulecontroller);
    route.use("/client", clientcontroller);
    route.use("/workcategory", workcategorycontroller);
    route.use("/member", membercontroller);
    route.use("/clientmember", clientmembercontroller);
    route.use("/rolemember", rolemembercontroller);
    route.use("/modulemember", modulemembercontroller);
    route.use("/rolemodule", rolemodulecontroller);
    route.use("/file", filecontroller);

    route.use("/contract", contractcontroller);
    route.use("/contractmember", contractmembercontroller);
    route.use("/contractline", contractlinecontroller);
    route.use("/contractlinemember", contractlinemembercontroller);
    route.use("/contractlineperform", contractlineperformcontroller);
    route.use("/paymentorder", paymentordercontroller);
    route.use("/paymentorderipc", paymentorderipccontroller);

    route.use((req, res, next) => {
        res.status(404).render("pages/404", {
            title: "404 Not Found",
            layout: "layout-authen"
        });
    });

}
