import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpService } from '../../service/app.service';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css'],
})
export class RatingsComponent implements OnInit {
  @Input() series: any;
  @Input() reviews: any;

  user = 'Irene';
  reviewsById: any = [];
  selectedReview: any = null;
  selectedSerie: any = null;
  personalRating: number = 0;

  newSerie = { title: '', streamingPlatform: '', synopsis: '', cover: '' };

  isOpen = false;
  isOpenRating = false;

  newSerieForm: FormGroup;

  constructor(private httpService: HttpService, private fb: FormBuilder) {
    this.newSerieForm = this.fb.group({
      title: ['', [Validators.required]],
      streamingPlatform: ['', Validators.required],
      synopsis: ['', Validators.required],
      cover: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadReviewsById();
  }

  /**
   * Asigna una serie de reseñas a cada serie en función de sus id.
   */
  loadReviewsById() {
    this.reviewsById = this.series?.map((serie: any) =>
      this.getReviewsBySerieId(serie.id)
    );
  }

  openNewSerie = () => {
    this.isOpen = true;
  };

  closeNewSerie = () => {
    this.isOpen = false;
    this.newSerieForm.reset();
  };

  closeRating = () => {
    this.selectedSerie = null;
    this.selectedReview = null;
  };

  /**
   * Muestra la valoraciones de la serie seleccionada.
   * @param {any} serie - es toda la información de la serie relacionada con
   * la valoración.
   */
  getReviewsBySerieId = (id: any) => {
    return this.reviews?.filter((review: any) => review.idSerie === id);
  };

  /**
   * Recarga el array `reviewsById`.
   * @param {any} id - es el id de la serie relacionada con la valoración.
   */
  updateReviewsBySerieId = (id: any) => {
    const reviewsById = this.getReviewsBySerieId(id);
    this.reviewsById = this.reviewsById.map((reviews: any) =>
      reviews.length > 0 && reviews[0].idSerie === id ? reviewsById : reviews
    );
  };

  /**
   * Muestra el formulario para añadir una nueva valoración de la serie seleccionada.
   * @param {any} serie - es toda la información de la serie sobre la que se va a
   * añadir una nueva valoración.
   */
  showAddReviewForm = (serie: any) => {
    this.selectedSerie = serie;
    this.selectedReview = this.getReviewsBySerieId(serie.id);
  };

  /**
   * Recarga la informacion de reviews.
   * @param {any} id - es el id de la serie seleccionada.
   */
  reloadReviews = (id: any) => {
    this.httpService.getReviews().subscribe((response: any) => {
      this.reviews = response;
      this.updateReviewsBySerieId(id);
      this.closeRating();
    });
  };

  /**
   * Recarga la informacion de series.
   */
  reloadSeries = () => {
    this.httpService.getSeries().subscribe((response: any) => {
      this.series = response;
      this.loadReviewsById();
    });
  };

  /**
   * Guarda la valoración que se creó en el formulario de la serie seleccionada.
   * @param {any} id - es el id de la serie seleccionada.
   */
  addReview = (id: any) => {
    let newReview = {
      idSerie: id,
      author: this.user,
      personalRating: this.personalRating,
    };

    this.selectedReview.push(newReview);

    this.httpService.setReview(newReview).subscribe(
      (response) => {
        console.log('Valoración añadida:', response);

        this.reloadReviews(id);
        this.newSerie = {
          title: '',
          streamingPlatform: '',
          synopsis: '',
          cover: '',
        };
        this.personalRating = 0;
      },
      (error) => {
        console.error('Error al añadir la valoración:', error);
      }
    );
  };

  /**
   * Guarda la valoración que se creó en el formulario de la serie seleccionada.
   */
  addSerie = () => {
    if (this.newSerieForm.valid) {
      this.httpService.setSerie(this.newSerieForm.value).subscribe(
        (response) => {
          console.log('Serie añadida:', response);
          this.reloadSeries();
          this.closeNewSerie();
        },
        (error) => {
          console.error('Error al añadir la serie:', error);
        }
      );
    }
  };
}
