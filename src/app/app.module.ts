import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './features/kanban-board/components/board/board.component';
import { ColumnComponent } from './features/kanban-board/components/column/column.component';
import { TicketComponent } from './features/kanban-board/components/ticket/ticket.component';
import { TicketFormComponent } from './features/ticket-form/ticket-form.component';
import { OwnerManagementComponent } from './features/owner-management/owner-management.component';
import { FloatingActionButtonComponent } from './shared/components/floating-action-button/floating-action-button.component';
import { OwnerFormComponent } from './features/owner-form/owner-form.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    ColumnComponent,
    TicketComponent,
    TicketFormComponent,
    OwnerManagementComponent,
    FloatingActionButtonComponent,
    OwnerFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DragDropModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
