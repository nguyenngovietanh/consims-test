const senserver = require("../models/senserver.js");
const model = require("../models/contractmember.js");
const modelmember = require("../models/member.js");
const modelcontract = require("../models/contract.js");
const express = require('express');
const router = express.Router();
const views = {
    list: { 'path': 'pages/contractmember', 'title': 'Contracts Members Management' },
    create: { 'path': 'pages/contractmemberupdate', 'title': 'Create Contracts Members' },
    update: { 'path': 'pages/contractmemberupdate', 'title': 'Update Contracts Members' },
};

router.get("/memberbycontract", async (req, res) => {
    try {
        res.json(await model.getMemberByContractList({ req: req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/contractbymember", async (req, res) => {
    try {
        res.json(await model.getList({ req: req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/memberbypaymentorder", async (req, res) => {
    try {
        res.json(await model.getListByPaymentOrder({ req: req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/", async (req, res) => {
    res.locals.model.datanew = new model.data();    
    res.locals.model.meta = model.meta;
    let viewname = views.list.path;
    //nếu req có tham số viewname thì thay views.list.path thành req.viewname
    if (req.query.viewname) { viewname = `pages/${req.query.viewname}`; }
    switch (viewname) {
        case 'pages/contractmemberbycontract':
            // Do something specific for contractmemberbycontract
            res.locals.model.meta = modelmember.meta;
            break;
        case 'pages/contractmemberbymember':
            // Do something specific for contractmemberbymember
            res.locals.model.meta = modelcontract.meta;
            break;
        case 'pages/contractmemberbypaymentorder':
            // Do something specific for memberbypaymentorder
            res.locals.model.meta = model.meta;
            break;            
        default:
            // Do something for other views
            break;
    }

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


router.post("/raci", async (req, res) => {
    try {
        res.json(await model.postRACI({ req }));
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

router.post("/raciandinherit", async (req, res) => {
    try {
        res.json(await model.postRACIAndInherit({ req }));
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

router.post("/racipaymentorder", async (req, res) => {
    try {
        res.json(await model.postRACI4PO({ req }));
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

router.post("/deletepaymentorder", async (req, res) => {
    try {
        res.json(await model.postDeletePaymentOrder({ req }));
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

module.exports = router;
