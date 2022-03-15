import {controller, httpDelete, httpGet, httpPost, httpPut, interfaces} from "inversify-express-utils";
import {inject, injectable} from "inversify";
import {DatabaseService} from "../../core/services/database.service";
import {LoggerService} from "../../core/services/logger.service";
import {Request, Response} from 'express';
import {User} from "../../../Shared/user.model";
import { encodeSession } from "../../JWT/encodeSession";
import { Temperature } from "../../../Shared/temperature.model";
import { WindowModel } from "../../../Shared/window.model";
import { Light } from "../../../Shared/light.model";
import { Log } from "../../../Shared/log.model";
import * as HS512_key from '../../Environment/HS512_key.json';


@controller('/user')
@injectable()
export class LoginController implements interfaces.Controller {
    constructor(
        @inject(DatabaseService.name) private databaseService: DatabaseService,
        @inject(LoggerService.name) private loggerService: LoggerService,
    ) {
    }

    @httpPost('/login')
    public loginUser(request: Request, response: Response): void {
        this.loggerService.info('Received login request');
        this.databaseService.getAllUsers().then((result: Array<User>) => {
            let user = result.find(x => x.password == request.body.password && x.username == request.body.username)
            if (user == undefined) {
                this.loggerService.info('invalid login request');
                response.status(401).send({
                    message: 'Wrong credentials.'
                })
            } else {
                user.password = '';
                const session = encodeSession(HS512_key.key, {
                    id: user.id,
                    username: user.username,
                    dateCreated: Date.now()        
                });

                user.jwtToken = session.token;
                
                response.status(201).json(user);
                this.loggerService.info('valid login request');
            }
        });
    }

    @httpPost('/adddata')
    public insertTestData(request: Request, response: Response): void {
        this.loggerService.info('Received get all entries request');

        this.databaseService.insertNewTemperature(new Temperature("Vorzimmer", 21, 21, ""));
        this.databaseService.insertNewTemperature(new Temperature("Schlafzimmer", 19, 21, ""));
        this.databaseService.insertNewTemperature(new Temperature("Badezimmer", 22, 21, ""));

        this.databaseService.insertNewWindow(new WindowModel("Schlafzimmer", true, "", "1"));
        this.databaseService.insertNewWindow(new WindowModel("Vorzimmer", false, "", "2"));
        this.databaseService.insertNewWindow(new WindowModel("Badezimmer", true, "", "3"));

        this.databaseService.insertNewLight(new Light("Schlafzimmer", "Nachtlicht", true, ""));
        this.databaseService.insertNewLight(new Light("Schlafzimmer", "Raumlicht", false, ""));
        this.databaseService.insertNewLight(new Light("Vorzimmer", "Raumlicht", false, ""));
        this.databaseService.insertNewLight(new Light("Badezimmer", "Hintergrundbeleuchtung", true, ""));

        this.databaseService.insertNewLog(new Log("Upload test data success", Date.now(),"","SuperAdmin"))

        this.databaseService.insertUser(new User("Superuser","123","",["Admin","User"]));
        this.databaseService.insertUser(new User("User","123","",["User"]));

        response.status(200).send();
    }
}