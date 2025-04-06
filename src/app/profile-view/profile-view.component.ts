import { Component, OnInit, } from '@angular/core';
import { MovieApiService } from '../fetch-api-data.service';


@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})

/**
 * Component for the user profile view.
 * It provides methods to fetch, edit, and delete user data.
 * It also fetches and displays favorite movies.
 */
export class ProfileViewComponent implements OnInit {
  user: any; // Store the user data
  errorMessage: string = '';

  constructor(private fetchApiData: MovieApiService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }
  // Fetch user data from API
  loadUserProfile(): void {
    this.fetchApiData.getUser().subscribe(
      (data) => {
        this.user = data; // assign data to user object
      },
      (error) => {
        this.errorMessage = error; // handle error
      }
    );
  }
  editProfile(): void {
    // This could be a method to navigate to the edit form or open a modal
    console.log('Edit Profile clicked');
  }
  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your profile?')) {
      this.fetchApiData.deleteUser(this.user.username).subscribe(
        (response) => {
          console.log('Profile deleted successfully:', response);
          // After deleting, you could navigate to another page or log the user out
        },
        (error) => {
          console.error('Error deleting profile:', error);
        }
      );
    }
  }
}
