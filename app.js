// npm install express express-session express-ejs-layouts ejs multer

const express = require('express');
const session = require("express-session");
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const { isauthenticated } = require('./app/middleware/auth');
const pagerouter = require('./app/routes/routes.js');
// const client = require('./app/models/client.js');
// const { Session } = require('inspector/promises');
// const { title, env } = require('process');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
//app.set('layout', 'layout'); // layout.ejs trong thư mục /views 
//bỏ layout mặc định
app.set('layout', false);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Cấu hình session
app.use(session({
    secret: "lotusviet-secret-key", resave: false, saveUninitialized: true,
    cookie: {
        maxAge: 8 * 60 * 60 * 1000, // 8 giờ // 24 * 60 * 60 * 1000, // 24 giờ
        httpOnly: true,
        sameSite: 'lax'
    }
}));
app.use(isauthenticated); // Áp dụng middleware isAuthenticated cho tất cả route

//khai báo biến môi trường toàn cục
app.locals.env = {
    appname: "consIMS",
    lang: "en",
    mode: "release",// "development",// "production" //"release",
    api: {
        host: "https://consims.com",// "http://consims.com:3000",
        ClientId: 0,
        WSId: "1cf15Trb_ogqCgIX4vJcAkPQPsBmizhj8ymSt3LZPuKQ",
        headerpost: {
            'Content-Type': 'application/json', // hoặc 'multipart/form-data', 'application/x-www-form-urlencoded',...
            //'Authorization': 'Bearer ' + req.session.token // nếu cần token
        }
    }
};

//map biến toàn cục session cho view đễ dùng
app.use((req, res, next) => {
    res.locals.senapp = {
        appname: app.locals.env.appname,
        lang: app.locals.env.lang,
        user: req.session.user,
        sessionid: req.session.sessionid,
        menu: req.session.menu,
        client: req.session.client,
        logo:req.session.logo
    };
    res.locals.model = {
        url: {
            originalUrl: req.originalUrl,
            baseUrl: req.baseUrl,
            path: req.path,
            query: req.query
        }
    };
    next();
});

// Define All Route 
pagerouter(app);

// Khởi chạy server
app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});
