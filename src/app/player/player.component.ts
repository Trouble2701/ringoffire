import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {

  @Input() name?:string;
  @Input() gender?:string;
  @Input() playerActive?:boolean = false;

}
