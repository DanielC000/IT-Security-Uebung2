"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
var express_1 = require("express");
var inversify_1 = require("inversify");
var inversify_express_utils_1 = require("inversify-express-utils");
var database_service_1 = require("../../core/services/database.service");
var admin_model_1 = require("../../models/admin.model");
var logger_service_1 = require("../../core/services/logger.service");
var UserController = /** @class */ (function () {
    function UserController(databaseService, loggerService) {
        this.databaseService = databaseService;
        this.loggerService = loggerService;
    }
    UserController.prototype.registerAdmin = function (request, response) {
        var _this = this;
        this.loggerService.info('Received user request');
        this.databaseService.getAllAdmins()
            .then(function (result) {
            if (result.find(function (admin) { return admin.username == request.body.username && admin.password == request.body.password; })) {
                response.status(401).send({
                    message: 'Credentials taken'
                });
            }
            else {
                _this.databaseService.insertNewAdmin(new admin_model_1.Admin(request.body.username, request.body.password, request.body.email, '', ''))
                    .then(function (value) {
                    response.status(200).send("registration successful");
                }).catch(function (error) {
                    response.status(401).send({
                        message: 'Insertion error occurred'
                    });
                });
            }
        }).catch(function (error) {
            response.status(400).send(error);
        });
    };
    UserController.prototype.loginAdmin = function (request, response) {
        var _this = this;
        this.loggerService.info('Received login request');
        this.loggerService.info(request.body.username);
        this.databaseService.getAllAdmins().then(function (result) {
            var admin = result.find(function (x) { return x.password == request.body.password && x.username == request.body.username; });
            if (admin == undefined) {
                _this.loggerService.info('invalid login request');
                response.status(401).send({
                    message: 'Wrong credentials.'
                });
            }
            else {
                admin.password = '';
                response.status(200).send(admin);
                _this.loggerService.info('valid login request');
            }
        });
    };
    UserController.prototype.checkIn = function (request, response) {
        this.loggerService.info('Received check in request');
        var code = Math.random().toString(36).substring(2, 9);
        this.databaseService.checkInUser(request.body.firstName, request.body.lastName, request.body.time, request.body.date, code).then(function () {
            response.status(200).send({
                body: code
            });
        })
            .catch(function (error) {
            response.status(400).send(error);
        });
    };
    UserController.prototype.checkOut = function (request, response) {
        var _this = this;
        this.loggerService.info('Received check out request');
        this.databaseService.checkOutUser(request.body.code, request.body.date, request.body.time)
            .then(function () {
            response.status(200).send();
        })
            .catch(function (error) {
            _this.loggerService.error(error);
            response.status(400).send();
        });
    };
    UserController.prototype.getAllAdmins = function (request, response) {
        var _this = this;
        this.loggerService.info('Received login request');
        this.databaseService.getAllAdmins()
            .then(function (result) { return response.status(200)
            .send(result); })
            .catch(function (error) { return _this.loggerService.error(error); });
    };
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    __decorate([
        (0, inversify_express_utils_1.httpPost)('/register'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_a = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _a : Object, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object]),
        __metadata("design:returntype", void 0)
    ], UserController.prototype, "registerAdmin", null);
    __decorate([
        (0, inversify_express_utils_1.httpPost)('/login'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_c = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _c : Object, typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
        __metadata("design:returntype", void 0)
    ], UserController.prototype, "loginAdmin", null);
    __decorate([
        (0, inversify_express_utils_1.httpPost)('/checkin'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_e = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _e : Object, typeof (_f = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _f : Object]),
        __metadata("design:returntype", void 0)
    ], UserController.prototype, "checkIn", null);
    __decorate([
        (0, inversify_express_utils_1.httpPut)('/checkout'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_g = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _g : Object, typeof (_h = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _h : Object]),
        __metadata("design:returntype", void 0)
    ], UserController.prototype, "checkOut", null);
    __decorate([
        (0, inversify_express_utils_1.httpGet)('/alle'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_j = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _j : Object, typeof (_k = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _k : Object]),
        __metadata("design:returntype", void 0)
    ], UserController.prototype, "getAllAdmins", null);
    UserController = __decorate([
        (0, inversify_express_utils_1.controller)('/user'),
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(database_service_1.DatabaseService.name)),
        __param(1, (0, inversify_1.inject)(logger_service_1.LoggerService.name)),
        __metadata("design:paramtypes", [database_service_1.DatabaseService,
            logger_service_1.LoggerService])
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
