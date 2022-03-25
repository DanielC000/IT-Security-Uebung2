import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-component-dialog',
  templateUrl: './add-component-dialog.component.html',
  styleUrls: ['./add-component-dialog.component.scss']
})
export class AddComponentDialogComponent implements OnInit {

  addComponentForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddComponentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    if (this.data == "window" || this.data == "light"){
      this.addComponentForm = this.formBuilder.group({
        name: ["", [Validators.required]],
        room: ["", [Validators.required]]
      });
    }
    if (this.data == "temperature"){
      this.addComponentForm = this.formBuilder.group({
        room: ["", [Validators.required]],
        targetTemp: ["", [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
      });
    }
  }
  onSubmit(){
    if (this.addComponentForm.invalid) {
      return;
    }

    this.dialogRef.close(this.addComponentForm.value);
  }
}
