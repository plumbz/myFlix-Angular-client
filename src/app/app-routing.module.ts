import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileViewComponent } from './profile-view/profile-view.component';

/**
 * Application routes.
 * 
 * Defines the routes used in the application.
 */
const routes: Routes = [
  /**
   * Route to the user profile view.
   */
  { path: 'profile', component: ProfileViewComponent }
];

/**
 * The root routing module for the application.
 * Registers all application-wide routes and exports them for use in the app.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
