import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { HttpService } from '../../service/app.service';

@Component({
  selector: 'app-top-series',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-series.component.html',
  styleUrls: ['./top-series.component.css'],
})
export class TopSeriesComponent implements OnInit {
  @Input() series: any;
  @Input() reviews: any;

  averages: any;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.averages = this.sortSeriesByRating();

    this.httpService
      .getSeries()
      .subscribe((response: any) => (this.series = response));
  }

  /**
   * Calcula la valoración media de dicha serie.
   */
  calculateAverage = () => {
    return this.series?.map((serie: any) => {
      const serieReviews = this.reviews.filter(
        (review: any) => review.idSerie === serie.id
      );

      const totalRatings = serieReviews.reduce(
        (sum: number, review: any) => sum + review.personalRating,
        0
      );

      const averageRating = totalRatings / serieReviews.length;

      return {
        ...serie,
        averageRating: averageRating.toFixed(2),
      };
    });
  };

  /**
   * Ordena ascendentemente el listado de series por la valoración media.
   */
  sortSeriesByRating = () => {
    return this.calculateAverage()?.sort(
      (a: any, b: any) => b.averageRating - a.averageRating
    );
  };

  isValueNaN(value: any): boolean {
    return isNaN(value);
  }
}
