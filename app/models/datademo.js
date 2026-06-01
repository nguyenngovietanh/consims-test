// datademo.js
module.exports =
{
  users: [
    { username: "alice.nguyen@example.com", password: "123", name: "Alice Nguyễn", department: "Kế toán" },
    { username: "bob.tran@example.com", password: "456", name: "Bob Trần", department: "Kỹ thuật" },
    { username: "charlie.pham@example.com", password: "789", name: "Charlie Phạm", department: "Nhân sự" },
    { username: "david.le@example.com", password: "abc", name: "David Lê", department: "Kinh doanh" },
    { username: "eva.vu@example.com", password: "def", name: "Eva Vũ", department: "Marketing" },
    { username: "frank.ho@example.com", password: "ghi", name: "Frank Hồ", department: "Kỹ thuật" },
    { username: "grace.dang@example.com", password: "jkl", name: "Grace Đặng", department: "Kế toán" },
    { username: "hannah.bui@example.com", password: "mno", name: "Hannah Bùi", department: "Nhân sự" },
    { username: "ian.nguyen@example.com", password: "pqr", name: "Ian Nguyễn", department: "Kinh doanh" },
    { username: "julia.tran@example.com", password: "stu", name: "Julia Trần", department: "Marketing" },
    { username: "kevin.pham@example.com", password: "vwx", name: "Kevin Phạm", department: "Kỹ thuật" },
    { username: "lisa.le@example.com", password: "yz1", name: "Lisa Lê", department: "Kế toán" }
  ],
  menus: [
    { menuname: "Roles", icon: "user-check", link: "/role", mode: "production" },
    { menuname: "Modules", icon: "layers", link: "/module", mode: "production" },
    { menuname: "Clients", icon: "users", link: "/client" , mode: "production"},
    { menuname: "Work Categories", icon: "file", link: "/workcategory" , mode: "production"},
    { menuname: "Contracts", icon: "file", link: "/contract" },
    { menuname: "Submission Review", icon: "list", link: "/contractlineperform" },

    { menuname: "Payment", icon: "list", link: "/paymentorder" },


    { menuname: "Members", icon: "users", link: "/member", mode: "production" },


    // { menuname: "Dashboard", link: "/", icon: "pie-chart", reload: true },
    // { menuname: "Menu 1", link: "/", icon: "shopping-cart", reload: true },
    // { menuname: "Menu 2", link: "/", icon: "phone", reload: true },
    // { menuname: "Menu 3", link: "/", icon: "clipboard", reload: true },
    // { menuname: "Menu Permissions", icon: "file-text", link: "/usermenu", mode: "development" },

    { menuname: "Register", icon: "user", link: "/register", reload: true, mode: "development" },
    { menuname: "Upload", icon: "file", link: "/file/upload", mode: "development" },
    { menuname: "Object", icon: "user", link: "/senobject", mode: "development" },
    { menuname: "Object Line", icon: "user", link: "/senobjectline", mode: "development" },
    { menuname: "Object Master", icon: "user", link: "/senobject?viewname=senobjectmaster", mode: "development" },
    { menuname: "Object Simple", icon: "user", link: "/senobject?viewname=senobjectsimple", mode: "development" },
    { menuname: "Object Advance", icon: "user", link: "/senobject?viewname=senobjectadvance", mode: "development" }

  ]
  //lọc đối tượng menus chỉ lấy mode !='development'

};