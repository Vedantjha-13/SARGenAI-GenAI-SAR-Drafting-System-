# GenAI SAR Auto-Drafting System

A modern, responsive fintech web application UI for automated Suspicious Activity Report (SAR) generation and review using artificial intelligence.

## Overview

**SAR AI** is an intelligent system that assists financial compliance professionals in drafting, reviewing, and managing Suspicious Activity Reports. The application features a human-in-the-loop workflow where AI-generated SAR reports are reviewed and edited by users before final approval.

## Key Features

- **Dashboard**: Overview of all SAR cases with risk scoring and status filtering
- **Case Management**: Detailed view of user information and transaction history
- **SAR Review Interface**: Split-screen editor for reviewing and editing AI-generated reports
- **History & Audit**: Complete record of all SAR reports with approval tracking
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Theme**: Modern fintech aesthetic with blue/black color scheme

## Tech Stack

- **React 18** - Functional components with hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework with dark theme
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx
│   ├── CaseTable.tsx
│   ├── TransactionList.tsx
│   ├── SAREditor.tsx
│   └── ActionButtons.tsx
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── CaseDetail.tsx
│   ├── SARReview.tsx
│   └── History.tsx
├── data/               # Mock data
│   └── mockData.ts
├── styles/             # Global styles
│   └── globals.css
├── App.tsx             # Router configuration
├── index.css           # Tailwind CSS setup
└── main.tsx            # Entry point
```

## Routes

- `/dashboard` - Main dashboard with case overview
- `/case/:caseId` - Detailed case view with transaction history
- `/review/:caseId` - SAR review interface with editable content
- `/history` - Historical records of SAR reports

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

## Build

```bash
npm run build
```

## Features Explained

### Dashboard Page
- View all SAR cases in a table format
- Color-coded risk scores (Red: High, Yellow: Medium, Green: Low)
- Search and filter by status (Pending, Approved, Rejected)
- Quick access to case details via "View Case" button

### Case Detail Page
- User information card
- Complete transaction history
- Suspicious transactions highlighted with red badges
- "Generate SAR" button to initiate report generation

### SAR Review Page (Main Feature)
- **Left Panel**: Transaction summary and key suspicious insights
- **Right Panel**: Large editable textarea with AI-generated draft
- AI Confidence Score display
- Version comparison between original and edited content
- Action buttons: Save Edit, Approve, Reject

### History Page
- Searchable table of past SAR reports
- Filter by status
- View full report details
- Approval tracking with user info

## Design Guidelines

- **Color Scheme**: Dark theme with blue/black tones (#0f172a base, #1e293b secondary)
- **Typography**: Inter font stack for clean, modern appearance
- **Components**: Card-based layout with soft shadows and rounded corners
- **Spacing**: Consistent 4px grid system
- **Interactions**: Smooth hover effects and transitions

## AI Workflow

The application demonstrates a human-in-the-loop AI process:
1. **AI Generation** - Generate SAR report automatically based on suspicious patterns
2. **Human Review** - Compliance officer reviews AI-generated content
3. **Editing** - Edit and refine the report as needed
4. **Approval** - Approve the final version or reject for regeneration
5. **Archive** - Store in history with full audit trail

## Components

### Navbar
Navigation header with SAR AI branding and user profile section.

### CaseTable
Sortable and filterable table displaying all SAR cases with risk scores and status.

### TransactionList
List component showing transaction details with suspicious activity highlights.

### SAREditor
Main editable textarea component for AI-generated SAR content.

### ActionButtons
Group of action buttons for Save, Approve, and Reject operations.

## Future Enhancements

- Export SAR reports to PDF
- Real-time collaboration features
- Integration with backend API
- Machine learning model updates
- Advanced filtering and search
- Notification system for case updates

## License

Proprietary - GenAI SAR Auto-Drafting System

## Support

For support or questions, contact compliance team.
