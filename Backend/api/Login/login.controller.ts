import {controller, httpDelete, httpGet, httpPost, httpPut, interfaces} from "inversify-express-utils";
import {inject, injectable} from "inversify";
import {DatabaseService} from "../../core/services/database.service";
import {LoggerService} from "../../core/services/logger.service";
import {Request, Response} from 'express';
import {Contact} from "../../models/entry.model";
import {Admin} from "../../models/admin.model";
import {User} from "../../../Shared/user.model";

@controller('/admin')
@injectable()
export class AdminController implements interfaces.Controller {
    constructor(
        @inject(DatabaseService.name) private databaseService: DatabaseService,
        @inject(LoggerService.name) private loggerService: LoggerService,
    ) {
    }

    @httpPost('/login')
    public loginAdmin(request: Request, response: Response): void {
        this.loggerService.info('Received login request');
        this.loggerService.info(request.body.username);

        this.databaseService.getAllAdmins().then((result: Array<Admin>) => {
            let admin = result.find(x => x.password == request.body.password && x.username == request.body.username)
            if (admin == undefined) {
                this.loggerService.info('invalid login request');
                response.status(401).send({
                    message: 'Wrong credentials.'
                })
            } else {
                admin.password = '';
                response.status(200).send(admin);
                this.loggerService.info('valid login request');
            }
        });
    }
}