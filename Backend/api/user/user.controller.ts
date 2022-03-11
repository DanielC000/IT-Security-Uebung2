import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {controller, httpGet, httpPost, httpPut, interfaces, requestBody} from 'inversify-express-utils';
import {DatabaseService} from "../../core/services/database.service"
import {Admin} from "../../models/admin.model";
import {LoggerService} from "../../core/services/logger.service";
import {Contact} from "../../models/entry.model";
// @ts-ignore
import {uniqid} from 'uniqid';

@controller('/user')
@injectable()
export class UserController implements interfaces.Controller {
    constructor(
        @inject(DatabaseService.name) private databaseService: DatabaseService,
        @inject(LoggerService.name) private loggerService: LoggerService,
    ) {
    }

    @httpPost('/register')
    public registerAdmin(request: Request, response: Response): void {
        this.loggerService.info('Received user request');

        this.databaseService.getAllAdmins()
            .then((result: Array<Admin>) => {
                if (result.find(admin => admin.username == request.body.username && admin.password == request.body.password)) {
                    response.status(401).send({
                        message: 'Credentials taken'
                    })
                } else {
                    this.databaseService.insertNewAdmin(new Admin(request.body.username, request.body.password, request.body.email, '', ''))
                        .then(value => {
                            response.status(200).send("registration successful");
                        }).catch(error => {
                        response.status(401).send({
                            message: 'Insertion error occurred'
                        });
                    });
                }
            }).catch((error) => {
            response.status(400).send(error);
        });
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

    @httpPost('/checkin')
    public checkIn(request: Request, response: Response): void {
        this.loggerService.info('Received check in request');
        let code = Math.random().toString(36).substring(2, 9);

        this.databaseService.checkInUser(
            request.body.firstName,
            request.body.lastName,
            request.body.time,
            request.body.date,
            code).then(() => {
            response.status(200).send({
                body: code
            });
        })
            .catch(error => {
                response.status(400).send(error);
            })
    }

    @httpPut('/checkout')
    public checkOut(request: Request, response: Response): void {
        this.loggerService.info('Received check out request');

        this.databaseService.checkOutUser(request.body.code, request.body.date, request.body.time)
            .then(() => {
                response.status(200).send();
            })
            .catch(error => {
                this.loggerService.error(error);
                response.status(400).send();
            })
    }

    @httpGet('/alle')
    public getAllAdmins(request: Request, response: Response): void {
        this.loggerService.info('Received login request');

        this.databaseService.getAllAdmins()
            .then((result: Array<Admin>) => response.status(200)
                .send(result))
            .catch((error) => this.loggerService.error(error)
            );
    }

}

