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
exports.AdminController = void 0;
var inversify_express_utils_1 = require("inversify-express-utils");
var inversify_1 = require("inversify");
var database_service_1 = require("../../core/services/database.service");
var logger_service_1 = require("../../core/services/logger.service");
var express_1 = require("express");
var entry_model_1 = require("../../models/entry.model");
var AdminController = /** @class */ (function () {
    function AdminController(databaseService, loggerService) {
        this.databaseService = databaseService;
        this.loggerService = loggerService;
    }
    AdminController.prototype.createContact = function (request, response) {
        var _this = this;
        this.loggerService.info('Received new create entry request');
        this.databaseService.insertNewContact(new entry_model_1.Contact(request.body.name, request.body.street, request.body.city, request.body.zipCode, request.body.state, request.body.country, ''))
            .then(function () {
            _this.loggerService.info('New entry inserted');
            response.status(200).send();
        }).catch(function (error) {
            response.status(400).send('insert failed');
        });
    };
    AdminController.prototype.getAllContacts = function (request, response) {
        this.loggerService.info('Received get all entries request');
        this.databaseService.getAllContacts()
            .then(function (contacts) {
            response.status(200).send(contacts);
        })
            .catch(function (error) {
            response.status(500).send('error occurred while fetching data from database');
        });
    };
    AdminController.prototype.deleteContact = function (request, response) {
        this.loggerService.info('Received delete entry request');
        this.databaseService.deleteContact(request.params.id)
            .then(function () {
            response.status(200).send();
        })
            .catch(function (error) {
            response.status(500).send(error);
        });
    };
    AdminController.prototype.editContact = function (request, response) {
        this.loggerService.info(request.body.id);
        this.loggerService.info('received edit entry request');
        this.databaseService.editContact(new entry_model_1.Contact(request.body.name, request.body.street, request.body.city, request.body.zipCode, request.body.state, request.body.country, request.body.id))
            .then(function () {
            response.status(200).send();
        })
            .catch(function (error) {
            response.status(500).send(error);
        });
    };
    AdminController.prototype.editAdmin = function (request, response) {
        this.loggerService.info(request.body.id);
        this.loggerService.info('received edit admin account request');
        this.databaseService.editAdmin(request.body.id, request.body.username, request.email, request.body.profileImg)
            .then(function () {
            response.status(200).send();
        })
            .catch(function (error) {
            response.status(500).send(error);
        });
    };
    AdminController.prototype.changePassword = function (request, response) {
        var _this = this;
        this.loggerService.info(request.body.id);
        this.loggerService.info('received change password request');
        this.databaseService.getAdminWithId(request.body.id)
            .then(function (admin) {
            if (admin.password == request.body.currentPassword) {
                _this.databaseService.changeAdminPassword(request.body.newPassword, request.body.id)
                    .then(function () {
                    _this.loggerService.info('successfully changed admin password');
                    response.status(200).send();
                })
                    .catch(function (error) {
                    _this.loggerService.error(error);
                    response.status(500).send(error);
                });
            }
            else {
                _this.loggerService.error('wrong password');
                response.status(403).send('wrong password');
            }
        })
            .catch(function (error) {
            _this.loggerService.error(error);
            _this.loggerService.error('admin account could not be found');
            response.status(404).send('admin account could not be found');
        });
    };
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    __decorate([
        (0, inversify_express_utils_1.httpPost)('/create'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_a = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _a : Object, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object]),
        __metadata("design:returntype", void 0)
    ], AdminController.prototype, "createContact", null);
    __decorate([
        (0, inversify_express_utils_1.httpGet)('/entries'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_c = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _c : Object, typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
        __metadata("design:returntype", void 0)
    ], AdminController.prototype, "getAllContacts", null);
    __decorate([
        (0, inversify_express_utils_1.httpDelete)('/delete/:id'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_e = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _e : Object, typeof (_f = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _f : Object]),
        __metadata("design:returntype", void 0)
    ], AdminController.prototype, "deleteContact", null);
    __decorate([
        (0, inversify_express_utils_1.httpPut)('/editEntry'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_g = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _g : Object, typeof (_h = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _h : Object]),
        __metadata("design:returntype", void 0)
    ], AdminController.prototype, "editContact", null);
    __decorate([
        (0, inversify_express_utils_1.httpPut)('/editAdmin'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_j = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _j : Object, typeof (_k = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _k : Object]),
        __metadata("design:returntype", void 0)
    ], AdminController.prototype, "editAdmin", null);
    __decorate([
        (0, inversify_express_utils_1.httpPut)('/changePassword'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_l = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _l : Object, typeof (_m = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _m : Object]),
        __metadata("design:returntype", void 0)
    ], AdminController.prototype, "changePassword", null);
    AdminController = __decorate([
        (0, inversify_express_utils_1.controller)('/admin'),
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(database_service_1.DatabaseService.name)),
        __param(1, (0, inversify_1.inject)(logger_service_1.LoggerService.name)),
        __metadata("design:paramtypes", [database_service_1.DatabaseService,
            logger_service_1.LoggerService])
    ], AdminController);
    return AdminController;
}());
exports.AdminController = AdminController;
