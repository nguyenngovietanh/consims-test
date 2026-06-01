const senserver = require("../models/senserver.js");
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require("multer");
// Cấu hình multer (lưu file vào thư mục uploads/)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "public/assets/uploads")); // lưu đúng thư mục
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

const upload = multer({ storage: storage });

// Route: hiển thị form
router.get("/upload", (req, res) => {
    res.render("pages/upload", { title: 'Upload file', layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });
});

// Route: xử lý upload
router.post("/upload", upload.array("files", 10), (req, res) => {
    // files là array
    //console.log("Files:", req.files);
    // if (!req.file) return res.send("No file uploaded.");
    // const fileUrl = "/assets/uploads/" + req.file.filename;
    res.render("pages/upload", { title: 'Upload file', layout: senserver.utils.isajax({ req: req }) ? false : 'layout' });

});


module.exports = router;
