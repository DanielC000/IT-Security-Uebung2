"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var inversify_express_utils_1 = require("inversify-express-utils");
var ioc_container_1 = require("./core/ioc/ioc.container");
var logger_service_1 = require("./core/services/logger.service");
var database_service_1 = require("./core/services/database.service");
var bodyParser = require("body-parser");
var container = new ioc_container_1.IoContainer();
container.init();
var logger = container.getContainer().resolve(logger_service_1.LoggerService);
var databaseService = container.getContainer().resolve(database_service_1.DatabaseService);
var server = new inversify_express_utils_1.InversifyExpressServer(container.getContainer());
server.setConfig(function (app) {
    var cors = require('cors');
    app.use(cors({ origin: "*" }));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.options('https://localhost:4200', cors());
});
databaseService.initialize().then(function () {
    var app = server.build();
    app.listen(8888);
    logger.info('Server listening on port 8888');
}).catch(function (error) {
    logger.error(error, 'Error while starting express server');
});
