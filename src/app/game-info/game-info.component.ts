import { Component, inject, Input, OnChanges, Injectable } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
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
  title?:string;
  discription?:string;
  cardNumber?:any;
  newTitle?:string;
  newDiscription?:String;

  constructor(){
    this.infoStart();
    this.gameInfo();
  }

  @Input() card?:any;

  gameInfo() {
    setInterval(() => {
      if(this.gameDB.gameIsRun)        {
        this.cardNumber = this.gameDB.currentCardDB.split('_')[1];
        this.title = this.gameDB.cardAction[+this.cardNumber-1].title
        this.discription = this.gameDB.cardAction[+this.cardNumber-1].discription
      }
    }, 300);
  }

  infoStart(){
    setInterval(() => {
      if(this.gameDB.playedCards.length > 0){
        console.log(this.gameDB.playedCards.length)
        this.newTitle = this.gameDB.newTitleDB;
        this.newDiscription = this.gameDB.newDisDB;
      }else{
        this.infoStartGame();
      }
    }, 100);
  }

  /**
   * This Function added Startinfos
   */
  infoStartGame() {
    if (this.gameDB.players.length < 2) {
      this.gameDB.newTitleDB = 'Spieler!'
      this.gameDB.newDisDB = 'Zuerst musst du mindestens 2 Spieler einfügen. Rechte seite auf das Plus klicken';
    } else if (this.gameDB.players.length >= 2) {
      this.gameDB.newTitleDB = 'Starten des Spiels'
      this.gameDB.newDisDB = 'Zum Starten brauchst du nur auf den Kartenstapel klicken. Viel Spaß :-)';
    }
  }
}
