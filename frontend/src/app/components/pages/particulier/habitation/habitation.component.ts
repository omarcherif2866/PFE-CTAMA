import { Component } from '@angular/core';

@Component({
  selector: 'app-habitation',
  templateUrl: './habitation.component.html',
  styleUrl: './habitation.component.scss'
})
export class HabitationComponent {
  isImageOnLeft: boolean = true; // Détermine si l'image est à gauche ou à droite
  constructor(

  ) { }

  ngOnInit(): void {

  }
}
