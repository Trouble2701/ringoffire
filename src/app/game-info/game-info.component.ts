import { Component, inject, Input, OnChanges, Injectable } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Game } from '../../models/game';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-game-info',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.scss'
})
export class GameInfoComponent implements OnChanges {

  gameDB = inject(Game);
  title?: string;
  discription?: string;
  cardNumber?: any;
  newTitle?: string;
  newDiscription?: String;

  constructor() {
    this.infoStart();
  }

  @Input() card?: any;

  /**
   * This Function Change the Card Number
   */
  ngOnChanges(): void {
    if (this.card) {
      this.cardNumber = this.card.split('_')[1];
      this.title = this.gameDB.cardAction[+this.cardNumber - 1].title
      this.discription = this.gameDB.cardAction[+this.cardNumber - 1].discription
    }
  }

  /**
   * This Function Change the Info
   */
  infoStart() {
    setInterval(() => {
      this.newTitle = this.gameDB.newTitleDB;
      this.newDiscription = this.gameDB.newDisDB;
    }, 100);
  }
}
