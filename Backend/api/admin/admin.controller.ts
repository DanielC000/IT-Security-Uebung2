import {controller, httpDelete, httpGet, httpPost, httpPut, interfaces} from "inversify-express-utils";
import {inject, injectable} from "inversify";
import {DatabaseService} from "../../core/services/database.service";
import {LoggerService} from "../../core/services/logger.service";
import {Request, Response} from 'express';
import {Contact} from "../../models/entry.model";
import {Admin} from "../../models/admin.model";

@controller('/admin')
@injectable()
export class AdminController implements interfaces.Controller {
    constructor(
        @inject(DatabaseService.name) private databaseService: DatabaseService,
        @inject(LoggerService.name) private loggerService: LoggerService,
    ) {
    }

    @httpPost('/create')
    public createContact(request: Request, response: Response): void {
        this.loggerService.info('Received new create entry request');
        this.databaseService.insertNewContact(
            new Contact(request.body.name,
                request.body.street,
                request.body.city,
                request.body.zipCode,
                request.body.state,
                request.body.country,
                ''))
            .then(() => {
                this.loggerService.info('New entry inserted');
                response.status(200).send();
            }).catch((error) => {
                response.status(400).send('insert failed');
            }
        )
    }

    @httpGet('/entries')
    public getAllContacts(request: Request, response: Response): void {
        this.loggerService.info('Received get all entries request');
        this.databaseService.getAllContacts()
            .then((contacts: Array<Contact>) => {
                response.status(200).send(contacts);
            })
            .catch((error) => {
                response.status(500).send('error occurred while fetching data from database')
            })
    }

    @httpDelete('/delete/:id')
    public deleteContact(request: Request, response: Response): void {
        this.loggerService.info('Received delete entry request');
        this.databaseService.deleteContact(request.params.id)
            .then(
                () => {
                    response.status(200).send();
                }
            )
            .catch(
                error => {
                    response.status(500).send(error);
                }
            )
    }

    @httpPut('/editEntry')
    public editContact(request: Request, response: Response): void {
        this.loggerService.info(request.body.id);
        this.loggerService.info('received edit entry request');
        this.databaseService.editContact(
            new Contact(request.body.name,
                request.body.street,
                request.body.city,
                request.body.zipCode,
                request.body.state,
                request.body.country,
                request.body.id
            ))
            .then(() => {
                response.status(200).send();
            })
            .catch(error => {
                response.status(500).send(error);
            })
    }

    @httpPut('/editAdmin')
    public editAdmin(request: Request, response: Response): void {
        this.loggerService.info(request.body.id);
        this.loggerService.info('received edit admin account request');

        this.databaseService.editAdmin(request.body.id, request.body.username, request.email, request.body.profileImg)
            .then(() => {
                response.status(200).send();
            })
            .catch((error) => {
                response.status(500).send(error);
            });
    }

    @httpPut('/changePassword')
    public changePassword(request: Request, response: Response): void {
        this.loggerService.info(request.body.id);
        this.loggerService.info('received change password request');

        this.databaseService.getAdminWithId(request.body.id)
            .then((admin: Admin) => {
                if (admin.password == request.body.currentPassword) {
                    this.databaseService.changeAdminPassword(request.body.newPassword, request.body.id)
                        .then(() => {
                            this.loggerService.info('successfully changed admin password');
                            response.status(200).send();
                        })
                        .catch((error) => {
                            this.loggerService.error(error);
                            response.status(500).send(error);
                        })
                } else {
                    this.loggerService.error('wrong password');
                    response.status(403).send('wrong password');
                }
            })
            .catch((error) => {
                this.loggerService.error(error);
                this.loggerService.error('admin account could not be found');
                response.status(404).send('admin account could not be found');
            });
    }
}