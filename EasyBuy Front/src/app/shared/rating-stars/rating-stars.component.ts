import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-stars.component.html'
})
export class RatingStarsComponent implements OnInit {
  @Input() rating: number | undefined = 0;
  stars: { fill: string }[] = [];

  ngOnInit(): void {
    const ratingValue = this.rating || 0;
    this.stars = Array.from({ length: 5 }, (_, i) => ({
      fill: i < Math.floor(ratingValue) ? 'currentColor' : 'none'
    }));
  }
}
