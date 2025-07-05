import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  contentHeight: number = 0;
  openSectionIndex: number = -1;
  constructor(

  ) { }

  ngOnInit(): void {

  }

  toggleSection(index: number): void {
    if (this.openSectionIndex === index) {
        this.openSectionIndex = -1;
    } else {
        this.openSectionIndex = index;
        this.calculateContentHeight();
    }
}

calculateContentHeight(): void {
  const contentElement = document.querySelector('.accordion-content');
  if (contentElement) {
      this.contentHeight = contentElement.scrollHeight;
  }
}

isSectionOpen(index: number): boolean {
  return this.openSectionIndex === index;
}


}
