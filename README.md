# Supermarket Automation System – Group 22

A comprehensive full-stack Supermarket Automation System built as part of our Software Engineering course project. It streamlines sales, inventory management, and reporting, with distinct roles for administrators and customers.

---

## Project Structure

```
Supermarket_Automation_System
├── app/             # Core application pages and routing (Next.js)
├── backend/         # API routes and backend logic
├── components/      # Reusable UI components
├── coverage/        # Jest test coverage reports
├── database/        # Database schemas and seed data
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── public/          # Static assets (images, icons)
├── styles/          # Tailwind CSS and global styles
├── tests/           # Unit and integration tests
└── testselenium.py  # Selenium end-to-end test script
```

---

## Tech Stack Used

- Next.js – React framework with SSR support  
- Tailwind CSS – Utility-first styling  
- TypeScript – Static typing for JavaScript
- Sql - Database
- Java - Backend setup
- Jest – Unit testing  
- Selenium – Browser automation for E2E testing  
- pnpm – Fast package manager

---

## Getting Started

### Prerequisites

Make sure you have these installed:

- Node.js (v16+)
- pnpm (v7+)
- Python (for Selenium tests)

### Installation

```bash
# Clone the repo
git clone https://github.com/arohi8v/Supermarket_Automation_System_Group_22.git
cd Supermarket_Automation_System_Group_22

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

---

## Running Tests

### Unit Tests (Jest)

```bash
pnpm test
```

### End-to-End Tests (Selenium)

```bash
python testselenium.py
```

---

## Production Build

```bash
# Build the app
pnpm build

# Start production server
pnpm start
```


