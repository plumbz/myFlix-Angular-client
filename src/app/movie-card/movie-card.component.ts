import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { MovieApiService } from '../fetch-api-data.service'
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component'; // Import your dialog component


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: MovieApiService,
    public dialog: MatDialog // Inject MatDialog
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
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
}
