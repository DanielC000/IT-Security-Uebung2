import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Light} from "../../../../../Shared/light.model";
import {DevicesService} from "../../services/devices/devices.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public lightingDevices = new MatTableDataSource(new Array<Light>());

  constructor(private deviceService: DevicesService) { }

  ngOnInit(): void {
    this.getLightingDevices();
  }

  private getLightingDevices() {
    this.deviceService.getDevices().subscribe({
      next: ( (value: Array<Light>) => {
        console.log(value);
        this.lightingDevices.data = value;
      }),
      error: (err) =>{
        console.log(err);
      }
    })
  }
}
