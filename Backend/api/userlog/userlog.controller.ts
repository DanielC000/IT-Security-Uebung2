import {controller, httpDelete, httpGet, httpPost, httpPut, interfaces} from "inversify-express-utils";
import {inject, injectable} from "inversify";
import {DatabaseService} from "../../core/services/database.service";
import {LoggerService} from "../../core/services/logger.service";
import {Request, Response} from 'express';
import {User} from "../../../Shared/user.model";
import { encodeSession } from "../../JWT/encodeSession";
import { Log } from "../../../Shared/log.model";

@controller('/userlogs')
@injectable()
export class LoginController implements interfaces.Controller {
    constructor(
        @inject(DatabaseService.name) private databaseService: DatabaseService,
        @inject(LoggerService.name) private loggerService: LoggerService,
    ) {
    }

    @httpGet('/logs')
    public loginUser(request: Request, response: Response): void {
        this.loggerService.info('Received get all entries request');
        this.databaseService.getAllLogs()
            .then((contacts: Array<Log>) => {
                response.status(200).send(contacts);
            })
            .catch((error) => {
                response.status(500).send('error occurred while fetching data from database')
            })
    }
}