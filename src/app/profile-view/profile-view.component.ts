import { Component, OnInit } from '@angular/core';
import { MovieApiService } from '../fetch-api-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Component for the user profile view.
 * It provides methods to fetch, edit, and delete user data.
 * It also fetches and displays favorite movies.
 */
@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
  /** Stores the user data */
  user: any;

  /** Form group for editing the user profile */
  editForm: FormGroup;

  /** Indicates if the user is in edit mode */
  isEditing: boolean = false;

  /** Error message to be displayed (if any) */
  errorMessage: string = '';

  /** All movies available */
  movies: any[] = [];

  /** List of user's favorite movies */
  favoriteMovies: any[] = [];

  /** Loading state for async operations */
  isLoading: boolean = true;

  /**
   * Constructor to inject required services.
   * @param fetchApiData Service to handle API requests
   * @param formBuilder Angular service to build reactive forms
   * @param snackBar Angular Material Snackbar service
   * @param dialog Angular Material Dialog service
   */
  constructor(
    private fetchApiData: MovieApiService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.editForm = this.formBuilder.group({
      username: [''],
      firstName: [''],
      lastName: [''],
      password: [''],
      email: [''],
      birthday: ['']
    });
  }

  /**
   * Lifecycle hook that runs when the component is initialized.
   * Fetches the user and their favorite movies.
   */
  ngOnInit(): void {
    this.getUser();
    this.loadFavoriteMovies();
  }

  /**
   * Fetches the current user's data and updates the edit form.
   */
  getUser(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp
      this.editForm.patchValue({
        username: this.user.username,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        birthday: this.user.birthday,
      });
    });
  }

  /**
   * Saves changes to the user's profile.
   * Sends updated form data to the API.
   */
  saveChanges(): void {
    if (this.editForm.valid) {
      const loggedinUser = localStorage.getItem('user');
      if (loggedinUser) {
        this.fetchApiData.editUserData(loggedinUser, this.editForm.value).subscribe();
      }
    }
  }

  /**
   * Cancels profile editing.
   */
  cancel(): void {
    this.isEditing = false;
  }

  /**
   * Enables profile editing mode.
   */
  editProfile(): void {
    this.isEditing = true;
  }

  /**
   * Deletes the user's profile after confirmation.
   */
  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your profile?')) {
      this.fetchApiData.deleteUser(this.user.username).subscribe(
        (response) => {
          console.log('Profile deleted successfully:', response);
        },
        (error) => {
          console.error('Error deleting profile:', error);
        }
      );
    }
  }

  /**
   * Loads all movies and filters them to find user's favorites.
   */
  loadFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (movies: any[]) => {
        this.favoriteMovies = movies.filter((movie) =>
          this.user.favorites.includes(movie._id)
        );
        this.isLoading = false;
      },
      (err: any) => {
        this.isLoading = false;
      }
    );
  }

  /**
   * Removes a movie from the user's list of favorites.
   * @param movie The movie to remove
   */
  removeFavorite(movie: any): void {
    this.fetchApiData.deleteMovieFromUserFavorites(this.user.username, movie.title).subscribe(
      () => {
        this.favoriteMovies = this.favoriteMovies.filter(
          (favMovie) => favMovie._id !== movie._id
        );
      },
      (error) => {
        this.snackBar.open(
          `Could not remove ${movie.title} from favorites.`,
          'OK',
          { duration: 3000 }
        );
      }
    );
  }

  /**
   * Opens a dialog with movie details.
   * @param type Type of detail to show ('genre', 'director', or 'synopsis')
   * @param movie The movie whose details are shown
   */
  openDetailDialog(type: string, movie: any): void {
    let data;

    switch (type) {
      case 'genre':
        data = { title: movie.title, genre: movie.genre };
        break;
      case 'director':
        data = { title: movie.title, director: movie.director };
        break;
      case 'synopsis':
        data = { title: movie.title, synopsis: movie.description };
        break;
    }

    this.dialog.open(MovieDetailDialogComponent, {
      data: data
    });
  }
}
