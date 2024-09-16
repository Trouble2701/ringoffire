import { Component, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataBaseService } from '../firestore/database.service';
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
  game: any = Game;
  lenghtOfStack: number = 0;
  EndGameTitle = 'Spiel Beendet';
  oldPlayers: string[] = [];
  oldPlayersGender: string[] = [];
  constructor(private route: ActivatedRoute,private dataBase: DataBaseService, public dialog: MatDialog) {
    //this.newGame();
    this.route.params.subscribe((params) =>this.dataBase.startExistGame(params['id']));
    //setInterval(() => this.infoStartGame(), 100);
   }

  newGame() {
    this.game = new Game();
    this.lenghtOfStack = this.game.stack.length;
    this.dataBase.addDataBase();
  }

  takeCard() {
    if (!this.pickCardAnimation && this.game.playedCards.length <= 51 && this.game.players.length >= 2) {
      this.gameDB.alertNumber = 2;
      this.currentCard = this.game?.stack.pop();
      this.pickCardAnimation = true;
      this.lenghtOfStack = this.lenghtOfStack - 1;
      this.checkCard();
      this.defaultCard();
    } else if (this.game.stack.length == this.gameDB.allCards) {
      this.openDialog();
    }
  }

  nextPlayer() {
    if (this.game.players.length - 1 > this.game.currentPlayer) {
      this.game.currentPlayer++;
    } else {
      this.game.currentPlayer = 0;
    }
  }

  defaultCard() {
    setTimeout(() => {
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
      this.nextPlayer();
    }, 1200);
  }

  checkCard() {
    if (this.lenghtOfStack == 0) {
      this.gameDB.dontShow = false;
      this.endGame();
    }
  }

  openDialog(): void {
    if (this.game.stack.length == this.gameDB.allCards && this.game.players.length <= 9) {
      const dialogRef = this.dialog.open(DialogAddPlayerComponent);
      dialogRef.afterClosed().subscribe(result => {
        this.addedPlayer(result);
      });
    } else if (this.game.stack.length < this.gameDB.allCards) {
      this.openAlert();
    } else if (this.game.players.length == 9) {
      this.openAlert();
    }
  }

  addedPlayer(result: any) {
    if (this.checkResult(result)) {
      this.gameDB.alertNumber = 3;
      this.game.players.push(result.name);
      this.game.playerGender.push(result.gender);
      if (this.game.players.length >= 2) {
        this.startGame();
      }
    } else if (result != 'closed') {
      this.gameDB.alertNumber = 1;
      this.openAlert();
    }
  }

  checkResult(result: any) {
    return result != undefined && result.name != '' && result.gender != '' && result != 'closed'
  }

  openAlert(): void {
    const dialogRef = this.dialog.open(AlertDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      if (this.gameDB.alertNumber == 1) {
        this.openDialog();
      }
    });
  }

  startGame() {
    if (this.game.players.length >= 2) {
      this.randomFirstPlayer(0, this.game.players.length);
    } else {
      this.openDialog();
    }
  }

  randomFirstPlayer(min: number, max: number) {
    this.game.currentPlayer = Math.floor(Math.random() * (max - min) + min);
  }

  infoStartGame() {
    if (this.game.players.length < 2) {
      this.gameDB.newTitleDB = 'Spieler!'
      this.gameDB.newDisDB = 'Zuerst musst du mindestens 2 Spieler einfügen. Rechte seite auf das Plus klicken';
    } else if (this.game.players.length >= 2) {
      this.gameDB.newTitleDB = 'Starten des Spiels'
      this.gameDB.newDisDB = 'Zum Starten brauchst du nur auf den Kartenstapel klicken. Viel Spaß :-)';
    }
  }

  endGame() {
    if (this.game.stack.length == 0) {
      setTimeout(() => this.gameDB.endOfGame = true, 1200)
    }
  }

  noSp() {
    this.gameDB.endOfGame = false;
    this.gameDB.dontShow = true;
    this.saveOldPlayers();
    this.newGame();
    this.loadOldPlayers();
    this.randomFirstPlayer(0, this.game.players.length);
  }

  saveOldPlayers(){
    for (let i = 0; i < this.game.players.length; i++) {
      this.oldPlayers.push(this.game.players[i]);
      this.oldPlayersGender.push(this.game.playerGender[i]);
    }
  }

  loadOldPlayers(){
    for (let c = 0; c < this.oldPlayers.length; c++) {
      this.game.players.push(this.oldPlayers[c]);
      this.game.playerGender.push(this.oldPlayersGender[c]);
    }
  }

  neSp() {
    this.gameDB.endOfGame = false;
    this.gameDB.dontShow = true;
    this.newGame();
  }
}
