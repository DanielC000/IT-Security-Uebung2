import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import {Log} from '../../../../../Shared/log.model';
import { Router } from '@angular/router';

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

  entries!: Array<Log>;
  columnsToDisplay = ['date', 'user'];
  expandedElement!: Log | null;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
