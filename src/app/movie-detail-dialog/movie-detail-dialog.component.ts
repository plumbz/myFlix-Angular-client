import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-detail-dialog',
  template: `
    <h1 mat-dialog-title class="dialog-title"><strong>{{ data.title }}</strong></h1>
    <div mat-dialog-content class="dialog-content">
      <p *ngIf="data.director"><strong>Director</strong>  <br>
      <strong>Name: </strong>{{ data.director.name }} <br>
      <strong>Bio: </strong>{{ data.director.bio}}
    </p>
      <p *ngIf="data.genre"><strong>Genre</strong> <br>
      <strong>Name: </strong>{{ data.genre.name }} <br>
      <strong>Description: </strong>{{ data.genre.description}}
    </p>
      <p *ngIf="data.synopsis"><strong>Synopsis</strong> <br> {{ data.synopsis }}</p>
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="closeDialog()">Close</button>
    </div>
    
  `,
  styles: [
    `
      .dialog-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      }

      .dialog-actions {
        display: flex;
        justify-content: center;
      }

      .dialog-title {
        text-align: center;
      }
    `
  ]
})
export class MovieDetailDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,        // Inject movie data
    private dialogRef: MatDialogRef<MovieDetailDialogComponent>  // Inject MatDialogRef to close the dialog
  ) { }

  closeDialog(): void {
    // Close the dialog
    this.dialogRef.close();
  }
}

