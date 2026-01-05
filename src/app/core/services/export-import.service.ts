import { Injectable } from '@angular/core';
import { TicketService } from './ticket.service';
import { OwnerService } from './owner.service';

export interface KanbanExportData {
  version: string;
  exportDate: string;
  tickets: any[];
  owners: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ExportImportService {

  constructor(
    private ticketService: TicketService,
    private ownerService: OwnerService
  ) {}

  exportState(): void {
    const tickets = (this.ticketService as any).tickets$.value;
    const owners = (this.ownerService as any).owners$.value;

    const exportData: KanbanExportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      tickets: tickets.map((t: any) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        owner: {
          ...t.owner,
          createdAt: t.owner.createdAt.toISOString()
        }
      })),
      owners: owners.map((o: any) => ({
        ...o,
        createdAt: o.createdAt.toISOString()
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kanban-board-${new Date().toISOString().split('T')[0]}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  async importState(file: File): Promise<{ success: boolean; error?: string }> {
    try {
      const content = await this.readFile(file);
      const data: KanbanExportData = JSON.parse(content);

      if (!this.validateImportData(data)) {
        return {
          success: false,
          error: 'Invalid file format. Please select a valid Kanban board export file.'
        };
      }

      const owners = data.owners.map(o => ({
        ...o,
        createdAt: new Date(o.createdAt)
      }));

      const tickets = data.tickets.map(t => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
        owner: {
          ...t.owner,
          createdAt: new Date(t.owner.createdAt)
        }
      }));

      (this.ownerService as any).owners$.next(owners);
      (this.ownerService as any).saveOwners();

      (this.ticketService as any).tickets$.next(tickets);
      (this.ticketService as any).saveTickets();

      return { success: true };
    } catch (error) {
      console.error('Import error:', error);
      return {
        success: false,
        error: error instanceof Error
          ? `Failed to import: ${error.message}`
          : 'Failed to import file. Please check the file format.'
      };
    }
  }

  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private validateImportData(data: any): data is KanbanExportData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    if (!data.version || !data.exportDate) {
      return false;
    }

    if (!Array.isArray(data.tickets) || !Array.isArray(data.owners)) {
      return false;
    }

    return true;
  }
}
