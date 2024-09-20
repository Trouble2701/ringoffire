import { Component, inject, Input } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Game } from '../../models/game';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatSelectModule, FormsModule],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss'
})
export class AlertDialogComponent {
  gameDB = inject(Game);
  alert?:string;
  constructor( public dialog:MatDialog) {
    this.alertDialog();
  }

  /**
   * Set The Alert
   */
  alertDialog(){
      if(this.gameDB.alertNumber == 1){
        this.alert = 'Bitte alles ausfüllen!';
      }else if(this.gameDB.alertNumber == 2){
        this.alert = 'Spiel läuft bereits!';
      }else if(this.gameDB.alertNumber == 3){
        this.alert = 'Maximale Spieleranzahl erreicht!';
      }
  }
}
