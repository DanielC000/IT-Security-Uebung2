import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {QuestionDialogComponent} from "../question-dialog/question-dialog.component";
import {LoggerService} from "../../../services/logger/logger.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NativeObjectService} from "../../../services/native-object.service";
import {ActivatedRoute} from "@angular/router";
import {Entry} from "../../../models/entry.model";

@Component({
  selector: 'app-edit-entry-dialog',
  templateUrl: './edit-contact-dialog.component.html',
  styleUrls: ['./edit-contact-dialog.component.scss']
})
export class EditContactDialogComponent implements OnInit {

  editContactForm!: FormGroup;
  loading: boolean = false;

  constructor(public dialogRef: MatDialogRef<EditContactDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Entry,
              private loggerService: LoggerService,
              private registerFormBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.editContactForm = this.registerFormBuilder.group({
      name: [this.data.name, [Validators.required]],
      street: [this.data.street, [Validators.required]],
      city: [this.data.city, [Validators.required]],
      zip: [this.data.zipCode, [Validators.required]],
      state: [this.data.state, [Validators.required]],
      country: [this.data.country, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.editContactForm.invalid) {
      return;
    }

    let updatedContact = new Entry(
      this.editContactForm.value.name,
      this.editContactForm.value.street,
      this.editContactForm.value.city,
      this.editContactForm.value.zip,
      this.editContactForm.value.state,
      this.editContactForm.value.country,
      this.data.id
    )

    this.dialogRef.close(updatedContact);
  }

  onBack(): void {
    this.dialogRef.close();
  }
}
