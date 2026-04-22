# SAR AI - GenAI Suspicious Activity Report Auto-Drafting System

## Project Overview
Modern, responsive fintech web application UI for automated Suspicious Activity Report (SAR) generation and review using artificial intelligence. Features a human-in-the-loop workflow with AI-generated content review and approval.

## Technology Stack
- **Frontend Framework**: React 18 (TypeScript, Functional Components)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Dark Theme)
- **Routing**: React Router v6
- **Architecture**: Component-Based with Feature Separation

## Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── Navbar.tsx       # Navigation header
│   ├── CaseTable.tsx    # Searchable case table
│   ├── TransactionList.tsx  # Transaction display
│   ├── SAREditor.tsx    # Editable SAR content
│   └── ActionButtons.tsx # Action button group
├── pages/               # Page components
│   ├── Dashboard.tsx    # Cases overview
│   ├── CaseDetail.tsx   # Case information
│   ├── SARReview.tsx    # Main review interface
│   └── History.tsx      # SAR reports history
├── data/
│   └── mockData.ts      # Mock data and types
├── App.tsx              # Router configuration
├── main.tsx             # Entry point
└── index.css            # Tailwind & custom styles
```

## Key Features
- **Dashboard**: Case overview with risk scoring and filtering
- **Case Detail**: User info, transaction history, suspicious patterns
- **SAR Review**: Split-screen layout with AI content editor
- **History**: Searchable archive of SAR reports
- **Dark Theme**: Modern fintech aesthetic
- **Responsive Design**: Mobile-friendly

## Routes
- `/dashboard` - Main dashboard with case table
- `/case/:caseId` - Detailed case view
- `/review/:caseId` - SAR report editor (main feature)
- `/history` - Past SAR reports
- `/` - Redirect to dashboard

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The app will open at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## Development Guidelines

### Component Architecture
- Keep components focused and reusable
- Use TypeScript interfaces for prop typing
- Functional components with hooks only

### Styling
- Use Tailwind CSS utility classes
- Dark theme with slate/blue color palette
- Responsive mobile-first design
- Consistent spacing using Tailwind grid

### State Management
- Use React hooks (useState, useMemo, useCallback)
- Local component state preferred
- Mock data in `mockData.ts`

### Data
Mock data includes:
- 5 sample SAR cases with risk scores
- Transaction details
- User information
- Historical SAR reports

## Design System

### Colors (Dark Theme)
- **Background**: slate-950 (#030712)
- **Secondary**: slate-900, slate-800
- **Primary**: blue-600
- **Success**: green-600
- **Danger**: red-600
- **Warning**: yellow-600
- **Text**: slate-50, slate-100

### Typography
- Font: Inter (Google Fonts)
- Sizes: Consistent Tailwind scale
- Weights: 400, 500, 600, 700, 800

### Components
- Cards with soft shadows and rounded corners
- Buttons with hover states
- Tables with stripe patterns
- Badges for status/risk levels
- Form inputs with focus states

## Features Highlight

### Dashboard Page
- Real-time stats cards
- Filterable case table
- Search by ID, User ID, or Name
- Risk-based sorting
- Color-coded risk badges

### Case Detail Page
- User information card
- Risk score visualization
- Suspicious pattern list
- Transaction history with indicators
- "Generate SAR" button

### SAR Review Page (Main Feature)
- **Left Panel**:
  - Transaction summary
  - Key suspicious insights
  - Case information
- **Right Panel**:
  - Large editable textarea
  - AI confidence score (visual bar)
  - Save/Approve/Reject buttons
  - Version comparison toggle

### History Page
- Sortable SAR report table
- Status filtering
- Full report preview
- AI confidence display
- Approval tracking

## Human-in-the-Loop Workflow
1. **AI Generation**: System generates SAR based on case data
2. **Human Review**: Officer reviews AI content
3. **Editing**: Edit and refine as needed
4. **Approval**: Approve or reject report
5. **Archive**: Store with audit trail

## Future Enhancements
- Backend API integration
- Real database connection
- PDF export
- Real-time collaboration
- Advanced analytics
- Custom rule engine
- Notification system

## Performance Optimization
- Code splitting for routes
- Lazy loading components
- Memoization for expensive renders
- Optimized re-renders

## Accessibility
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels where needed
- Sufficient color contrast

## Testing (Future)
- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright

## Deployment
- Vite optimized production build
- Minimal dependencies
- Works with any static hosting (Vercel, Netlify, etc.)

## Support
For development questions or issues, refer to:
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Vite: https://vitejs.dev
- React Router: https://reactrouter.com
