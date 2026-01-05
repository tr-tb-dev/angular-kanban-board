import { Owner } from './owner.model';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  owner: Owner;
  columnId: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}
