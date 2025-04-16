import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MovieApiService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component for user registration form.
 * Handles user sign-up by submitting user data to the backend API.
 * Displays feedback using snackbars and closes the dialog on success.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {
  /**
   * Input model containing user registration fields.
   */
  @Input() userData = {
    username: '',
    password: '',
    email: '',
    birthday: '',
    firstName: '',
    lastName: ''
  };

  /**
   * Creates an instance of UserRegistrationFormComponent.
   *
   * @param fetchApiData Service for API communication
   * @param dialogRef Reference to the dialog window, allowing it to be closed
   * @param snackBar Material snackbar service for displaying messages
   */
  constructor(
    public fetchApiData: MovieApiService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void { }

  /**
   * Submits user registration data to the backend.
   * On success: closes the dialog and displays a success snackbar.
   * On failure: shows an error message in a snackbar.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        this.dialogRef.close(); // Close modal on success
        this.snackBar.open(result, 'OK', {
          duration: 2000
        });
      },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000
        });
      }
    );
  }
}
