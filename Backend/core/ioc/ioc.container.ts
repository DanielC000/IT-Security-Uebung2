import 'reflect-metadata';
import {Container} from 'inversify';
import {interfaces, TYPE} from 'inversify-express-utils';
import {LoggerService} from '../services/logger.service';
import {DatabaseService} from '../services/database.service';
import {LoginController} from '../../api/login/login.controller';
import {ConfigurationDeviceUserController} from "../../api/config/ConfigurationDeviceUser.controller";
import {OverviewController} from "../../api/overview/overview.controller";


export class IoContainer {
    private container = new Container();

    public init(): void {
        this.initServices();
        this.initController();
    }

    public getContainer(): Container {
        return this.container;
    }

    private initController(): void {
        this.container.bind<interfaces.Controller>(TYPE.Controller)
            .to(LoginController)
            .whenTargetNamed(LoginController.name);
        this.container.bind<interfaces.Controller>(TYPE.Controller)
            .to(OverviewController)
            .whenTargetNamed(OverviewController.name);
        this.container.bind<interfaces.Controller>(TYPE.Controller)
            .to(ConfigurationDeviceUserController)
            .whenTargetNamed(ConfigurationDeviceUserController.name);
    }

    private initServices(): void {
        this.container
            .bind<LoggerService>(LoggerService.name)
            .to(LoggerService)
            .inSingletonScope();
        this.container
            .bind<DatabaseService>(DatabaseService.name)
            .to(DatabaseService)
            .inSingletonScope();
    }
}
