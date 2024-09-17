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

  constructor(private router: Router) {
    this.gameDB.searchGames();
    setTimeout(() => {
      if (!this.gameDB.gameID) {
        this.gameDB.restoreData();
        this.gameDB.addDataBase();
      }
    }, 500);
  }

  newGame() {
    let newId = '';
    if (this.gameDB.gameID) {
      newId = '/' + this.gameDB.gameID;
    }
    //Start Game 
    this.router.navigateByUrl('/game' + newId);
  }
}
