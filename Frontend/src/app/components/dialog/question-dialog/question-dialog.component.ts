import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss']
})
export class QuestionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<QuestionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,) {
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick() {
    this.dialogRef.close(true);
  }
}
