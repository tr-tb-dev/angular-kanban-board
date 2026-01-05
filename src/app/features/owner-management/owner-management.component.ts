import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Owner } from '../../core/models/owner.model';
import { Ticket } from '../../core/models/ticket.model';
import { OwnerService } from '../../core/services/owner.service';
import { TicketService } from '../../core/services/ticket.service';

@Component({
  selector: 'app-owner-management',
  templateUrl: './owner-management.component.html',
  styleUrls: ['./owner-management.component.scss']
})
export class OwnerManagementComponent implements OnInit, OnDestroy {
  owners: Owner[] = [];
  tickets: Ticket[] = [];
  isOwnerFormOpen = false;
  ownerToEdit: Owner | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private ownerService: OwnerService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.ownerService.loadOwners();
    this.ownerService.owners
      .pipe(takeUntil(this.destroy$))
      .subscribe(owners => {
        this.owners = owners;
      });

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

  openOwnerForm(): void {
    this.ownerToEdit = null;
    this.isOwnerFormOpen = true;
  }

  openEditOwnerForm(owner: Owner): void {
    this.ownerToEdit = owner;
    this.isOwnerFormOpen = true;
  }

  closeOwnerForm(): void {
    this.isOwnerFormOpen = false;
    this.ownerToEdit = null;
  }

  onDelete(owner: Owner): void {
    const isOwnerInUse = this.tickets.some(ticket => ticket.owner.id === owner.id);

    if (isOwnerInUse) {
      alert(`Cannot delete "${owner.name}" because they are assigned to one or more tickets. Please reassign or delete those tickets first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete "${owner.name}"?`)) {
      this.ownerService.deleteOwner(owner.id);
    }
  }

  getOwnerTicketCount(ownerId: string): number {
    return this.tickets.filter(ticket => ticket.owner.id === ownerId).length;
  }

  trackByOwnerId(index: number, owner: Owner): string {
    return owner.id;
  }
}
