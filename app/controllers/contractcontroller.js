const senserver = require("../models/senserver.js");
const model = require("../models/contract.js");
const express = require('express');
const router = express.Router();
const views = {
    list: { 'path': 'pages/contract', 'title': 'Contracts Management' },
    // create: { 'path': 'pages/contractupdate', 'title': 'Create Contract' },
    // update: { 'path': 'pages/contractupdate', 'title': 'Update Contract' },
    // select: { 'path': 'pages/contractselect', 'title': 'Select Contract' },
    management: { 'path': 'pages/contractmanagement', 'title': 'Contract Management' },
    managementitems: { 'path': 'pages/contractmanagementitems', 'title': 'Contract Management Items' },
};

router.get("/management", async (req, res) => {
    try {
        res.locals.model.data = await model.getEdit({ req: req });
        res.locals.model.meta = model.meta;
        // res.render(views.management.path, { title: views.management.title });
        res.render(views.management.path, { title: senserver.utils.text.t({ req: req, text: views.management.title }), layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/management-items", async (req, res) => {
    try {
        res.locals.model.data = await model.getEdit({ req: req });
        res.locals.model.meta = model.meta;
        // res.render(views.management.path, { title: views.management.title });
        res.render(views.managementitems.path, { title: senserver.utils.text.t({ req: req, text: views.managementitems.title }), layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/", async (req, res) => {
    res.locals.model.datanew = new model.data();
    res.locals.model.meta = model.meta;
    res.locals.model.contractTypes = await model.getContractTypes({ req: req });
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


// // lấy danh sách data dùng cho lookup
// router.get("/lookup", async (req, res) => {
//     try {
//         res.json(await model.getLookup({ req: req }));
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });


//#region chart data
router.get("/get-work-diagram-data", async (req, res) => {
    try {
        res.json(await model.getWorkDiagram({ req: req })); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//#endregion 



module.exports = router;
