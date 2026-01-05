import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Owner } from '../models/owner.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'kanban_owners';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private owners$ = new BehaviorSubject<Owner[]>([]);
  public owners: Observable<Owner[]> = this.owners$.asObservable();

  constructor(private storageService: StorageService) {}

  loadOwners(): void {
    const stored = this.storageService.getItem<any[]>(STORAGE_KEY);
    if (stored && stored.length > 0) {
      const owners = stored.map(o => ({
        ...o,
        createdAt: new Date(o.createdAt)
      }));
      this.owners$.next(owners);
    } else {
      this.initializeDefaultOwners();
    }
  }

  private initializeDefaultOwners(): void {
    const defaultOwners: Owner[] = [
      {
        id: this.generateId(),
        name: 'John Doe',
        email: 'john.doe@example.com',
        createdAt: new Date()
      }
    ];
    this.owners$.next(defaultOwners);
    this.saveOwners();
  }

  createOwner(ownerData: Omit<Owner, 'id' | 'createdAt'>): Owner {
    const newOwner: Owner = {
      id: this.generateId(),
      ...ownerData,
      createdAt: new Date()
    };
    const currentOwners = this.owners$.value;
    this.owners$.next([...currentOwners, newOwner]);
    this.saveOwners();
    return newOwner;
  }

  updateOwner(id: string, updates: Partial<Owner>): void {
    const currentOwners = this.owners$.value;
    const updatedOwners = currentOwners.map(owner =>
      owner.id === id ? { ...owner, ...updates } : owner
    );
    this.owners$.next(updatedOwners);
    this.saveOwners();
  }

  deleteOwner(id: string): void {
    const currentOwners = this.owners$.value;
    const filteredOwners = currentOwners.filter(owner => owner.id !== id);
    this.owners$.next(filteredOwners);
    this.saveOwners();
  }

  getOwnerById(id: string): Owner | undefined {
    return this.owners$.value.find(owner => owner.id === id);
  }

  private saveOwners(): void {
    const owners = this.owners$.value;
    const ownersToSave = owners.map(o => ({
      ...o,
      createdAt: o.createdAt.toISOString()
    }));
    this.storageService.setItem(STORAGE_KEY, ownersToSave);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
