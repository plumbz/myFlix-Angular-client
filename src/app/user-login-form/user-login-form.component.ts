// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { MovieApiService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  @Input() userData = { username: '', password: '' };

  constructor(
    public fetchApiData: MovieApiService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }


  // This is the function responsible for sending the form inputs to the backend
  LoginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      // Assuming the response contains the token under result.token
      const token = result.token;
      const user = result.user.username;

      if (token) {
        // Store the token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
        // Close the dialog on successful login
        this.dialogRef.close();

        // Show a success notification
        this.snackBar.open('Login successful', 'OK', {
          duration: 2000
        });

        // Optionally, you can redirect the user to a different route after login
        // this.router.navigate(['/dashboard']); // Uncomment this if you have a routing setup
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