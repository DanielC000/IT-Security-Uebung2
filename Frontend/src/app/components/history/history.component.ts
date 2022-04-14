import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import {Log} from '../../../../../Shared/log.model';
import { Router } from '@angular/router';
import { HistoryService } from 'src/app/services/history/history.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class HistoryComponent implements OnInit {

  @ViewChild(MatSort) Sort!: MatSort;

  logs!: Array<Log>;
  columnsToDisplay = ['date', 'username'];
  expandedElement!: Log | null;

  constructor(private router: Router,
              private historyService: HistoryService,
              private loggerService: LoggerService) { }

  ngOnInit(): void {
    this.getHistoryLogs();
  }

  getHistoryLogs() {
    this.historyService.getHistoryLogs()
      .subscribe({
        next: (value => {
            this.logs = value;
            console.log(this.logs);
            this.loggerService.log('got all entries')
          }
        ),
        error: err => {
          this.loggerService.log('error occurred while loading data');
          this.loggerService.log(err);
        }
      });
  }

}
