import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { HttpService } from './service/app.service';

import { TopSeriesComponent } from './components/top-series/top-series.component';
import { RatingsComponent } from './components/ratings/ratings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RatingsComponent, TopSeriesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  series: any;
  reviews: any;

  constructor(private httpService: HttpService) {
    this.httpService
      .getSeries()
      .subscribe((response: any) => (this.series = response));

    this.httpService
      .getReviews()
      .subscribe((response: any) => (this.reviews = response));
  }

  ngOnInit(): void {}
}
