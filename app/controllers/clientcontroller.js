const senserver = require("../models/senserver.js");
const model = require("../models/client.js");
const commonmodel = require("../models/common.js");
const express = require('express');
const router = express.Router();
const views = {
    list: { 'path': 'pages/client', 'title': 'Clients Management' },
    create: { 'path': 'pages/clientupdate', 'title': 'Create Client' },
    update: { 'path': 'pages/clientupdate', 'title': 'Update Client' },
    select: { 'path': 'pages/clientselect', 'title': 'Select Client' },
};

router.get("/", async (req, res) => {
    res.locals.model.datanew = new model.data();
    res.locals.model.meta = model.meta;
    res.render(views.list.path, { title: senserver.utils.text.t({ req: req, text: views.list.title }), layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });
});

// lấy danh sách data
router.get("/list", async (req, res) => {
    try {
        res.json(await model.getList({ req: req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// lấy danh sách data dùng cho lookup
router.get("/lookup", async (req, res) => {
    try {
        res.json(await model.getLookup({ req: req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/create", async (req, res) => {
    try {
        res.locals.model.data = await model.getCreate({ req: req });
        res.locals.model.meta = model.meta;
        res.render(views.create.path, { title: views.create.title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/create", async (req, res) => {
    try {
        res.json(await model.postCreate({ req: req }));
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

router.get("/edit", async (req, res) => {
    try {
        res.locals.model.data = await model.getEdit({ req: req });
        res.locals.model.meta = model.meta;
        res.render(views.update.path, { title: views.update.title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/edit", async (req, res) => {
    try {
        res.json(await model.postEdit({ req }));
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

router.post("/delete/:id", async (req, res) => {
    try {
        res.json(await model.postDelete({ req }));
    } catch (err) {
        res.json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

//phần chọn client
router.get("/select", async (req, res) => {
    try {
        res.locals.model.data = await model.getSelect({ req: req });
        //nếu ko có client nào thì báo lỗi
        if (res.locals.model.data.length === 0) {
            return res.redirect("/");
        }

        //nếu chỉ có 1 client thì tự động chọn luôn
        if (res.locals.model.data.length === 1) {
            const client = res.locals.model.data[0];
             //lưu client đã chọn vào session
            client.CompanyName = client.CompanyName?.replace(/\r?\n/g, "\\n").replace(/\"/g, '\\"');
            req.session.client = client;

            //lấy logo của client
            const logoresult = await commonmodel.getLogo({ req });
            if (logoresult.datas.length === 0) {
                req.session.logo = null;
            } else
            {
                req.session.logo = logoresult.datas[0];
            }
            // req.session.client = res.locals.model.data[0];
            return res.redirect("/");
        }

        res.locals.model.meta = model.meta;

        //lấy logo của client
        const logoresult = await commonmodel.getLogo({ req });
        if (logoresult.datas.length === 0) {
            res.locals.model.logo = null;
        } else
        {
            res.locals.model.logo = logoresult.datas[0];
        }

        res.render(views.select.path, { layout: senserver.utils.isajax({ req: req }) ? false : 'layout-authen', title: senserver.utils.text.t({ req: req, text: views.select.title }) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post("/select", async (req, res) => {
    try {
        // //kiểm tra clientid có trong ds client ko
        const clients = await model.getSelect({ req: req });
        const client = clients.find(c => c.ClientId === parseInt(req.body.clientid));
        if (!client) {
            res.locals.model.data = clients;
            res.locals.model.meta = model.meta;
            res.locals.model.error = senserver.utils.text.t({ req, text: 'Invalid client selected' });
            return res.render(views.select.path, { layout: 'layout-authen', title: senserver.utils.text.t({ req, text: views.select.title }) });
        }
        else {
            //lưu client đã chọn vào session
            client.CompanyName = client.CompanyName?.replace(/\r?\n/g, "\\n").replace(/\"/g, '\\"');
            req.session.client = client;

            //lấy logo của client
            const logoresult = await commonmodel.getLogo({ req });
            if (logoresult.datas.length === 0) {
                req.session.logo = null;
            } else
            {
                req.session.logo = logoresult.datas[0];
            }
            // req.session.menu = null;//xóa menu cũ để load lại menu mới theo client
        }
        res.redirect("/");
        //res.json(await model.postSelect({ req }));
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

//duyệt chấp nhận đăng ký doanh nghiệp
router.post("/approve", async (req, res) => {
    try {
        res.json(await model.postApprove({ req }));
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});
//duyệt từ chối đăng ký doanh nghiệp
router.post("/reject", async (req, res) => {
    try {
        res.json(await model.postReject({ req }));
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

module.exports = router;
