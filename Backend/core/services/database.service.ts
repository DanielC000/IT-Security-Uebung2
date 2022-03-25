import {inject, injectable} from 'inversify';
import {LoggerService} from './logger.service';
import {Connection, r, RConnectionOptions, RDatum} from 'rethinkdb-ts';
import * as databaseConfiguration from './../configuration/database-config.json';
import { User } from '../../../Shared/user.model';
import { Light } from '../../../Shared/light.model';
import { Temperature } from '../../../Shared/temperature.model';
import { WindowModel } from '../../../Shared/window.model';
import { Log } from '../../../Shared/log.model';


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
    // --------- Remove --------------------
    removeWindow(id: String)
    {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('windowTable')
                    .get(id)
                    .delete()
                    .run(connection)
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

    removeTemperature(id: String)
    {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('temperatureTable')
                    .get(id)
                    .delete()
                    .run(connection)
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

    removeLight(id: String)
    {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('lightTable')
                    .get(id)
                    .delete()
                    .run(connection)
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


    // --------- Create ---------------------

    insertUser(user: User) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                r.table("userAdminTable")
                    .insert({
                        username: user.username,
                        password: user.password,
                        role: user.role,
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


    insertNewLight(light: Light) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                r.table("lightTable")
                    .insert({
                        name: light.name,
                        on: light.on,
                        room: light.room
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

    insertNewWindow(window: WindowModel) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                r.table("windowTable")
                    .insert({
                        name: window.name,
                        room: window.room,
                        isOpen: window.isOpen,
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

    insertNewTemperature(temperature: Temperature) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                r.table("temperatureTable")
                    .insert({
                        room: temperature.room,
                        actualTemperature: temperature.actualTemperature,
                        targetTemperature: temperature.targetTemperature,
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

    insertNewLog(log: Log) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                r.table("logTable")
                    .insert({
                        date: log.date,
                        username: log.username,
                        message: log.message
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

    // ----------Get--------------

    public getAllUsers(): Promise<Array<User>> {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('userAdminTable')
                    .filter({})
                    .run(connection)
                    .then((response: Array<User>) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        this.loggerService.error(error, 'Error while retrieving entries');
                    });
            });
        });
    }

    public getAllLights(): Promise<Array<Light>> {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('lightTable')
                    .filter({})
                    .run(connection)
                    .then((response: Array<Light>) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        this.loggerService.error(error, 'Error while retrieving entries');
                    });
            });
        });
    }

    public getAllWindows(): Promise<Array<WindowModel>> {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('windowTable')
                    .filter({})
                    .run(connection)
                    .then((response: Array<WindowModel>) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        this.loggerService.error(error, 'Error while retrieving entries');
                    });
            });
        });
    }

    public getAllTemperatures(): Promise<Array<Temperature>> {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('temperatureTable')
                    .filter({})
                    .run(connection)
                    .then((response: Array<Temperature>) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        this.loggerService.error(error, 'Error while retrieving entries');
                    });
            });
        });
    }

    public getAllLogs(): Promise<Array<Log>> {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('logTable')
                    .filter({})
                    .run(connection)
                    .then((response: Array<Log>) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        this.loggerService.error(error, 'Error while retrieving entries');
                    });
            });
        });
    }

    // ------------------- Edit ----------------------

    public changeUsername(id: String, newName: String) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('userAdminTable')
                    .get(id)
                    .update({
                        username: newName,
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

    public toggleLight(id: String) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('lightTable')
                    .get(id)
                    .update(function(post) {
                        return r.branch(
                            post("on").eq(true),
                            {on: false},
                            {on: true}
                        )
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

    public toggleWindow(id: String) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('windowTable')
                    .get(id)
                    .update(function(post) {
                        return r.branch(
                            post("isOpen").eq(true),
                            {isOpen: false},
                            {isOpen: true}
                        )
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

    public changeTargetTemperature(id: String, targetTemperature: Number) {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(databaseConfiguration.databaseName)
                    .table('temperatureTable')
                    .get(id)
                    .update({
                        targetTemperature: targetTemperature,
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


}
