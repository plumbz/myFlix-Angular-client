import { Component } from '@angular/core';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { Router } from '@angular/router';

/**
 * Root component of the MyFlix Angular application.
 * Manages top-level dialogs and routing such as login, registration, and logout.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /**
   * The title of the application.
   */
  title = 'myFlix-Angular-client';

  /**
   * Creates an instance of the root component.
   * 
   * @param dialog Angular Material dialog service for opening modal windows
   * @param router Angular Router for navigation
   */
  constructor(public dialog: MatDialog, public router: Router) { }

  /**
   * Opens the user registration dialog.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'
    });
  }

  /**
   * Opens the user login dialog.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px'
    });
  }

  /**
   * Opens the movie card dialog component.
   */
  openMoviesDialog(): void {
    this.dialog.open(MovieCardComponent, {
      width: '500px'
    });
  }

  /**
   * Logs out the current user by removing session and local storage tokens,
   * and redirects the user to the welcome page.
   */
  logout(): void {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');

    this.router.navigate(['/welcome']);
    console.log('User logged out');
  }
}
