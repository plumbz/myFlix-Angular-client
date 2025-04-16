import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MovieApiService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * Component for user login form.
 * Handles user authentication by sending login data to the API.
 * Displays success or error messages and handles post-login behavior like storing the token and redirecting.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  /**
   * User input data model for login credentials.
   */
  @Input() userData = {
    username: '',
    password: ''
  };

  /**
   * Creates an instance of UserLoginFormComponent.
   * 
   * @param fetchApiData Service for making API requests
   * @param dialogRef Reference to the login dialog, used to close it on success
   * @param snackBar Material Snackbar service for user feedback
   * @param router Angular Router to navigate on successful login
   */
  constructor(
    public fetchApiData: MovieApiService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void { }

  /**
   * Sends login credentials to the backend.
   * On success:
   * - Stores the token and username in localStorage
   * - Shows a success snackbar
   * - Navigates to the main movie view
   * On error:
   * - Displays a snackbar with an error message
   */
  LoginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      const token = result.token;
      const user = result.user.username;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);

        this.dialogRef.close();

        this.snackBar.open('Login successful', 'OK', {
          duration: 2000
        });

        this.router.navigate(['movies']);
      } else {
        this.snackBar.open('No token received', 'OK', {
          duration: 2000
        });
      }

    }, (error) => {
      console.error('Login failed', error);
      this.snackBar.open('Login failed. Please try again!', 'OK', {
        duration: 2000
      });
    });
  }
}
