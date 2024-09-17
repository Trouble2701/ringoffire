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
  lenghtOfStack: number = 0;
  EndGameTitle = 'Spiel Beendet';
  oldPlayers: string[] = [];
  oldPlayersGender: string[] = [];
  selfGame = false;
  
  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.newGame();
    setInterval(() => this.infoStartGame(), 100);
  }

  newGame() {
    this.route.params.subscribe((params) => this.gameDB.startExistGame(params['id']));
    setTimeout(() => this.lenghtOfStack = this.gameDB.stack.length, 700);
    setTimeout(() => this.endGame(), 1000);
  }

  takeCard() {
    if (!this.pickCardAnimation && this.gameDB.playedCards.length <= 51 && this.gameDB.players.length >= 2) {
      if (!this.gameDB.gameIsRun) this.gameDB.gameIsRun = true;
      this.gameDB.alertNumber = 2;
      this.currentCard = this.gameDB?.stack.pop();
      this.pickCardAnimation = true;
      this.lenghtOfStack = this.lenghtOfStack - 1;
      this.checkCard();
      this.defaultCard();
      this.gameRun();
    } else if (this.gameDB.stack.length == this.gameDB.allCards) {
      this.openDialog();
    }
  }

  nextPlayer() {
    if (this.gameDB.players.length - 1 > this.gameDB.currentPlayer) {
      this.gameDB.currentPlayer++;
    } else {
      this.gameDB.currentPlayer = 0;
    }
  }

  defaultCard() {
    setTimeout(() => {
      this.gameDB.playedCards.push(this.currentCard);
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
    if (this.gameDB.stack.length == this.gameDB.allCards && this.gameDB.players.length <= 9) {
      const dialogRef = this.dialog.open(DialogAddPlayerComponent);
      dialogRef.afterClosed().subscribe(result => {
        this.addedPlayer(result);
      });
    } else if (this.gameDB.stack.length < this.gameDB.allCards) {
      this.openAlert();
    } else if (this.gameDB.players.length == 9) {
      this.openAlert();
    }
  }

  addedPlayer(result: any) {
    if (this.checkResult(result)) {
      this.gameDB.alertNumber = 3;
      this.gameDB.players.push(result.name);
      this.gameDB.playerGender.push(result.gender);
      if (this.gameDB.players.length >= 2) {
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
    if (this.gameDB.players.length >= 2) {
      this.randomFirstPlayer(0, this.gameDB.players.length);
    } else {
      this.openDialog();
    }
  }

  gameRun() {
    this.gameDB.Datenow = Date.now();
    setTimeout(() => this.gameDB.setGameData(this.gameDB.gameID, this.gameDB.toJson()), 1300);
  }

  randomFirstPlayer(min: number, max: number) {
    this.gameDB.currentPlayer = Math.floor(Math.random() * (max - min) + min);
  }

  infoStartGame() {
    if (this.gameDB.players.length < 2) {
      this.gameDB.newTitleDB = 'Spieler!'
      this.gameDB.newDisDB = 'Zuerst musst du mindestens 2 Spieler einfügen. Rechte seite auf das Plus klicken';
    } else if (this.gameDB.players.length >= 2) {
      this.gameDB.newTitleDB = 'Starten des Spiels'
      this.gameDB.newDisDB = 'Zum Starten brauchst du nur auf den Kartenstapel klicken. Viel Spaß :-)';
    }
  }

  endGame() {
    if (this.gameDB.stack.length == 0) {
      setTimeout(() => this.gameDB.endOfGame = true, 1200)
    }
  }

  noSp() {
    this.gameDB.endOfGame = false;
    this.gameDB.dontShow = true;
    this.selfGame = true;
    this.saveOldPlayers();
    this.gameDB.restoreData();
    this.newGame();
    this.loadOldPlayers();
    this.randomFirstPlayer(0, this.gameDB.players.length);
    this.gameDB.setGameData(this.gameDB.gameID, this.gameDB.toJson());
  }

  saveOldPlayers() {
    for (let i = 0; i < this.gameDB.players.length; i++) {
      this.oldPlayers.push(this.gameDB.players[i]);
      this.oldPlayersGender.push(this.gameDB.playerGender[i]);
    }
  }

  loadOldPlayers() {
    for (let c = 0; c < this.oldPlayers.length; c++) {
      this.gameDB.players.push(this.oldPlayers[c]);
      this.gameDB.playerGender.push(this.oldPlayersGender[c]);
    }
  }

  neSp() {
    this.gameDB.restoreData();
    this.gameDB.setGameData(this.gameDB.gameID, this.gameDB.toJson());
    this.newGame();
  }
}
