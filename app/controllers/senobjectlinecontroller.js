const senserver = require("../models/senserver.js");
const model = require("../models/senobjectline.js");
const express = require('express');
const router = express.Router();
const views = {
    list: { 'path': 'pages/senobjectline', 'title': 'List Line Objects' },
    create: { 'path': 'pages/senobjectlineupdate', 'title': 'Create Line Object' },
    update: { 'path': 'pages/senobjectlineupdate', 'title': 'Update Line Object' }
};
router.get("/", async (req, res) => {
    res.locals.model.datanew = new model.data();
    res.locals.model.meta = model.meta;
    let viewname = views.list.path;
    //nếu req có tham số viewname thì thay views.list.path thành req.viewname
    if (req.query.viewname) { viewname = `pages/${req.query.viewname}`; }
    res.render(viewname, { title: views.list.title, layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });
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

        let viewname = views.create.path;
        //nếu req có tham số viewname thì thay views.create.path thành req.viewname
        if (req.query.viewname) { viewname = `pages/${req.query.viewname}`; }
        res.render(viewname, { title: views.create.title });
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

        let viewname = views.update.path;
        //nếu req có tham số viewname thì thay views.update.path thành req.viewname
        if (req.query.viewname) { viewname = `pages/${req.query.viewname}`; }
        res.render(viewname, { title: views.update.title });
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

//#region utils
// lấy metadata
router.get("/meta", async (req, res) => {
    try {
        const metadata = {};
        metadata.datanew = new model.data();
        metadata.meta = model.meta;
        res.json(metadata);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//#endregion utils

module.exports = router;
