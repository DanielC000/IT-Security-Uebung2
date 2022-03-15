import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { IoContainer } from './core/ioc/ioc.container';
import { LoggerService } from './core/services/logger.service';
import { DatabaseService } from './core/services/database.service';
import {express} from "express";
import * as bodyParser from "body-parser";
import {requireJwtMiddleware} from "./JWT/requireJwtMiddleware"

const container = new IoContainer();
container.init();

const logger = container.getContainer().resolve(LoggerService);
const databaseService = container.getContainer().resolve(DatabaseService);

const server = new InversifyExpressServer(container.getContainer());

//JWT


server.setConfig((app) => {
    app.use("/overview", requireJwtMiddleware);
    app.use("/configuration", requireJwtMiddleware);

    let cors = require('cors');
    app.use(cors({origin: `*`}));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.options('https://localhost:4200', cors());
});

databaseService.initialize().then(()=>{
    const app = server.build();
    app.listen(8888);
    logger.info('Server listening on port 8888')
}).catch((error)=>{
    logger.error(error, 'Error while starting express server');
});

