// src/app/app.component.ts
import { Component } from '@angular/core';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myFlix-Angular-client';

  constructor(public dialog: MatDialog,
    public router: Router) { }
  // This is the function that will open the dialog when the signup button is clicked  
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      // Assigning the dialog a width
      width: '280px'
    });
  }
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      // Assigning the dialog a width
      width: '280px'
    });
  }
  openMoviesDialog(): void {
    this.dialog.open(MovieCardComponent, {
      width: '500px'
    });
  }
  // Method to log out the user
  logout(): void {
    // Clear any stored session or token
    localStorage.removeItem('authToken'); // Example: remove authentication token
    sessionStorage.removeItem('authToken'); // Example: remove token from sessionStorage
    localStorage.removeItem('user'); // Example: remove authentication token
    sessionStorage.removeItem('user'); // Example: remove token from sessionStorage

    // Optionally, redirect to the login page after logging out
    this.router.navigate(['/welcome']); // Navigate to the login page
    console.log('User logged out');
  }
}