import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, DialogAddPlayerComponent, AlertDialogComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  pickCardAnimation = false;
  dontShow = true;
  currentCard: any;
  game:any =  Game;
  lenghtOfStack:number = 0;
  constructor( public dialog:MatDialog) { }
  ngOnInit(): void {
    this.newGame();
  }
  newGame() {
    this.game = new Game();
    this.lenghtOfStack = this.game.stack.length;
  }

  takeCard() {
    if (!this.pickCardAnimation && this.game.playedCards.length <= 51 && this.game.players.length >= 2) {
      this.currentCard = this.game?.stack.pop();
      this.pickCardAnimation = true;
      this.lenghtOfStack = this.lenghtOfStack-1;
      this.checkCard();
      this.defaultCard();
    }else if(this.game.stack.length == 52){
      this.openDialog();
    }
  }

  nextPlayer(){
    if(this.game.players.length-1 > this.game.currentPlayer){
      this.game.currentPlayer += 1;
    }else{
      this.game.currentPlayer = 0;
    }
  }

  defaultCard(){
    setTimeout(() => {
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
      this.nextPlayer();
    }, 1200);
  }

  checkCard(){
    if(this.lenghtOfStack == 0){
      this.dontShow = false;
    }
  }

  openDialog(): void {
    if(this.game.stack.length == 52 && this.game.players.length <=9){
      const dialogRef = this.dialog.open(DialogAddPlayerComponent);
      dialogRef.afterClosed().subscribe(result => {
        this.addedPlayer(result);
      });
    }else{
      this.openAlert('game');
    }
  }

  addedPlayer(result:any){
    if(this.checkResult(result)){
      this.game.players.push(result.name);
      this.game.playerGender.push(result.gender);
      if(this.game.players.length >= 2){
        this.startGame();
      }
    }else if(result != 'closed'){
      this.openAlert('player');
    }
  }

  checkResult(result:any){
    return result != undefined && result.name != '' && result.gender != '' && result != 'closed'
  }

  openAlert(alert:string):void{
    const dialogRef = this.dialog.open(AlertDialogComponent);
    dialogRef.afterClosed().subscribe(()=>{
      if(alert == 'player'){
        this.openDialog();
      }
    });
  }

  startGame(){
    if(this.game.players.length >= 2){
      this.randomFirstPlayer(0, this.game.players.length);
    }else{
      this.openDialog();
    }
  }

  randomFirstPlayer(min:number, max:number){
      this.game.currentPlayer = Math.floor(Math.random() * (max - min) + min);
  }
}
