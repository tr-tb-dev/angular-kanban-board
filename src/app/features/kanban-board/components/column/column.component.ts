import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Column } from '../../../../core/models/column.model';
import { Ticket } from '../../../../core/models/ticket.model';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent {
  @Input() column!: Column;
  @Input() tickets: Ticket[] = [];

  @Output() ticketDrop = new EventEmitter<{ event: CdkDragDrop<Ticket[]>; columnId: string }>();
  @Output() ticketEdit = new EventEmitter<Ticket>();
  @Output() ticketDelete = new EventEmitter<string>();

  get columnTickets(): Ticket[] {
    return this.tickets
      .filter(ticket => ticket.columnId === this.column.id)
      .sort((a, b) => a.position - b.position);
  }

  onDrop(event: CdkDragDrop<Ticket[]>): void {
    this.ticketDrop.emit({ event, columnId: this.column.id });
  }

  onTicketEdit(ticket: Ticket): void {
    this.ticketEdit.emit(ticket);
  }

  onTicketDelete(ticketId: string): void {
    this.ticketDelete.emit(ticketId);
  }

  trackByTicketId(index: number, ticket: Ticket): string {
    return ticket.id;
  }
}
