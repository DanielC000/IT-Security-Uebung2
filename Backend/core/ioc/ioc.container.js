"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoContainer = void 0;
require("reflect-metadata");
var inversify_1 = require("inversify");
var inversify_express_utils_1 = require("inversify-express-utils");
var logger_service_1 = require("../services/logger.service");
var database_service_1 = require("../services/database.service");
var user_controller_1 = require("../../api/user/user.controller");
var admin_controller_1 = require("../../api/admin/admin.controller");
var IoContainer = /** @class */ (function () {
    function IoContainer() {
        this.container = new inversify_1.Container();
    }
    IoContainer.prototype.init = function () {
        this.initServices();
        this.initController();
    };
    IoContainer.prototype.getContainer = function () {
        return this.container;
    };
    IoContainer.prototype.initController = function () {
        this.container.bind(inversify_express_utils_1.TYPE.Controller)
            .to(user_controller_1.UserController)
            .whenTargetNamed(user_controller_1.UserController.name);
        this.container.bind(inversify_express_utils_1.TYPE.Controller)
            .to(admin_controller_1.AdminController)
            .whenTargetNamed(admin_controller_1.AdminController.name);
    };
    IoContainer.prototype.initServices = function () {
        this.container
            .bind(logger_service_1.LoggerService.name)
            .to(logger_service_1.LoggerService)
            .inSingletonScope();
        this.container
            .bind(database_service_1.DatabaseService.name)
            .to(database_service_1.DatabaseService)
            .inSingletonScope();
    };
    return IoContainer;
}());
exports.IoContainer = IoContainer;
