import {controller, httpDelete, httpGet, httpPost, httpPut, interfaces} from "inversify-express-utils";
import {inject, injectable} from "inversify";
import {DatabaseService} from "../../core/services/database.service";
import {LoggerService} from "../../core/services/logger.service";
import {Request, Response} from 'express';
import {ConfigDevicesUsers} from "../../../Shared/ConfigDevicesUsers.model";
import { Temperature } from "../../../Shared/temperature.model";
import { WindowModel } from "../../../Shared/window.model";
import { Light } from "../../../Shared/light.model";
import { User } from "../../../Shared/user.model";
import { Log } from "../../../Shared/log.model";
import { Session } from "../../JWT/session";




@controller('/configuration')
@injectable()
export class ConfigurationDeviceUserController implements interfaces.Controller {
    constructor(
        @inject(DatabaseService.name) private databaseService: DatabaseService,
        @inject(LoggerService.name) private loggerService: LoggerService,
    ) {
    }
    //-----------User
    @httpPut('/changeUsername/:newName')
    public changeUsername(request: Request, response: Response): void {
        this.loggerService.info('Received get change username request');
        let session: Session = response.locals.session;

        this.databaseService.changeUsername(session.id, request.params.newName)
        .then(() => {
            this.databaseService.insertNewLog(new Log("Username changed from: "+ session.username + " to " + request.params.newName, Date.now(),"", session.username))
            .catch(error => {
                this.loggerService.error(error);
            })
            response.status(200).send();
        })
        .catch(error => {
            response.status(500).send(error);
        })
    }

    //-----------Admin

    @httpDelete('/removewindow/:id')
    public removeWindow(request: Request, response: Response): void {
        this.loggerService.info('Received get all entries request');
        let session: Session = response.locals.session;

        this.databaseService.removeWindow(request.params.id)
        .then(() => {
            this.databaseService.insertNewLog(new Log("Removed window : "+ request.params.id, Date.now(),"", session.username))
            .catch(error => {
                this.loggerService.error(error);
            })
            response.status(200).send();
        })
        .catch(error => {
            response.status(500).send(error);
        })

    }

    @httpDelete('/removelight/:id')
    public removeLight(request: Request, response: Response): void {
        this.loggerService.info('Received get all entries request');
        let session: Session = response.locals.session;

        this.databaseService.removeLight(request.params.id)
        .then(() => {
            this.databaseService.insertNewLog(new Log("Removed light : "+ request.params.id, Date.now(),"", session.username))
            .catch(error => {
                this.loggerService.error(error);
            })
            response.status(200).send();
        })
        .catch(error => {
            response.status(500).send(error);
        })
    }

    @httpDelete('/removetemperature/:id')
    public removeTemperature(request: Request, response: Response): void {
        this.loggerService.info('Received get all entries request');
        let session: Session = response.locals.session;

        this.databaseService.removeTemperature(request.params.id)
        .then(() => {
            this.databaseService.insertNewLog(new Log("Removed temperature : "+ request.params.id, Date.now(),"", session.username))
            .catch(error => {
                this.loggerService.error(error);
            })

            response.status(200).send();
        })
        .catch(error => {
            response.status(500).send(error);
        })
    }


    @httpPost('/addwindow')
    public insertWindow(request: Request, response: Response): void {
        this.loggerService.info('Received get all entries request');
        let session: Session = response.locals.session;

        this.databaseService.insertNewWindow(new WindowModel(request.body.room, request.body.isOpen, request.body.id, request.body.name))
        .then(() => {
            this.databaseService.insertNewLog(new Log("New window insert : "+ request.body.name +"|"+request.body.room , Date.now(),"", session.username))
            .catch(error => {
                this.loggerService.error(error);
            })
            response.status(200).send();
        })
        .catch(error => {
            response.status(500).send(error);
        })

        response.status(200).send();
    }

    @httpPost('/addlight')
    public insertLight(request: Request, response: Response): void {
        this.loggerService.info('Received get all entries request');
        let session: Session = response.locals.session;

        this.databaseService.insertNewLight(new Light(request.body.room, request.body.name, request.body.on, request.body.id))
        .then(() => {
            this.databaseService.insertNewLog(new Log("New light insert : "+ request.body.name +"|"+request.body.room, Date.now(),"", session.username))
            .catch(error => {
                this.loggerService.error(error);
            })
            response.status(200).send();
        })
        .catch(error => {
            response.status(500).send(error);
        })
    }

    @httpPost('/addtemperature')
    public insertNewTemperature(request: Request, response: Response): void {
        this.loggerService.info('Received get all entries request');
        let session: Session = response.locals.session;

        this.databaseService.insertNewTemperature(new Temperature(request.body.room, request.body.actualTemperature, request.body.targetTemperature, ""))
        .then(() => {
            this.databaseService.insertNewLog(new Log("New temperature insert : "+ request.body.name +"|"+request.body.room, Date.now(),"", session.username))
            .catch(error => {
                this.loggerService.error(error);
            })

            response.status(200).send();
        })
        .catch(error => {
            response.status(500).send(error);
        })
    }


    @httpGet('/configdata')
    public getAllConfigdata(request: Request, response: Response): void {
        this.loggerService.info('Received get all configdata request');

        let config = new ConfigDevicesUsers();
        
        this.databaseService.getAllLights()
            .then((contacts: Array<Light>) => {
                config.lights = contacts;
            })
            .catch((error) => {
                response.status(500).send('error occurred while fetching data from database')
            })

        this.databaseService.getAllWindows()
            .then((contacts: Array<WindowModel>) => {
                config.windows = contacts;
            })
            .catch((error) => {
                response.status(500).send('error occurred while fetching data from database')
            })

        this.databaseService.getAllTemperatures()
            .then((contacts: Array<Temperature>) => {
                config.temperatures = contacts;
            })
            .catch((error) => {
                response.status(500).send('error occurred while fetching data from database')
            })

        this.databaseService.getAllUsers()
            .then((contacts: Array<User>) => {
                config.users = contacts;
            })
            .catch((error) => {
                response.status(500).send('error occurred while fetching data from database')
            })

        response.status(200).send(config);
    }
}