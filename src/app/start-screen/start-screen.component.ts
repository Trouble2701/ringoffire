import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  gameDB = inject(Game);
  newID:string;

  constructor(private router: Router) {
    setInterval(() => {
      if(this.router.url == '/'){
        this.gameDB.searchGames()
        setTimeout(() => {
          if (!this.gameDB.gameID) {
            this.gameDB.restoreData();
            this.gameDB.addDataBase();
          }
        }, 187);
      }
    }, 500);
  }

  /**
   * This function Start the game Site
   */
  newGame() {
    if (this.gameDB.gameID) {
      this.newID = this.gameDB.gameID;
    }
    //Start Game 
    this.router.navigateByUrl('game/'+this.newID);
  }
}
