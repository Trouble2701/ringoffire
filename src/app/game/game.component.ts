import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  pickCardAnimation = false;
  dontShow = true;
  currentCard: any;
  game:any =  Game;
  lenghtOfStack:number = 0;
  constructor() { }
  ngOnInit(): void {
    this.newGame();
  }
  newGame() {
    this.game = new Game();
    this.lenghtOfStack = this.game.stack.length;
  }

  takeCard() {
    if (!this.pickCardAnimation && this.game.playedCards.length <= 51) {
      this.currentCard = this.game?.stack.pop();
      this.pickCardAnimation = true;
      this.lenghtOfStack = this.lenghtOfStack-1;
      this.checkCard();
      this.defaultCard();
    }
  }

  defaultCard(){
    setTimeout(() => {
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
    }, 1200);
  }

  checkCard(){
    if(this.lenghtOfStack == 0){
      this.dontShow = false;
    }
  }
}
