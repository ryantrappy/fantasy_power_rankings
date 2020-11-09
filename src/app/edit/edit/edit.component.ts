import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TeamRanking} from '../../Models/TeamRanking';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditDialogComponent {
  description = '';

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeamRanking) {
    this.description = data.description;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  save(): void {
    this.data.description = this.description;
    this.dialogRef.close();
  }

}
