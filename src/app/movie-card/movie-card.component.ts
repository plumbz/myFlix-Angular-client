import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { MovieApiService } from '../fetch-api-data.service'
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component'; // Import your dialog component
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  favorites: any[] = [];  // Array to hold favorite movies
  user: any[] = [];
  constructor(
    public fetchApiData: MovieApiService,
    public dialog: MatDialog, // Inject MatDialog
    private snackBar: MatSnackBar
  ) { }

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

  ngOnInit(): void {
    this.getUser();
    this.getMovies();
  }

  toggleFavorite(movie: any): void {
    const index = this.favorites.findIndex(fav => fav._id === movie._id);
    const user = localStorage.getItem('user');

    if (index === -1) {
      // Add movie to favorites if it's not already there
      this.favorites.push(movie);
      if (user) {
        this.fetchApiData.addMovieToUserFavorites(user, movie.title).subscribe((resp: any) => {
          // Handle response here (optional)
          console.log(`Added to favorites: ${movie.title}`);
        });
      } else {
        console.log('User not found');
      }
    } else {
      if (user) {
        // Remove movie from favorites if it exists
        this.fetchApiData.deleteMovieFromUserFavorites(user, movie.title).subscribe(
          () => {
            // console.log(`${movie.Title} removed from favorites.`);
            this.favorites = this.favorites.filter(
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
      this.favorites.splice(index, 1);
      console.log(`Removed from favorites: ${movie.title}`);
    }
  }

  // Method to check if the movie is in the favorites list
  isFavorite(movie: any): boolean {
    return this.favorites.some(fav => fav._id === movie._id);
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
  getUser(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      const loggedinUser = localStorage.getItem('user');
      console.log('logged in user :');
      console.log(loggedinUser);
      this.user = resp.find((user: any) => user.username === loggedinUser);
      console.log(this.user);
      return this.user;
    });
  }
}
