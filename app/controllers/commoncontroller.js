const senserver = require("../models/senserver.js");
const model = require("../models/common.js");
const express = require('express');
const router = express.Router();
const multer = require("multer");
// lưu file upload
// Cấu hình Multer: dùng thư mục 'uploads/' để lưu file
// const upload = multer({ dest: 'uploads/' });
// Cấu hình Multer: dùng bộ nhớ (không lưu ra file)
const storage = multer.memoryStorage();
// const upload = multer({ storage });
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Sửa encoding của originalname
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, true);
    }
});

// lấy danh sách data dùng cho lookup dùng chung cho các lookup dạng chung chung ( tham số lookupType)
router.get("/lookup", async (req, res) => {
    try {
        res.json(await model.getLookup({ req: req }));
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

router.post("/signfile", async (req, res) => {
    try {
        res.json(await model.signFiles({ req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/removefile/:id", async (req, res) => {
    try {
        res.json(await model.removeFiles({ req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/files", async (req, res) => {
    res.locals.model.meta = model.metafile;
    let viewname =  `pages/commonfiles`;
    //nếu req có tham số viewname thì thay views.files.path thành req.viewname
    if (req.query.viewname) { viewname = `pages/${req.query.viewname}`; }
    res.render(viewname, { title:req.query.title || "Files", layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });
});


router.get("/get-file-list", async (req, res) => {
    try {
        res.json(await model.getFiles({ req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/certificate-info", async (req, res) => {
    try {
        res.json(await model.getCertificate({ req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    // res.locals.model.meta = model.metafile;
    let viewname =  `pages/common`;
    //nếu req có tham số viewname thì thay views.files.path thành req.viewname
    if (req.query.viewname) { viewname = `pages/${req.query.viewname}`; }
    res.render(viewname, { title:req.query.title || "", layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });
});

router.get("/logo", async (req, res) => {
    try {
        res.json(await model.getLogo({ req }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
