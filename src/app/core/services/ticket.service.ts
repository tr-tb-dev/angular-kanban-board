import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ticket } from '../models/ticket.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'kanban_tickets';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private tickets$ = new BehaviorSubject<Ticket[]>([]);
  public tickets: Observable<Ticket[]> = this.tickets$.asObservable();

  constructor(private storageService: StorageService) {}

  loadTickets(): void {
    const stored = this.storageService.getItem<any[]>(STORAGE_KEY);
    if (stored && stored.length > 0) {
      const tickets = stored.map(t => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
        owner: {
          ...t.owner,
          createdAt: new Date(t.owner.createdAt)
        }
      }));
      this.tickets$.next(tickets);
    }
  }

  createTicket(ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Ticket {
    const now = new Date();
    const newTicket: Ticket = {
      id: this.generateId(),
      ...ticketData,
      createdAt: now,
      updatedAt: now
    };
    const currentTickets = this.tickets$.value;
    this.tickets$.next([...currentTickets, newTicket]);
    this.saveTickets();
    return newTicket;
  }

  updateTicket(id: string, updates: Partial<Ticket>): void {
    const currentTickets = this.tickets$.value;
    const updatedTickets = currentTickets.map(ticket =>
      ticket.id === id
        ? { ...ticket, ...updates, updatedAt: new Date() }
        : ticket
    );
    this.tickets$.next(updatedTickets);
    this.saveTickets();
  }

  deleteTicket(id: string): void {
    const currentTickets = this.tickets$.value;
    const filteredTickets = currentTickets.filter(ticket => ticket.id !== id);
    this.tickets$.next(filteredTickets);
    this.saveTickets();
  }

  moveTicket(ticketId: string, targetColumnId: string, newPosition: number): void {
    const currentTickets = this.tickets$.value;
    const ticket = currentTickets.find(t => t.id === ticketId);

    if (!ticket) {
      return;
    }

    const previousColumnId = ticket.columnId;

    const targetColumnTickets = currentTickets
      .filter(t => t.columnId === targetColumnId && t.id !== ticketId)
      .sort((a, b) => a.position - b.position);

    targetColumnTickets.splice(newPosition, 0, { ...ticket, columnId: targetColumnId });

    const updatedTickets = currentTickets.map(t => {
      if (t.id === ticketId) {
        return { ...t, columnId: targetColumnId, position: newPosition, updatedAt: new Date() };
      }

      const indexInTarget = targetColumnTickets.findIndex(ticket => ticket.id === t.id);
      if (indexInTarget !== -1) {
        return { ...t, position: indexInTarget, updatedAt: new Date() };
      }

      return t;
    });

    this.tickets$.next(updatedTickets);
    this.saveTickets();
  }

  getTicketsByColumn(columnId: string): Observable<Ticket[]> {
    return this.tickets.pipe(
      map(tickets => tickets
        .filter(ticket => ticket.columnId === columnId)
        .sort((a, b) => a.position - b.position)
      )
    );
  }

  private saveTickets(): void {
    const tickets = this.tickets$.value;
    const ticketsToSave = tickets.map(t => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      owner: {
        ...t.owner,
        createdAt: t.owner.createdAt.toISOString()
      }
    }));
    this.storageService.setItem(STORAGE_KEY, ticketsToSave);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
