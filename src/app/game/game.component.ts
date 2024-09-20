import { Component, inject, Injectable } from '@angular/core';
import { CommonModule, Time } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, DialogAddPlayerComponent, AlertDialogComponent, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent {
  gameDB = inject(Game);
  pickCardAnimation = false;
  currentCard: any;
  EndGameTitle = 'Spiel Beendet';
  oldPlayers: string[] = [];
  oldPlayersGender: string[] = [];
  selfGame = false;
  
  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.newGame();
  }

  /**
   * This Function check the ID and start the Games
   */
  newGame() {
    this.route.params.subscribe((params) => this.gameDB.startExistGame(params['id']));
    setTimeout(() => this.gameDB.lenghtOfStack = this.gameDB.stack.length, 500);
    setTimeout(() => this.endGame(), 1200);
  }

  /**
   * This Funktion take the card and give the Ifo for Players
   */
  takeCard() {
    if (!this.pickCardAnimation && this.gameDB.playedCards.length <= 51 && this.gameDB.players.length >= 2) {
      if (!this.gameDB.gameIsRun) this.gameDB.gameIsRun = true;
      this.gameDB.alertNumber = 2;
      this.currentCard = this.gameDB?.stack.pop();
      this.gameDB.currentCardDB = this.currentCard;
      this.pickCardAnimation = true;
      this.gameDB.lenghtOfStack = this.gameDB.lenghtOfStack - 1;
      this.checkCard();
      this.defaultCard();
      this.gameRun();
    } else if (this.gameDB.stack.length == this.gameDB.allCards) {
      this.openDialog();
    }
  }

  /**
   * This Function give the Next Player
   */
  nextPlayer() {
    if (this.gameDB.players.length - 1 > this.gameDB.currentPlayer) {
      this.gameDB.currentPlayer++;
    } else {
      this.gameDB.currentPlayer = 0;
    }
  }

  /**
   * This Function pushed played Card in playedCards
   */
  defaultCard() {
    setTimeout(() => {
      this.gameDB.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
      this.nextPlayer();
    }, 1200);
  }

  /**
   * This Function lenght of Stack
   */
  checkCard() {
    if (this.gameDB.lenghtOfStack == 0) {
      this.gameDB.dontShow = false;
      this.endGame();
    }
  }

  /**
   * This Function open the Dialog of added Players
   */
  openDialog(): void {
    if (this.gameDB.playedCards.length == 0 && this.gameDB.players.length <= 9) {
      this.openDialogScreen();
    } else if (this.gameDB.playedCards.length > 0) {
      this.openAlert();
    } else if (this.gameDB.players.length == 9) {
      this.openAlert();
    }
  }

  /**
   * This Function open Dialog Screen
   */
  openDialogScreen(){
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
      dialogRef.afterClosed().subscribe(result => {
        this.addedPlayer(result);
      });
  }

  /**
   * This Function added player and gender in a JSON
   * @param result result give data of Player
   */
  addedPlayer(result: any) {
    if (this.checkResult(result)) {
      this.gameDB.alertNumber = 3;
      this.gameDB.players.push(result.name);
      this.gameDB.playerGender.push(result.gender);
      if (this.gameDB.players.length >= 2) this.startGame();
    } else if (result != 'closed') {
      this.gameDB.alertNumber = 1;
      this.openAlert();
    }
  }

  /**
   * This Function Check the Data input
   * @param result data from input field 
   * @returns true or false
   */
  checkResult(result: any) {
    return result != undefined && result.name != '' && result.gender != '' && result != 'closed'
  }

  /**
   * This Funktion Open Alert
   */
  openAlert(): void {
    const dialogRef = this.dialog.open(AlertDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      if (this.gameDB.alertNumber == 1) {
        this.openDialog();
      }
    });
  }

  /**
   * This Function start shuffle Players 
   */
  startGame() {
    if (this.gameDB.players.length >= 2) {
      this.randomFirstPlayer(0, this.gameDB.players.length);
    } else {
      this.openDialog();
    }
  }

  /**
   * This Function addet new datetime and save data in firebase
   */
  gameRun() {
    setTimeout(() => this.gameDB.Datenow = this.gameDB.timeJet+(2 * 60 * 60 * 1000), 300);
    setTimeout(() => this.gameDB.setGameData(this.gameDB.gameID, this.gameDB.toJson()), 1300);
  }

  /**
   * This Function shuffled Player
   * @param min min Number
   * @param max max Number
   */
  randomFirstPlayer(min: number, max: number) {
    this.gameDB.currentPlayer = Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * This Function Set end of Game true
   */
  endGame() {
    if (this.gameDB.stack.length == 0) {
      setTimeout(() => this.gameDB.endOfGame = true, 1200)
    }
  }

  /**
   * This Function Start new Game with self Players
   */
  noSp() {
    this.gameDB.endOfGame = false;
    this.gameDB.dontShow = true;
    this.selfGame = true;
    this.saveOldPlayers();
    this.gameDB.restoreData();
    this.newGame();
    this.loadOldPlayers();
    this.randomFirstPlayer(0, this.gameDB.players.length);
    this.gameDB.gameIsRun = true;
    this.gameDB.setGameData(this.gameDB.gameID, this.gameDB.toJson());
  }

  /**
   * This Function Save Old Players
   */
  saveOldPlayers() {
    for (let i = 0; i < this.gameDB.players.length; i++) {
      this.oldPlayers.push(this.gameDB.players[i]);
      this.oldPlayersGender.push(this.gameDB.playerGender[i]);
    }
  }

  /**
   * This Function load Old Players
   */
  loadOldPlayers() {
    for (let c = 0; c < this.oldPlayers.length; c++) {
      this.gameDB.players.push(this.oldPlayers[c]);
      this.gameDB.playerGender.push(this.oldPlayersGender[c]);
    }
  }

  /**
   * This Function start new Game 
   */
  neSp() {
    this.gameDB.restoreData();
    this.gameDB.gameIsRun = true;
    this.gameDB.setGameData(this.gameDB.gameID, this.gameDB.toJson());
    this.newGame();
  }
}
