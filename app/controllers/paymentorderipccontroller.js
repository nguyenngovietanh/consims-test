const senserver = require("../models/senserver.js");
const model = require("../models/paymentorderipc.js");
const express = require('express');
const router = express.Router();
const option = require("../models/option.js");

// // Đặt trước các route cần dùng
// async function attachWorkingPlaceMeta(req, res, next) {
//     const metaItem = model.meta.find(m => m.field === 'WorkingPlace');
//     if (metaItem) {
//         metaItem.data = await option.getWorkingPlace({ req });
//     }
//     next();
// }

// // Áp dụng middleware cho các route cần thiết
// router.use(["/", "/create", "/edit"], attachWorkingPlaceMeta);

router.get("/", async (req, res) => {
    res.locals.model.datanew = new model.data();
    res.locals.model.meta = model.meta;
    res.render("pages/paymentorderipc", { layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });
});

router.get("/list", async (req, res) => {
    try {
        return res.json(await model.getDatas({ req: req }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/listall", async (req, res) => {
    try {
        return res.json(await model.getDatasAll({ req: req }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/create", async (req, res) => {
    try {
        res.locals.model.data = new model.data();
        res.locals.model.meta = model.meta;
        res.render("pages/paymentorderipcupdate", { title: 'Create new' });
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
        res.render("pages/paymentorderipcupdate", { title: 'Update' });

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

router.get("/metacontractinfo", async (req, res) => {
    try {
        const metadata = {};
        metadata.datanew = new model.datacontractinfo();
        metadata.meta = model.metacontractinfo;
        res.json(metadata);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/validateapplytax", async (req, res) => {
    try {
        res.json(await model.validateApplyTax({ req: req, meta: model.meta }));
    } catch (err) {
        res.json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

router.post("/acceptapplytax", async (req, res) => {
    try {
        res.json(await model.acceptApplyTax({ req: req, meta: model.meta }));
    } catch (err) {
        res.json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

router.get("/ipcline", async (req, res) => {
    res.locals.model.datanew = new model.dataline();
    res.locals.model.meta = model.metaline;
    res.render("pages/paymentorderipcline", { layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });
});
router.get("/ipclinedata", async (req, res) => {
    try {
        return res.json(await model.getIPCLine({ req: req }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/updateipclinetax", async (req, res) => {
    try {
        res.json(await model.updateIPCLineTax({ req: req, meta: model.metaline }));
    } catch (err) {
        res.json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});


router.get("/ipcprint", async (req, res) => {
    try {
        const result = await model.getIPCPrint({ req: req });
        res.locals.model.data = result || {};
        res.locals.model.meta = model.metaprint;
        res.render("pages/paymentorderipcprint", { title: 'IPC Print' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/ipcprintcumulative", async (req, res) => {
    try {
        const result = await model.getIPCPrintCumulative({ req: req });
        res.locals.model.data = result || {};
        res.locals.model.meta = model.metaprintcumulative;
        res.render("pages/paymentorderipcprintcumulative", { title: 'IPC Print Cumulative' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/ipctaxdata", async (req, res) => {
    try {
        return res.json(await model.getIPCTax({ req: req }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/ipcdraft", async (req, res) => {
    res.locals.model.datanew = new model.dataipcdraft();
    res.locals.model.meta = model.metadraft;
    res.render("pages/paymentorderipcdraft", { layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });
});
router.get("/ipcdraftdata", async (req, res) => {
    try {
        return res.json(await model.getIPCDraft({ req: req }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/ipcapproval", async (req, res) => {
    try {
        const result = await model.getIPCApproval({ req: req });
        res.locals.model.data = result || {};
        res.locals.model.meta = { meta: model.meta, metaprint: model.metaprint, metaassigneeapproval: model.metaassigneeapproval };
        res.render("pages/paymentorderipcapproval", { title: 'IPC Approval' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/ipcapproval", async (req, res) => {
    try {
        res.json(await model.updateIPCApproval({ req: req, meta: model.metaprint }));
    } catch (err) {
        res.json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

//#endregion utils


module.exports = router;
