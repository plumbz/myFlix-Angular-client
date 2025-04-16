import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Base URL for the movie API.
 */
const apiUrl = 'https://movie-flix19-efb939257bd3.herokuapp.com/';

/**
 * Service for interacting with the MovieFlix API.
 * Handles user authentication, movie retrieval, user profile operations, and managing favorites.
 */
@Injectable({
  providedIn: 'root'
})
export class MovieApiService {
  /**
   * Initializes the MovieApiService with HttpClient.
   * @param http The Angular HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * Registers a new user.
   * @param userDetails Object containing user details.
   * @returns Observable of server response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs in an existing user.
   * @param userDetails Object with username and password.
   * @returns Observable of login response.
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all movies.
   * @returns Observable of movies array.
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a specific movie by title.
   * @param title The title of the movie.
   * @returns Observable of movie details.
   */
  public getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}movies/${title}`, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a director's details by name.
   * @param directorName The name of the director.
   * @returns Observable of director information.
   */
  public getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}directors/${directorName}`, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves genre information by name.
   * @param genre The name of the genre.
   * @returns Observable of genre data.
   */
  public getGenre(genre: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}genres/${genre}`, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all user profiles.
   * @returns Observable of all users.
   */
  public getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users', {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Adds a movie to a user's list of favorites.
   * @param userName The username of the user.
   * @param title The movie title to add.
   * @returns Observable of server response.
   */
  public addMovieToUserFavorites(userName: string, title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${apiUrl}users/${userName}/favorites/${title}`, null, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Updates a user's information.
   * @param userName The username.
   * @param userDetails Updated user details.
   * @returns Observable of update result.
   */
  public editUserData(userName: string, userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${apiUrl}users/${userName}`, userDetails, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a user account.
   * @param userName The username of the user.
   * @returns Observable of server response.
   */
  public deleteUser(userName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${apiUrl}users/${userName}`, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Removes a movie from the user's list of favorites.
   * @param userName The username.
   * @param title The title of the movie to remove.
   * @returns Observable of server response.
   */
  public deleteMovieFromUserFavorites(userName: string, title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${apiUrl}users/${userName}/favorites/${title}`, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Extracts response data from HTTP response.
   * @param res The response object.
   * @returns The response body or empty object.
   */
  private extractResponseData(res: any): any {
    return res || {};
  }

  /**
   * Handles HTTP errors.
   * @param error The HTTP error response.
   * @returns An observable with an error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side/network error occurred:', error.error.message);
    } else {
      console.error(`Error Status code ${error.status}, Body: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
