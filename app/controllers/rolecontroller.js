const senserver = require("../models/senserver.js");
const model = require("../models/role.js");
const express = require('express');
const router = express.Router();
const option = require("../models/option.js");

// Đặt trước các route cần dùng
async function attachWorkingPlaceMeta(req, res, next) {
    const metaItem = model.meta.find(m => m.field === 'WorkingPlace');
    if (metaItem) {
        metaItem.data = await option.getWorkingPlace({ req });
    }
    next();
}

// Áp dụng middleware cho các route cần thiết
router.use(["/", "/create", "/edit"], attachWorkingPlaceMeta);

router.get("/", async (req, res) => {
    res.locals.model.datanew = new model.data();    
    res.locals.model.meta = model.meta;
    res.render("pages/role", { layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });
});

router.get("/list", async (req, res) => {
    try {
        return res.json(await model.getDatas({ req: req }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/create", async (req, res) => {
    try {
        res.locals.model.data = new model.data();
        res.locals.model.meta = model.meta;
        res.render("pages/roleupdate", { title: 'Create new' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/create", async (req, res) => {
    try {
        res.json(await model.addData({ req: req, meta: model.meta }));
    } catch (err) {
        res.json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

router.get("/edit", async (req, res) => {
    try {
        const result = await model.findByKey({ req: req });
        res.locals.model.data = result || {};
        res.locals.model.meta = model.meta;
        res.render("pages/roleupdate", { title: 'Update' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/edit", async (req, res) => {
    try {
        res.json(await model.updateData({ req: req, meta: model.meta }));
    } catch (err) {
        res.json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

router.post("/delete/:id", async (req, res) => {
    try {
        res.json(await model.deleteData(req));
    } catch (err) {
        res.json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

module.exports = router;
