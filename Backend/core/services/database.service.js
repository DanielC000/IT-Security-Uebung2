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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
var inversify_1 = require("inversify");
var logger_service_1 = require("./logger.service");
var rethinkdb_ts_1 = require("rethinkdb-ts");
var databaseConfiguration = require("./../configuration/database-config.json");
var DatabaseService = /** @class */ (function () {
    function DatabaseService(loggerService) {
        this.loggerService = loggerService;
    }
    DatabaseService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        connection = _a.sent();
                        rethinkdb_ts_1.r.dbList()
                            .contains(databaseConfiguration.databaseName)
                            .do(function (containsDatabase) {
                            return rethinkdb_ts_1.r.branch(containsDatabase, { created: 0 }, rethinkdb_ts_1.r.dbCreate(databaseConfiguration.databaseName));
                        })
                            .run(connection)
                            .then(function () {
                            _this.loggerService.info('Trying to create tables');
                            _this.createTables(connection)
                                .then(function () {
                                _this.loggerService.info('Tables created');
                                return Promise.resolve(true);
                            })
                                .catch(function (error) {
                                _this.loggerService.error(error);
                                return Promise.reject(false);
                            });
                        });
                        return [2 /*return*/, Promise.resolve(true)];
                }
            });
        });
    };
    DatabaseService.prototype.getAllAdmins = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect().then(function (connection) {
                rethinkdb_ts_1.r.db(databaseConfiguration.databaseName)
                    .table('adminTable')
                    .filter({})
                    .run(connection)
                    .then(function (response) {
                    resolve(response);
                })
                    .catch(function (error) {
                    _this.loggerService.error(error, 'Error while retrieving entries');
                });
            });
        });
    };
    DatabaseService.prototype.createTables = function (connection) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promises = new Array();
            databaseConfiguration.databaseTables.forEach(function (table) {
                promises.push(_this.createTable(connection, table));
            });
            Promise.all(promises)
                .then(function () {
                resolve(true);
            })
                .catch(function (error) {
                _this.loggerService.error(error);
                reject(false);
            });
        });
    };
    DatabaseService.prototype.createTable = function (connection, tableName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            rethinkdb_ts_1.r.db(databaseConfiguration.databaseName)
                .tableList()
                .contains(tableName)
                .do(function (containsTable) {
                return rethinkdb_ts_1.r.branch(containsTable, { create: 0 }, rethinkdb_ts_1.r.db(databaseConfiguration.databaseName).tableCreate(tableName));
            })
                .run(connection)
                .then(function () {
                resolve(true);
            })
                .catch(function (error) {
                _this.loggerService.error(error);
                reject(false);
            });
        });
    };
    DatabaseService.prototype.connect = function () {
        var rethinkDbOptions = {
            host: databaseConfiguration.databaseServer,
            port: databaseConfiguration.databasePort,
        };
        return new Promise(function (resolve, reject) {
            rethinkdb_ts_1.r.connect(rethinkDbOptions)
                .then(function (connection) {
                resolve(connection);
            })
                .catch(reject);
        });
    };
    DatabaseService.prototype.insertNewAdmin = function (admin) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect().then(function (connection) {
                rethinkdb_ts_1.r.db(databaseConfiguration.databaseName);
                rethinkdb_ts_1.r.table("adminTable")
                    .insert({
                    username: admin.username,
                    password: admin.password,
                    email: admin.email,
                    profileImg: admin.profileImg,
                })
                    .run(connection)
                    .then(function (response) {
                    console.log('Success ', response);
                    resolve(true);
                })
                    .catch(function (error) {
                    _this.loggerService.error(error, 'Error while inserting new entries');
                    reject(false);
                });
            });
        });
    };
    DatabaseService.prototype.insertNewContact = function (contact) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect().then(function (connection) {
                rethinkdb_ts_1.r.db(databaseConfiguration.databaseName);
                rethinkdb_ts_1.r.table("contactTracingTable")
                    .insert({
                    name: contact.name,
                    street: contact.street,
                    city: contact.city,
                    zipCode: contact.zipCode,
                    state: contact.state,
                    country: contact.country,
                })
                    .run(connection)
                    .then(function (response) {
                    console.log('Success ', response);
                    resolve(true);
                })
                    .catch(function (error) {
                    _this.loggerService.error(error, 'Error while inserting new entries');
                    reject(false);
                });
            });
        });
    };
    DatabaseService.prototype.getAllContacts = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect().then(function (connection) {
                rethinkdb_ts_1.r.db(databaseConfiguration.databaseName)
                    .table('contactTracingTable')
                    .filter({})
                    .run(connection)
                    .then(function (response) {
                    resolve(response);
                })
                    .catch(function (error) {
                    _this.loggerService.error(error, 'Error while retrieving entries');
                });
            });
        });
    };
    DatabaseService.prototype.deleteContact = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect().then(function (connection) {
                rethinkdb_ts_1.r.db(databaseConfiguration.databaseName)
                    .table('contactTracingTable')
                    .get(id)
                    .delete()
                    .run(connection)
                    .then(function () {
                    _this.loggerService.info('if existing, deleted user with id:' + id);
                    resolve('entry deleted');
                })
                    .catch(function (error) {
                    _this.loggerService.error('failed deleting user:' + id);
                    _this.loggerService.error(error);
                    reject(error);
                });
            });
        });
    };
    DatabaseService.prototype.editContact = function (contact) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect().then(function (connection) {
                rethinkdb_ts_1.r.db(databaseConfiguration.databaseName)
                    .table('contactTracingTable')
                    .get(contact.id)
                    .update({
                    name: contact.name,
                    street: contact.street,
                    city: contact.city,
                    zipCode: contact.zipCode,
                    state: contact.state,
                    country: contact.country,
                }).run(connection)
                    .then(function () {
                    _this.loggerService.info('successfully edited entry.');
                    resolve('entry edited.');
                })
                    .catch(function (error) {
                    _this.loggerService.error('failed editing entry.');
                    reject(error);
                });
            });
        });
    };
    DatabaseService.prototype.editAdmin = function (id, username, email, profileImg) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect().then(function (connection) {
                rethinkdb_ts_1.r.db(databaseConfiguration.databaseName)
                    .table('adminTable')
                    .get(id)
                    .update({
                    username: username,
                    email: email,
                    profileImg: profileImg,
                }).run(connection)
                    .then(function () {
                    _this.loggerService.info('successfully edited admin.');
                    resolve('admin edited.');
                })
                    .catch(function (error) {
                    _this.loggerService.error('failed editing admin.');
                    reject(error);
                });
            });
        });
    };
    DatabaseService.prototype.getAdminWithId = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect()
                .then(function (connection) {
                rethinkdb_ts_1.r.db(databaseConfiguration.databaseName)
                    .table('adminTable')
                    .get(id)
                    .run(connection)
                    .then(function (admin) {
                    _this.loggerService.info('found admin');
                    resolve(admin);
                })
                    .catch(function (error) {
                    _this.loggerService.error('could not fetch admin');
                    reject(null);
                });
            })
                .catch(function (error) {
                _this.loggerService.error('could not create connection to db.');
                _this.loggerService.error(error);
                reject(null);
            });
        });
    };
    DatabaseService.prototype.changeAdminPassword = function (newPassword, id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect().then(function (connection) {
                rethinkdb_ts_1.r.db(databaseConfiguration.databaseName)
                    .table('adminTable')
                    .get(id)
                    .update({
                    password: newPassword
                }).run(connection)
                    .then(function () {
                    _this.loggerService.info('successfully updated admin password.');
                    resolve('admin password changed.');
                })
                    .catch(function (error) {
                    _this.loggerService.error('failed editing admin.');
                    reject(error);
                });
            });
        });
    };
    DatabaseService.prototype.checkInUser = function (firstName, lastName, timeNow, dateNow, code) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect().then(function (connection) {
                rethinkdb_ts_1.r.db(databaseConfiguration.databaseName)
                    .table('userChecks')
                    .insert({
                    firstName: firstName,
                    lastName: lastName,
                    checkInTime: timeNow,
                    checkInDate: dateNow,
                    checkOutTime: "",
                    checkOutDate: "",
                    code: code
                })
                    .run(connection)
                    .then(function () {
                    _this.loggerService.info('successfully checked in user:' + code);
                    resolve(code);
                })
                    .catch(function (error) {
                    _this.loggerService.error('failed checking user in:' + code);
                    _this.loggerService.error(error);
                    reject('failed checking user in');
                });
            })
                .catch(function (error) {
                _this.loggerService.error(error);
                _this.loggerService.error('failed connecting to DB for check in of:' + code);
            });
        });
    };
    DatabaseService.prototype.checkOutUser = function (code, time, date) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect().then(function (connection) {
                rethinkdb_ts_1.r.db(databaseConfiguration.databaseName)
                    .table('userChecks')
                    .filter({
                    "code": code
                })
                    .update({
                    checkOutTime: time,
                    checkOutDate: date
                })
                    .run(connection)
                    .then(function () {
                    _this.loggerService.info('successfully checked out user:' + code);
                    resolve('checked out user successfully');
                })
                    .catch(function (error) {
                    _this.loggerService.info('successfully checked out user:' + code);
                    _this.loggerService.info(error);
                    reject(error);
                });
            });
        });
    };
    DatabaseService = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(logger_service_1.LoggerService.name)),
        __metadata("design:paramtypes", [logger_service_1.LoggerService])
    ], DatabaseService);
    return DatabaseService;
}());
exports.DatabaseService = DatabaseService;
