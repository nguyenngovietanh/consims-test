const senserver = require("../models/senserver.js");
const model = require("../models/contractlineperform.js");
const express = require('express');
const router = express.Router();
const multer = require("multer");
// lưu file upload
// Cấu hình Multer: dùng thư mục 'uploads/' để lưu file
// const upload = multer({ dest: 'uploads/' });
// Cấu hình Multer: dùng bộ nhớ (không lưu ra file)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Sửa encoding của originalname
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, true);
    }
});



const views = {
    list: { 'path': 'pages/contractlineperform', 'title': 'Submission Management' },
    create: { 'path': 'pages/contractlineperformupdate', 'title': 'Create Submission' },
    update: { 'path': 'pages/contractlineperformupdate', 'title': 'Update Submission' },
    review: { 'path': 'pages/contractlineperformreview', 'title': 'Review Processes' },
};
router.get("/checkroleupload", async (req, res) => {
    try {
        res.json(await model.checkRoleUpload({ req: req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/uploadfile", upload.any(), async (req, res) => {
    try {
        res.json(await model.uploadFiles({ req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/performbycontractline", async (req, res) => {
    try {
        res.json(await model.getPerformByContractLineList({ req: req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/review", async (req, res) => {
    try {
        let viewname = views.review.path;
        //nếu req có tham số viewname thì thay views.list.path thành req.viewname
        if (req.query.viewname) { viewname = `pages/${req.query.viewname}`; }

        res.locals.model.data = await model.getReview({ req: req });

        res.locals.model.meta = model.meta;
        res.locals.model.metareview = model.metareview;
        res.locals.model.metareviewline = model.metareviewline;

        res.render(viewname, { title: views.review.title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// router.get("/contractlinebyperform", async (req, res) => {
//     try {
//         res.json(await model.getList({ req: req }));
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

router.get("/", async (req, res) => {
    res.locals.model.datanew = new model.data();
    res.locals.model.meta = model.meta;
    let viewname = views.list.path;
    //nếu req có tham số viewname thì thay views.list.path thành req.viewname
    if (req.query.viewname) { viewname = `pages/${req.query.viewname}`; }
    switch (viewname) {
        case 'pages/contractlineperformbycontractline':
            // Do something specific for contractlineperformbycontractline
            // res.locals.model.meta = modelperform.meta;
            break;
        // case 'pages/contractlineperformbyperform':
        //     // Do something specific for contractlineperformbyperform
        //     res.locals.model.meta = modelcontractline.meta;
        //     break;
        default:
            // Do something for other views
            break;
    }

    res.render(viewname, { title: views.list.title, layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });
});

// lấy danh sách data
router.get("/listall", async (req, res) => {
    try {
        res.json(await model.getListAll({ req: req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
        let viewname = views.create.path;
        //nếu req có tham số viewname thì thay views.list.path thành req.viewname
        if (req.query.viewname) { viewname = `pages/${req.query.viewname}`; }

        res.locals.model.data = await model.getCreate({ req: req });
        res.locals.model.meta = model.meta;
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
        let viewname = views.update.path;
        //nếu req có tham số viewname thì thay views.list.path thành req.viewname
        if (req.query.viewname) { viewname = `pages/${req.query.viewname}`; }

        res.locals.model.data = await model.getEdit({ req: req });
        res.locals.model.meta = model.meta;
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

router.post("/editline", async (req, res) => {
    try {
        res.json(await model.postEditLine({ req }));
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message, errors: err.errors || err.message });
    }
});

router.post("/editlineall", async (req, res) => {
    try {
        res.json(await model.postEditLineAll({ req }));
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

router.get("/metaall", async (req, res) => {
    try {
        const metadata = {};
        metadata.datanew = new model.dataall();
        metadata.meta = model.metaall;
        res.json(metadata);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//#endregion utils

module.exports = router;
