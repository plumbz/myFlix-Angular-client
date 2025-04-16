/**
 * The MovieCardComponent displays a list of movies and allows users to view movie details, 
 * manage their favorite movies, and interact with the backend API for user and movie data.
 * It provides functionality for adding/removing movies to/from the user's favorite list 
 * and viewing movie details through a dialog.
 */

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { MovieApiService } from '../fetch-api-data.service';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component'; // Import dialog component
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * A component that handles the display of movies, management of user favorites, 
 * and interaction with movie details via a dialog.
 * 
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  /** 
   * Array to hold all movies fetched from the API.
   * @type {any[]}
   */
  movies: any[] = [];

  /** 
   * Array to hold user's favorite movies.
   * @type {any[]}
   */
  favorites: any[] = [];

  /** 
   * Array to hold user details.
   * @type {any[]}
   */
  user: any[] = [];

  /**
   * Constructs the MovieCardComponent.
   * 
   * @param {MovieApiService} fetchApiData - Service to interact with the movie API.
   * @param {MatDialog} dialog - Dialog service to open modals for displaying movie details.
   * @param {MatSnackBar} snackBar - Service for displaying snack-bar notifications.
   */
  constructor(
    public fetchApiData: MovieApiService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  /**
   * Opens a dialog to display movie details based on the specified type.
   * 
   * @param {string} type - Type of movie detail to display (e.g., genre, director, synopsis).
   * @param {any} movie - The movie object whose details are to be displayed.
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

  /**
   * Lifecycle hook that is called when the component is initialized.
   * It fetches the current user and the list of movies.
   */
  ngOnInit(): void {
    this.getUser();
    this.getMovies();
  }

  /**
   * Toggles the addition/removal of a movie from the user's favorites.
   * If the movie is not in favorites, it will be added, otherwise, it will be removed.
   * 
   * @param {any} movie - The movie object to be added/removed from the favorites.
   */
  toggleFavorite(movie: any): void {
    const index = this.favorites.findIndex(fav => fav._id === movie._id);
    const user = localStorage.getItem('user');

    if (index === -1) {
      // Add movie to favorites if it's not already there
      this.favorites.push(movie);
      if (user) {
        this.fetchApiData.addMovieToUserFavorites(user, movie.title).subscribe((resp: any) => {
          console.log(`Added to favorites: ${movie.title}`);
        });
      } else {
        console.log('User not found');
      }
    } else {
      if (user) {
        this.fetchApiData.deleteMovieFromUserFavorites(user, movie.title).subscribe(
          () => {
            this.favorites = this.favorites.filter(
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
      this.favorites.splice(index, 1);
      console.log(`Removed from favorites: ${movie.title}`);
    }
  }

  /**
   * Checks whether a movie is already in the user's favorites.
   * 
   * @param {any} movie - The movie object to be checked.
   * @returns {boolean} - Returns true if the movie is in favorites, otherwise false.
   */
  isFavorite(movie: any): boolean {
    return this.favorites.some(fav => fav._id === movie._id);
  }

  /**
   * Fetches the list of movies from the API and assigns them to the movies array.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Fetches the details of the currently logged-in user from the API.
   * 
   * The user's information is fetched and stored in the user array.
   */
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
