const senserver = require("../models/senserver.js");
const model = require("../models/member.js");
const express = require('express');
const router = express.Router();
const views = {
    list: { 'path': 'pages/member', 'title': 'Members Management' },
    create: { 'path': 'pages/memberupdate', 'title': 'Create Member' },
    update: { 'path': 'pages/memberupdate', 'title': 'Update Member' },
};

router.get("/", async (req, res) => {
    res.locals.model.datanew = new model.data();    
    res.locals.model.meta = model.meta;
    res.render(views.list.path, { title: views.list.title, layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });
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
        res.json(await model.postCreate({ req }));
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

//duyệt chấp nhận đăng ký thành viên
router.post("/approve", async (req, res) => {
    try {
        res.json(await model.postApprove({ req }));
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});
//duyệt từ chối đăng ký thành viên
router.post("/reject", async (req, res) => {
    try {
        res.json(await model.postReject({ req }));
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

module.exports = router;
