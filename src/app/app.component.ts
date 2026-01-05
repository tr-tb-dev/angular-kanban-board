import { Component, OnInit } from '@angular/core';
import { TicketService } from './core/services/ticket.service';
import { OwnerService } from './core/services/owner.service';
import { ExportImportService } from './core/services/export-import.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showWarningModal = false;
  warningMessage = '';

  constructor(
    private ticketService: TicketService,
    private ownerService: OwnerService,
    private exportImportService: ExportImportService
  ) {}

  ngOnInit(): void {
    this.ownerService.loadOwners();
    this.ticketService.loadTickets();
  }

  onExport(): void {
    this.exportImportService.exportState();
  }

  async onImport(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const result = await this.exportImportService.importState(file);

    if (!result.success) {
      this.warningMessage = result.error || 'Import failed';
      this.showWarningModal = true;
    }

    input.value = '';
  }

  closeWarningModal(): void {
    this.showWarningModal = false;
    this.warningMessage = '';
  }
}
