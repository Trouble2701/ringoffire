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
  lenghtOfStack:number = 52;
  constructor() { }
  ngOnInit(): void {
    this.newGame();
  }
  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.pickCardAnimation && this.game.playedCards.length <= 51) {
      this.currentCard = this.game?.stack.pop();
      this.pickCardAnimation = true;
      this.checkCard();
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
        this.lenghtOfStack = this.game.stack.length;
      }, 1200);
    }
  }

  checkCard(){
    if(this.lenghtOfStack == 1){
      this.dontShow = false;
    }
  }
}
