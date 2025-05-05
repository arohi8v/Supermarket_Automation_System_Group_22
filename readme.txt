#Supermarket Automation System – Group 22

This project is a comprehensive Supermarket Automation System developed as part of our Software Engineering course. It facilitates efficient sales and inventory management, providing a seamless experience for both administrators and customers.

## Project Structure

- `app/` – Core application logic and routing.
- `backend/` – Server-side operations and API endpoints.
- `components/` – Reusable UI components.
- `coverage/` – Test coverage reports.
- `database/` – Database schemas and seed data.
- `hooks/` – Custom React hooks.
- `lib/` – Utility functions and libraries.
- `public/` – Static assets like images and icons.
- `styles/` – Global and component-specific styles.
- `testselenium.py` – Selenium-based end-to-end tests.
- `__tests__/` – Unit and integration tests.

## Tech Stack Used

- **Next.js** – React framework for server-side rendering.
- **Tailwind CSS** – Utility-first CSS framework.
- **TypeScript** – Typed superset of JavaScript.
- **Jest** – JavaScript testing framework.
- **Selenium** – Automated browser testing.
- **pnpm** – Fast, disk space-efficient package manager.

## Getting Started

### Prerequisites

The following needs to be installed before running the repository:

- [Node.js](https://nodejs.org/) (v16 or later)
- [pnpm](https://pnpm.io/) (v7 or later)

### Installation

1. **Clone the repository:**
   git clone https://github.com/arohi8v/Supermarket_Automation_System_Group_22.git
   cd Supermarket_Automation_System_Group_22

2. **Install dependencies**
   pnpm install

3. **Run the development server**
   pnpm dev

### Running Tests
1. Unit Tests:
   pnpm test

2. End-to-End Tests with Selenium:
   python testselenium.py

### Build for Production
To build the application for production:
pnpm build

To start the production server:
pnpm start




