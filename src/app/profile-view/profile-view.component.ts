import { Component, OnInit, } from '@angular/core';
import { MovieApiService } from '../fetch-api-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component'; // Import your dialog component
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog

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
  editForm: FormGroup;
  isEditing: boolean = false;
  errorMessage: string = '';
  movies: any[] = [];
  favoriteMovies: any[] = [];
  isLoading: boolean = true; // Track loading state



  constructor(private fetchApiData: MovieApiService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog // Inject MatDialog
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


  ngOnInit(): void {
    this.getUser();
    this.loadFavoriteMovies();
  }
  getUser(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      const loggedinUser = localStorage.getItem('user');
      this.user = resp.find((user: any) => user.username === loggedinUser);
      this.editForm.patchValue({
        username: this.user.username,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        birthday: this.user.birthday,
      });
      return this.user;
    });
  }

  saveChanges(): void {
    if (this.editForm.valid) {
      console.log(this.editForm.value)
      const loggedinUser = localStorage.getItem('user');
      if (loggedinUser) {
        this.fetchApiData.editUserData(loggedinUser, this.editForm.value).subscribe((resp: any) => {

        });

      }
    }
  }
  cancel(): void {
    this.isEditing = false;
  }
  editProfile(): void {
    this.isEditing = true;
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

  loadFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (movies: any[]) => {
        // console.log('All movies:', movies); // Debug all movies fetched
        this.favoriteMovies = movies.filter((movie) =>
          this.user.favorites.includes(movie._id)
        );
        // console.log('Filtered favoriteMovies:', this.favoriteMovies); // Debug favorites
        this.isLoading = false; // Loading complete
      },
      (err: any) => {
        // console.error('Error fetching all movies:', err);
        this.isLoading = false; // Ensure loading state is false on error
      }
    );
  }
  removeFavorite(movie: any): void {
    this.fetchApiData.deleteMovieFromUserFavorites(this.user.username, movie.title).subscribe(
      () => {
        // console.log(`${movie.Title} removed from favorites.`);
        this.favoriteMovies = this.favoriteMovies.filter(
          (favMovie) => favMovie._id !== movie._id
        ); // Correctly update the UI
      },
      (error) => {
        // console.error(`Error removing ${movie.Title} from favorites:`, error);
        this.snackBar.open(
          `Could not remove ${movie.title} from favorites.`,
          'OK',
          { duration: 3000 }
        );
      }
    );
  }
  // Method to open the dialog and display movie details
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
