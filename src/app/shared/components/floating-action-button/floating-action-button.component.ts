import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-floating-action-button',
  templateUrl: './floating-action-button.component.html',
  styleUrls: ['./floating-action-button.component.scss']
})
export class FloatingActionButtonComponent {
  @Input() label: string = 'New';
  @Output() clicked = new EventEmitter<void>();

  isHovered = false;

  onClick(): void {
    this.clicked.emit();
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }
}
