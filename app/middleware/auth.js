const isauthenticated = (req, res, next) => {
    // Danh sách các route không cần xác thực
    const excludedRoutes = ['/change-language', '/register', '/login', '/forgotpassword', '/error'];

    // Nếu request nằm trong danh sách loại trừ, chuyển tiếp mà không kiểm tra token
    if (excludedRoutes.includes(req.path)) { return next(); }
    if (!req.session.user) return res.redirect("/login");
    return next();

    // // Kiểm tra header authorization
    // const token = req.headers['authorization'];
    // if (token) {
    //     // Ở đây bạn có thể thêm logic kiểm tra token, ví dụ: JWT
    //     // Giả sử token hợp lệ, chuyển tiếp
    //     next();
    // } else {
    //     // Trả về lỗi nếu không có token
    //     res.status(401).json({ error: 'Unauthorized' });
    // }
};

module.exports = { isauthenticated };