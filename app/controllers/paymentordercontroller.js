const senserver = require("../models/senserver.js");
const model = require("../models/paymentorder.js");
const express = require('express');
const router = express.Router();
const views = {
    list: { 'path': 'pages/paymentorder', 'title': 'Payment Preparation' },
    create: { 'path': 'pages/paymentorderupdate', 'title': 'Create Payment Preparation' },
    update: { 'path': 'pages/paymentorderupdate', 'title': 'Update Payment Preparation' }
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
        res.json(await model.postCreate({ req: req }));
    } catch (err) {
        res.json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

router.get("/edit", async (req, res) => {
    try {
        res.locals.model.data = await model.getEdit({ req: req });
        res.locals.model.meta = model.meta;
        res.render(views.update.path, { title: views.update.title });
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message, errors: err.message });
    }
});

router.post("/edit", async (req, res) => {
    try {
        res.json(await model.postEdit({ req }));
    } catch (err) {
        res.json({ status: 0, message: err.message, errors: err.errors || err.message });
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

//#region paymentorder 
router.post("/removedraftipc", async (req, res) => {
    try {
        res.json(await model.removeDraftIPC({ req: req }));
    } catch (err) {
        res.json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

router.post("/createdraftipc", async (req, res) => {
    try {
        res.json(await model.createDraftIPC({ req: req }));
    } catch (err) {
        res.json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

router.get("/getdraftipc", async (req, res) => {
    try {
        res.json(await model.getDraftIPC({ req: req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/createipcfromdraft", async (req, res) => {
    try {
        res.json(await model.createIPCfromDraft({ req: req }));
    } catch (err) {
        res.json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});
//#endregion paymentorder

module.exports = router;
