import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Column } from '../../../../core/models/column.model';
import { Ticket } from '../../../../core/models/ticket.model';
import { TicketService } from '../../../../core/services/ticket.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  columns: Column[] = [
    { id: 'todo', title: 'To Do', position: 0 },
    { id: 'in-progress', title: 'In Progress', position: 1 },
    { id: 'done', title: 'Done', position: 2 }
  ];

  tickets: Ticket[] = [];
  isTicketFormOpen = false;
  ticketToEdit: Ticket | null = null;

  private destroy$ = new Subject<void>();

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.ticketService.loadTickets();
    this.ticketService.tickets
      .pipe(takeUntil(this.destroy$))
      .subscribe(tickets => {
        this.tickets = tickets;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openTicketForm(): void {
    this.ticketToEdit = null;
    this.isTicketFormOpen = true;
  }

  openEditTicketForm(ticket: Ticket): void {
    this.ticketToEdit = ticket;
    this.isTicketFormOpen = true;
  }

  closeTicketForm(): void {
    this.isTicketFormOpen = false;
    this.ticketToEdit = null;
  }

  onTicketDrop(event: { event: CdkDragDrop<Ticket[]>; columnId: string }): void {
    const { event: dropEvent, columnId } = event;
    const ticketId = dropEvent.item.data.id;
    const newPosition = dropEvent.currentIndex;

    this.ticketService.moveTicket(ticketId, columnId, newPosition);
  }

  onTicketEdit(ticket: Ticket): void {
    this.openEditTicketForm(ticket);
  }

  onTicketDelete(ticketId: string): void {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.ticketService.deleteTicket(ticketId);
    }
  }

  trackByColumnId(index: number, column: Column): string {
    return column.id;
  }
}
