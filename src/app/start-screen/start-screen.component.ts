import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataBaseService } from '../firestore/database.service';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  constructor(private dataBase: DataBaseService, private router: Router) {
    this.dataBase.searchGames();
    setTimeout(() => {
      if (this.dataBase.gameID.length == 0) {
        this.dataBase.addDataBase();
      }
    }, 500);
  }

  newGame() {
    let newId = '';
    if (this.dataBase.gameID) {
      newId = '/' + this.dataBase.gameID;
    }
    //Start Game 
    this.router.navigateByUrl('/game' + newId);
  }
}
