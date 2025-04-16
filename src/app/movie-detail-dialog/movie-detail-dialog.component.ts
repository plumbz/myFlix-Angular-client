import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Component for displaying detailed movie information in a modal dialog.
 * 
 * Depending on the data provided, it can show:
 * - Director details
 * - Genre details
 * - Synopsis
 */
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
  /**
   * Creates an instance of MovieDetailDialogComponent.
   * 
   * @param data The movie data injected into the dialog (title, genre, director, or synopsis)
   * @param dialogRef Reference to the dialog box, used to close it
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MovieDetailDialogComponent>
  ) { }

  /**
   * Closes the dialog.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
