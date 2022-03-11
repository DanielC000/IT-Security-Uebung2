import {inject, injectable} from 'inversify';
import {LoggerService} from './logger.service';
import {Connection, r, RConnectionOptions, RDatum} from 'rethinkdb-ts';
import * as databaseConfiguration from './../configuration/database-config.json';
import {Admin} from "../../models/admin.model";
import {Contact} from "../../models/entry.model";


@injectable()
export class DatabaseService {
    constructor(
        @inject(LoggerService.name) private loggerService: LoggerService
    ) {
    }

    public async initialize(): Promise<boolean> {
        const connection = await this.connect();
        r.dbList()
            .contains(databaseConfiguration.databaseName)
            .do((containsDatabase: RDatum<boolean>) => {
                return r.branch(
                    containsDatabase,
                    {created: 0},
                    r.dbCreate(databaseConfiguration.databaseName)
                );
            })
            .run(connection)
            .then(() => {
                this.loggerService.info('Trying to create tables');
                this.createTables(connection)
                    .then(() => {
                        this.loggerService.info('Tables created');
                        return Promise.resolve(true);
                    })
                    .catch((error) => {
                        this.loggerService.error(error);
                        return Promise.reject(false);
                    });
            });
        return Promise.resolve(true);
    }

    public getAllAdmins(): Promise<Array<Admin>> {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('adminTable')
                    .filter({})
                    .run(connection)
                    .then((response: Array<Admin>) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        this.loggerService.error(error, 'Error while retrieving entries');
                    });
            });
        });
    }


    private createTables(connection: Connection): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const promises = new Array<Promise<boolean>>();
            databaseConfiguration.databaseTables.forEach((table) => {
                promises.push(this.createTable(connection, table));
            });
            Promise.all(promises)
                .then(() => {
                    resolve(true);
                })
                .catch((error) => {
                    this.loggerService.error(error);
                    reject(false);
                });
        });
    }

    private createTable(
        connection: Connection,
        tableName: string
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            r.db(databaseConfiguration.databaseName)
                .tableList()
                .contains(tableName)
                .do((containsTable: RDatum<boolean>) => {
                    return r.branch(
                        containsTable,
                        {create: 0},
                        r.db(databaseConfiguration.databaseName).tableCreate(tableName)
                    );
                })
                .run(connection)
                .then(() => {
                    resolve(true);
                })
                .catch((error) => {
                    this.loggerService.error(error);
                    reject(false);
                });
        });
    }

    private connect(): Promise<Connection> {
        const rethinkDbOptions: RConnectionOptions = {
            host: databaseConfiguration.databaseServer,
            port: databaseConfiguration.databasePort,
        };
        return new Promise((resolve, reject) => {
            r.connect(rethinkDbOptions)
                .then((connection: Connection) => {
                    resolve(connection);
                })
                .catch(reject);
        });
    }

    public insertNewAdmin(admin: Admin): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                r.table("adminTable")
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
                    .catch((error) => {
                        this.loggerService.error(error, 'Error while inserting new entries');
                        reject(false);
                    });
            });
        })
    }

    insertNewContact(contact: Contact) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                r.table("contactTracingTable")
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
                    .catch((error) => {
                        this.loggerService.error(error, 'Error while inserting new entries');
                        reject(false);
                    });
            });
        })
    }

    public getAllContacts(): Promise<Array<Contact>> {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('contactTracingTable')
                    .filter({})
                    .run(connection)
                    .then((response: Array<Contact>) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        this.loggerService.error(error, 'Error while retrieving entries');
                    });
            });
        });
    }

    deleteContact(id: string) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('contactTracingTable')
                    .get(id)
                    .delete()
                    .run(connection)
                    .then(
                        () => {
                            this.loggerService.info('if existing, deleted user with id:' + id);
                            resolve('entry deleted');
                        }
                    )
                    .catch(
                        (error) => {
                            this.loggerService.error('failed deleting user:' + id);
                            this.loggerService.error(error);
                            reject(error);
                        }
                    )

            });
        });


    }

    editContact(contact: Contact) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
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
                    .then(() => {
                        this.loggerService.info('successfully edited entry.');
                        resolve('entry edited.');
                    })
                    .catch(error => {
                        this.loggerService.error('failed editing entry.');
                        reject(error);
                    });
            });
        });
    }

    editAdmin(id: string, username: string, email: string, profileImg: string) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('adminTable')
                    .get(id)
                    .update({
                        username: username,
                        email: email,
                        profileImg: profileImg,
                    }).run(connection)
                    .then(() => {
                        this.loggerService.info('successfully edited admin.');
                        resolve('admin edited.');
                    })
                    .catch(error => {
                        this.loggerService.error('failed editing admin.');
                        reject(error);
                    });
            })
        })
    }

    getAdminWithId(id: string): Promise<Admin> {
        return new Promise((resolve, reject) => {
            this.connect()
                .then((connection: Connection) => {
                    r.db(databaseConfiguration.databaseName)
                        .table('adminTable')
                        .get(id)
                        .run(connection)
                        .then((admin: Admin) => {
                            this.loggerService.info('found admin');
                            resolve(admin);
                        })
                        .catch(error => {
                            this.loggerService.error('could not fetch admin');
                            reject(null);
                        })
                })
                .catch(error => {
                    this.loggerService.error('could not create connection to db.')
                    this.loggerService.error(error);
                    reject(null);
                })
        })
    }

    changeAdminPassword(newPassword: string, id: string) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('adminTable')
                    .get(id)
                    .update({
                        password: newPassword
                    }).run(connection)
                    .then(() => {
                        this.loggerService.info('successfully updated admin password.');
                        resolve('admin password changed.');
                    })
                    .catch(error => {
                        this.loggerService.error('failed editing admin.');
                        reject(error);
                    });
            })
        })
    }

    checkInUser(firstName: string, lastName: string, timeNow: string, dateNow: string, code: string) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
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
                    .then(() => {
                        this.loggerService.info('successfully checked in user:' + code);
                        resolve(code);
                    })
                    .catch(error => {
                        this.loggerService.error('failed checking user in:' + code);
                        this.loggerService.error(error);
                        reject('failed checking user in');
                    })

            })
                .catch(error => {
                    this.loggerService.error(error);
                    this.loggerService.error('failed connecting to DB for check in of:' + code);
                })
        })
    }

    checkOutUser(code: string, time: string, date: string) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('userChecks')
                    .filter({
                        "code": code
                    })
                    .update({
                        checkOutTime: time,
                        checkOutDate: date
                    })
                    .run(connection)
                    .then(() => {
                        this.loggerService.info('successfully checked out user:' + code);
                        resolve('checked out user successfully');
                    })
                    .catch(error => {
                        this.loggerService.info('successfully checked out user:' + code);
                        this.loggerService.info(error);
                        reject(error);
                    })
            })
        })

    }
}
