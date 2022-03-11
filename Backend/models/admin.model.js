"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
var Admin = /** @class */ (function () {
    function Admin(username, password, email, profilePicture, id) {
        this.password = password;
        this.username = username;
        this.email = email;
        this.profileImg = profilePicture;
        this.id = id;
    }
    return Admin;
}());
exports.Admin = Admin;
