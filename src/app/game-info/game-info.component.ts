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
export class GameInfoComponent {

  gameDB = inject(Game);
  cardNumber?: any;
  newTitle?: string;
  newDiscription?: String;

  constructor() {
    this.infoStart();
  }

  @Input() card?: any;

  infoStart() {
    setInterval(() => {
      if (this.gameDB.gameIsRun == true && this.gameDB.playedCards.length >= 1) {
        if(this.gameDB.lenghtOfStack > this.gameDB.stack.length) this.gameDB.lenghtOfStack = this.gameDB.stack.length;
        this.cardNumber = this.gameDB.currentCardDB.split('_')[1];
        this.newTitle = this.gameDB.cardAction[+this.cardNumber - 1].title
        this.newDiscription = this.gameDB.cardAction[+this.cardNumber - 1].discription
      } else {
        this.infoStartGame();
      }
    }, 600);
  }

  /**
   * This Function added Startinfos
   */
  infoStartGame() {
    if (this.gameDB.players.length < 2) {
      this.newTitle = 'Spieler!'
      this.newDiscription = 'Zuerst musst du mindestens 2 Spieler einfügen. Rechte seite auf das Plus klicken';
    } else if (this.gameDB.players.length >= 2) {
      this.newTitle = 'Starten des Spiels'
      this.newDiscription = 'Zum Starten brauchst du nur auf den Kartenstapel klicken. Viel Spaß :-)';
    }
  }
}
