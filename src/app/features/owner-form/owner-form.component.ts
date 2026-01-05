import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Owner } from '../../core/models/owner.model';
import { OwnerService } from '../../core/services/owner.service';

@Component({
  selector: 'app-owner-form',
  templateUrl: './owner-form.component.html',
  styleUrls: ['./owner-form.component.scss']
})
export class OwnerFormComponent implements OnInit {
  @Input() owner: Owner | null = null;
  @Output() close = new EventEmitter<void>();

  ownerForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private ownerService: OwnerService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.owner;

    this.ownerForm = this.fb.group({
      name: [this.owner?.name || '', [Validators.required, Validators.minLength(2)]],
      email: [this.owner?.email || '', [Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.ownerForm.invalid) {
      this.ownerForm.markAllAsTouched();
      return;
    }

    const formValue = this.ownerForm.value;
    const ownerData = {
      name: formValue.name,
      email: formValue.email || undefined
    };

    if (this.isEditMode && this.owner) {
      this.ownerService.updateOwner(this.owner.id, ownerData);
    } else {
      this.ownerService.createOwner(ownerData);
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
    const field = this.ownerForm.get(fieldName);
    if (field && field.touched && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      email: 'Email'
    };
    return labels[fieldName] || fieldName;
  }

  get name() {
    return this.ownerForm.get('name');
  }

  get email() {
    return this.ownerForm.get('email');
  }
}
