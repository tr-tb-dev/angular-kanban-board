# Kanban Board

A modern, feature-rich Kanban board application built with Angular 16.

## Features

### Board Management
- **Three-column workflow**: To Do, In Progress, and Done
- **Drag and drop**: Seamlessly move tickets between columns
- **Real-time updates**: Changes are instantly reflected across the board
- **Persistent storage**: All data is saved locally in the browser

### Ticket Management
- **Create tickets**: Add new tickets with title, description, and owner assignment
- **Edit tickets**: Update ticket details at any time
- **Delete tickets**: Remove tickets with confirmation
- **Owner tracking**: Each ticket displays its assigned owner with a user icon

### Owner Management
- **Dedicated owner page**: Manage all team members in one place
- **Create owners**: Add new owners with name and optional email
- **Edit owners**: Update owner information
- **Delete owners**: Remove owners (with validation for tickets)
- **Owner statistics**: View ticket count for each owner

### Import/Export
- **Export board state**: Download the entire board as a JSON file
- **Import board state**: Restore a previously saved board
- **Data validation**: Import with error handling and user-friendly warnings
- **Timestamped exports**: Each export includes creation date

### User Interface
- **Material Design**: Clean, modern interface using Angular Material icons
- **Responsive design**: Works seamlessly on desktop and mobile devices
- **Hover interactions**: Visual feedback for all interactive elements
- **Floating action buttons**: Quick access to create new tickets and owners
- **Modal dialogs**: Intuitive forms for creating and editing items

## Getting Started

### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

### Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Technologies Used

- Angular 16
- Angular Material
- Angular CDK (Drag & Drop)
- TypeScript
- RxJS
- LocalStorage API
