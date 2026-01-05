import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Ticket } from '../../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent {
  @Input() ticket!: Ticket;

  @Output() edit = new EventEmitter<Ticket>();
  @Output() delete = new EventEmitter<string>();

  onEdit(): void {
    this.edit.emit(this.ticket);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.ticket.id);
  }
}
