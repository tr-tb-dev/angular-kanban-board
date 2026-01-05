import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Ticket } from '../../core/models/ticket.model';
import { Owner } from '../../core/models/owner.model';
import { TicketService } from '../../core/services/ticket.service';
import { OwnerService } from '../../core/services/owner.service';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit, OnDestroy {
  @Input() ticket: Ticket | null = null;
  @Output() close = new EventEmitter<void>();

  ticketForm!: FormGroup;
  owners: Owner[] = [];
  isEditMode = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private ownerService: OwnerService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.ticket;

    this.ticketForm = this.fb.group({
      title: [this.ticket?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [this.ticket?.description || '', [Validators.required, Validators.minLength(10)]],
      ownerId: [this.ticket?.owner.id || '', Validators.required],
      columnId: [this.ticket?.columnId || 'todo']
    });

    this.ownerService.loadOwners();
    this.ownerService.owners
      .pipe(takeUntil(this.destroy$))
      .subscribe(owners => {
        this.owners = owners;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    const formValue = this.ticketForm.value;
    const selectedOwner = this.owners.find(o => o.id === formValue.ownerId);

    if (!selectedOwner) {
      return;
    }

    if (this.isEditMode && this.ticket) {
      this.ticketService.updateTicket(this.ticket.id, {
        title: formValue.title,
        description: formValue.description,
        owner: selectedOwner,
        columnId: formValue.columnId
      });
    } else {
      const currentTickets = this.ticketForm.value.columnId;
      const position = 0; 

      this.ticketService.createTicket({
        title: formValue.title,
        description: formValue.description,
        owner: selectedOwner,
        columnId: formValue.columnId,
        position
      });
    }

    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.ticketForm.get(fieldName);
    if (field && field.touched && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      title: 'Title',
      description: 'Description',
      ownerId: 'Owner',
      columnId: 'Column'
    };
    return labels[fieldName] || fieldName;
  }

  get title() {
    return this.ticketForm.get('title');
  }

  get description() {
    return this.ticketForm.get('description');
  }

  get ownerId() {
    return this.ticketForm.get('ownerId');
  }

  get columnId() {
    return this.ticketForm.get('columnId');
  }
}
