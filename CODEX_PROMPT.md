# SAR GenAI System - Complete Development Prompt for Codex

## 📌 PROJECT OVERVIEW

You are working on a **GenAI Suspicious Activity Report (SAR) Auto-Drafting System** - a fintech web application that uses AI to automatically generate SAR reports from case data, with human-in-the-loop review and approval workflow.

**Stack**:
- **Frontend**: React 18 + TypeScript + Tailwind CSS (dark theme)
- **Backend**: FastAPI (async) + MongoDB (async Motor driver)
- **AI/ML**: LangChain + OpenAI GPT-4.1-mini + FAISS (RAG)
- **Auth**: OAuth 2.0 (Google/GitHub provider - to implement)

---

## ✅ WHAT IS CURRENTLY WORKING

### **1. Backend Architecture**
- ✅ FastAPI async server running on port 8000
- ✅ Motor async MongoDB driver with connection pooling
- ✅ Lifespan management (startup/shutdown hooks)
- ✅ CORS configured for localhost:5173
- ✅ Health check endpoint `/health`

**Files**: `backend/app.py`, `backend/db/connection.py`, `backend/config.py`

### **2. Data Models (MongoDB Collections)**

**`cases` Collection** - [backend/models/case_model.py](backend/models/case_model.py)
```python
{
  _id: ObjectId,
  case_reference: str (unique, e.g., "CASE-001"),
  subject_name: str,
  subject_account: str,
  risk_level: str ("low", "medium", "high"),
  narrative_context: str | None,
  transactions: TransactionModel[],
  metadata: dict,
  created_at: datetime,
  updated_at: datetime
}
```

**`sar_reports` Collection** - [backend/models/sar_model.py](backend/models/sar_model.py)
```python
{
  _id: ObjectId,
  case_id: str (ref to cases._id),
  ai_generated_text: str,
  human_edited_text: str | None,
  status: str ("pending", "approved", "rejected"),
  confidence_score: float (0.0-1.0),
  retrieved_context: str[],
  generation_metadata: dict {model, rationale, generated_at},
  approved_by: str | None,
  rejected_by: str | None,
  rejection_reason: str | None,
  created_at: datetime,
  updated_at: datetime,
  approved_at: datetime | None,
  rejected_at: datetime | None
}
```

### **3. API Endpoints (Working)**

| Method | Endpoint | Status | Purpose |
|--------|----------|--------|---------|
| GET | `/health` | ✅ | Health check |
| GET | `/cases` | ✅ | List all cases with pagination |
| GET | `/case/{case_id}` | ✅ | Get case details |
| POST | `/generate-sar` | ✅ | Generate SAR from case |
| POST | `/update-sar` | ✅ | Save human edits |
| POST | `/approve-sar` | ✅ | Approve SAR (no auth check) |
| POST | `/reject-sar` | ✅ | Reject SAR (no auth check) |

**Files**: `backend/routes/case_routes.py`, `backend/routes/sar_routes.py`

### **4. AI/LLM Integration**
- ✅ LangChain orchestration with OpenAI GPT-4.1-mini
- ✅ Structured output with Pydantic `SARGenerationOutput`
- ✅ System prompt: "You are an AML compliance analyst..."
- ✅ Chain: Template → LLM → Structured parser

**Files**: `backend/services/ai_service.py`

### **5. RAG (Retrieval-Augmented Generation)**
- ✅ FAISS vector store for compliance rules
- ✅ OpenAI text-embedding-3-large for embeddings
- ✅ Knowledge base: `backend/knowledge/compliance_rules.txt`
- ✅ Retrieval: Top-K=4 similar rules per query
- ✅ Recursive text splitting (chunk_size=800, overlap=120)

**Files**: `backend/services/rag_service.py`

### **6. Frontend Integration**
- ✅ React 18 + TypeScript + Tailwind CSS dark theme
- ✅ API client with timeout & error handling
- ✅ Mock data fallback when backend unavailable
- ✅ Dashboard, CaseDetail, SARReview, History pages
- ✅ Routing via React Router v6

**Files**: `src/lib/api.ts`, `src/pages/`, `src/components/`

### **7. Database Connection**
- ✅ Async MongoDB connection via Motor
- ✅ Settings from `.env` file (Pydantic-settings)
- ✅ Singleton connection manager
- ✅ Seed data script: `backend/scripts/seed_cases.py`

---

## 🔴 CRITICAL GAPS & MISSING COMPONENTS

### **1. Authentication & Authorization (BLOCKING)**
- ❌ No user authentication mechanism
- ❌ No OAuth provider integration (Google/GitHub)
- ❌ No JWT token validation
- ❌ No role-based access control (RBAC)
- ❌ Anyone can call `/approve-sar`, `/reject-sar` endpoints
- ❌ No way to track who approved/rejected each SAR
- ❌ No `users` collection in MongoDB
- ❌ No session management

**Impact**: **CRITICAL** - System is completely unsecured. Production blocker.

### **2. Audit Logging (COMPLIANCE REQUIRED)**
- ❌ No `audit_logs` collection
- ❌ No tracking of SAR approvals/rejections
- ❌ No who-did-what-when trail
- ❌ No data modification history
- ❌ No API endpoint access logging

**Impact**: **CRITICAL** - Regulatory compliance requirement for financial AML systems.

### **3. Database Indexes & Constraints**
- ❌ No database indexes on frequently queried fields
- ❌ Missing: `cases.case_reference` index (unique)
- ❌ Missing: `cases.risk_level` index
- ❌ Missing: `sar_reports.case_id` index
- ❌ Missing: `sar_reports.status` index
- ❌ No TTL indexes for data retention policies

**Impact**: **HIGH** - Queries will be slow; no data retention enforcement.

### **4. Missing API Endpoints**
- ❌ `GET /sars` - List all SAR reports with filtering
- ❌ `GET /sars/{sar_id}` - Fetch single SAR
- ❌ `GET /sars/history` - SAR history with status filter
- ❌ `POST /sars/{sar_id}/regenerate` - Regenerate SAR
- ❌ `DELETE /sars/{sar_id}` - Archive SAR
- ❌ `GET /audit-logs` - Retrieve audit trail
- ❌ `POST /export/sar/{sar_id}` - PDF export

**Impact**: **HIGH** - Frontend History page uses mock data; no way to list/filter SARs.

### **5. Input Validation & Sanitization**
- ❌ No string sanitization (injection attack risk)
- ❌ No length validation on analyst_notes
- ❌ No content filtering
- ❌ Weak Pydantic validators on models

**Impact**: **MEDIUM** - Security & data quality risk.

### **6. Error Handling & Responses**
- ❌ No structured error response format
- ❌ No HTTP status codes (returns 200 for errors)
- ❌ No error codes for frontend error handling
- ❌ No meaningful error messages
- ❌ No input validation error messages

**Impact**: **MEDIUM** - Hard to debug; frontend doesn't know what failed.

### **7. Frontend-Backend Integration**
- ❌ Mock data in History page instead of real API
- ❌ No loading states
- ❌ No error boundaries
- ❌ No retry logic
- ❌ No form validation on SAR editor

**Impact**: **MEDIUM** - Poor user experience; fragile UI.

### **8. Testing**
- ❌ No unit tests
- ❌ No integration tests
- ❌ No API tests
- ❌ No E2E tests

**Impact**: **LOW** - Non-blocking for MVP, needed for production.

### **9. DevOps & Deployment**
- ❌ No Docker setup
- ❌ No CI/CD pipeline
- ❌ No environment management (dev/staging/prod)
- ❌ No secrets management

**Impact**: **LOW** - Non-blocking for local development, needed for deployment.

---

## 🎯 WORK BREAKDOWN STRUCTURE (Priority Order)

### **PHASE 1: Authentication & Authorization (CRITICAL)** - ~40 hours

#### **1.1: OAuth 2.0 Integration**
- Implement OAuth provider (Google/GitHub or both)
- Setup OAuth callback endpoints
- Store OAuth tokens securely in `.env`
- Frontend login redirect flow
- Create user session management

**Deliverables**:
- `backend/auth/oauth_service.py` - OAuth provider logic
- `backend/routes/auth_routes.py` - Login/logout/callback endpoints
- `src/components/LoginPage.tsx` - Frontend login UI
- Update `backend/config.py` with OAuth credentials

**Specifics**:
```
OAuth Flow:
1. User clicks "Login with Google" on frontend
2. Frontend redirects to Google OAuth consent screen
3. User grants permission
4. Google redirects back to backend callback URL
5. Backend exchanges auth code for OAuth token
6. Backend creates user in MongoDB (if new)
7. Backend issues app session token (JWT or session cookie)
8. Frontend stores session token
9. All subsequent API calls include session token
```

#### **1.2: User Collection & RBAC**
- Create `users` MongoDB collection
- Define roles: `analyst`, `supervisor`, `admin`
- Create role-based decorators for endpoints
- Implement permission checks

**Deliverables**:
- `backend/models/user_model.py` - User schema with roles
- `backend/auth/rbac.py` - Role-based access decorators
- `backend/middleware/auth.py` - Authentication middleware
- Update all route handlers with `@require_role("supervisor")`

**Role Definitions**:
```
analyst: Can view cases, generate SARs, edit their own SARs
supervisor: Can approve/reject SARs, view audit logs
admin: Full access, manage users, configure system
```

#### **1.3: Endpoint Protection**
- Add OAuth middleware to all endpoints
- Protect `/approve-sar` (supervisor+ only)
- Protect `/reject-sar` (supervisor+ only)
- Protect audit log endpoints (supervisor+ only)

**Files to modify**:
- `backend/routes/case_routes.py` - Add auth checks
- `backend/routes/sar_routes.py` - Add auth checks, capture approved_by/rejected_by
- `backend/app.py` - Add auth middleware

---

### **PHASE 2: Audit Logging (COMPLIANCE)** - ~15 hours

#### **2.1: Audit Log Collection**
- Create `audit_logs` MongoDB collection
- Capture all SAR state changes (created, approved, rejected, edited)
- Include: user_id, action, before_state, after_state, timestamp

**Deliverables**:
- `backend/models/audit_log_model.py` - Audit schema
- `backend/services/audit_service.py` - Log creation logic
- Database indexes & TTL (90-day retention)

#### **2.2: Audit Logging on All Changes**
- Log SAR generation
- Log human edits
- Log approvals with user
- Log rejections with reason
- Log any metadata changes

**Files to modify**:
- `backend/services/ai_service.py` - Add audit logging
- `backend/services/case_service.py` - Add audit logging

#### **2.3: Audit Log API**
- `GET /audit-logs` - Retrieve audit trail (supervisor+ only)
- Query by SAR ID, date range, user, action type

**Deliverables**:
- `backend/routes/audit_routes.py` - Audit endpoints

---

### **PHASE 3: Database Indexes & Optimization** - ~5 hours

#### **3.1: Create Indexes**
```javascript
// cases collection
db.cases.createIndex({ "case_reference": 1 }, { unique: true })
db.cases.createIndex({ "risk_level": 1 })
db.cases.createIndex({ "updated_at": -1 })
db.cases.createIndex({ "subject_account": 1 })

// sar_reports collection
db.sar_reports.createIndex({ "case_id": 1 })
db.sar_reports.createIndex({ "status": 1 })
db.sar_reports.createIndex({ "created_at": -1 })
db.sar_reports.createIndex({ "approved_at": 1 }, { sparse: true })

// audit_logs collection
db.audit_logs.createIndex({ "sar_id": 1 })
db.audit_logs.createIndex({ "action": 1 })
db.audit_logs.createIndex({ "timestamp": -1 })
db.audit_logs.createIndex({ "user_id": 1 })
// TTL: Auto-delete after 90 days
db.audit_logs.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 7776000 })

// users collection
db.users.createIndex({ "oauth_id": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
```

**Deliverables**:
- `backend/db/migrations.py` - Index creation script
- Update `backend/db/connection.py` startup to create indexes

---

### **PHASE 4: Missing API Endpoints** - ~20 hours

#### **4.1: SAR CRUD Endpoints**
- `GET /sars?status=pending&limit=10&skip=0` - List SARs with filtering
- `GET /sars/{sar_id}` - Fetch single SAR
- `GET /sars/history?analyst_id=X&date_from=Y&date_to=Z` - History with filters
- `POST /sars/{sar_id}/regenerate` - Regenerate SAR with new notes
- `DELETE /sars/{sar_id}` - Soft delete (archive)

**Deliverables**:
- Update `backend/routes/sar_routes.py` - Add endpoints
- Update `backend/schemas/` - Add response schemas

#### **4.2: Pagination & Filtering**
- All list endpoints support: `limit`, `skip`, `sort_by`, `sort_order`
- Filter options: `status`, `date_range`, `analyst_id`, `risk_level`
- Consistent pagination format

#### **4.3: Statistics Endpoints**
- `GET /stats/sars` - SAR generation stats (count by status, avg confidence)
- `GET /stats/approvals` - Approval rate by analyst
- `GET /stats/cases` - Case stats by risk level

---

### **PHASE 5: Input Validation & Error Handling** - ~15 hours

#### **5.1: Request Validation**
- Validate all request bodies with Pydantic
- String length limits: analyst_notes (max 4000 chars)
- Enum validation: status (only "pending"/"approved"/"rejected")
- Remove HTML/scripts from strings
- Validate MongoDB ObjectIDs

**Deliverables**:
- Update `backend/schemas/request_schemas.py` - Add validators
- Create `backend/exceptions/` directory - Custom exceptions

#### **5.2: Structured Error Responses**
```python
{
  "error": {
    "code": "SAR_NOT_FOUND",
    "message": "SAR report with ID 'abc' not found",
    "status": 404,
    "timestamp": "2026-06-09T10:30:00Z",
    "details": {...}
  }
}
```

**Deliverables**:
- `backend/exceptions/error_responses.py` - Standard error format
- `backend/middleware/error_handler.py` - Global error handler
- Update all route handlers to use standard errors

#### **5.3: HTTP Status Codes**
- 200 OK - Success
- 201 Created - Resource created
- 400 Bad Request - Validation error
- 401 Unauthorized - Not authenticated
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server error

---

### **PHASE 6: Frontend Integration** - ~20 hours

#### **6.1: Login/Auth UI**
- Create LoginPage component
- Google OAuth button
- Session management
- Logout functionality

**Deliverables**:
- `src/pages/LoginPage.tsx`
- `src/contexts/AuthContext.tsx` - Auth state management
- `src/hooks/useAuth.ts` - Auth hooks

#### **6.2: API Client Updates**
- Update `src/lib/api.ts` to include auth token in headers
- Implement all new endpoints
- Add error handling & retry logic

**Deliverables**:
- Update `src/lib/api.ts` with new endpoints

#### **6.3: Page Updates**
- **History Page**: Replace mock data with real `/sars` endpoint
- **SAR Review**: Show approval history from audit logs
- **Dashboard**: Add loading states & error handling
- Add error boundary component

**Deliverables**:
- Update `src/pages/History.tsx`
- Update `src/pages/SARReview.tsx`
- Create `src/components/ErrorBoundary.tsx`

#### **6.4: User Experience**
- Loading spinners on async operations
- Toast notifications for errors/success
- Form validation on SAR editor
- Confirmation dialog before approve/reject

**Deliverables**:
- Create `src/components/Toast.tsx`
- Update `src/pages/SARReview.tsx` with UI improvements

---

### **PHASE 7: Testing** - ~30 hours (Optional for MVP)

#### **7.1: Backend Tests**
- Unit tests for services (pytest)
- API integration tests
- Test fixtures for seed data

#### **7.2: Frontend Tests**
- Component tests (Vitest)
- API client tests

#### **7.3: E2E Tests**
- End-to-end workflow tests
- Playwright for critical flows

---

### **PHASE 8: DevOps (Optional for MVP)** - ~20 hours

#### **8.1: Docker**
- Dockerfile for backend
- Docker Compose for full stack

#### **8.2: CI/CD**
- GitHub Actions workflow
- Automated testing on PR

---

## 🔧 IMPLEMENTATION DETAILS

### **OAuth Configuration**

**Google OAuth**:
```
1. Go to https://console.cloud.google.com/
2. Create project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web app)
5. Authorized redirect URIs: http://localhost:8000/auth/callback, https://yourdomain.com/auth/callback
6. Get CLIENT_ID and CLIENT_SECRET
7. Add to .env:
   GOOGLE_OAUTH_CLIENT_ID=xxx
   GOOGLE_OAUTH_CLIENT_SECRET=yyy
```

**Backend Implementation**:
```python
# backend/auth/oauth_service.py
from authlib.integrations.starlette_client import OAuth

oauth = OAuth()
google = oauth.register(
    name='google',
    client_id=settings.google_oauth_client_id,
    client_secret=settings.google_oauth_client_secret,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# OAuth callback flow in routes
```

### **User Model with OAuth**
```python
# backend/models/user_model.py
from enum import Enum
from datetime import datetime
from pydantic import BaseModel

class UserRole(str, Enum):
    analyst = "analyst"
    supervisor = "supervisor"
    admin = "admin"

class User(BaseModel):
    id: str  # MongoDB ObjectId as string
    oauth_provider: str  # "google", "github"
    oauth_id: str  # Provider-specific user ID
    email: str
    name: str
    profile_picture: str | None
    role: UserRole = UserRole.analyst
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    last_login: datetime | None = None
```

### **Session Token Strategy**
Option A: JWT token (stateless)
```
- OAuth → backend → generate JWT with user info + role
- JWT stored in localStorage on frontend
- Include in Authorization: Bearer token header
- JWT expires after 24 hours
```

Option B: Session cookie (stateful)
```
- OAuth → backend → create session in db
- Session cookie stored in httpOnly cookie
- Automatically sent with requests
- More secure, simpler for frontend
```

**Recommendation**: Use JWT for stateless scalability.

### **Middleware Flow**
```python
# backend/middleware/auth.py
async def auth_middleware(request, call_next):
    token = request.headers.get("Authorization")
    if not token:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    
    try:
        payload = jwt.decode(token, settings.secret_key)
        request.state.user = User(**payload)
    except:
        return JSONResponse({"error": "Invalid token"}, status_code=401)
    
    return await call_next(request)

# In route
@router.post("/approve-sar")
@require_role("supervisor")
async def approve_sar(request: Request, body: ApproveSARRequest):
    user = request.state.user  # Already authenticated & authorized
    # ... approval logic
```

---

## 📊 Data Model Updates Required

### **Updated SAR Report Model**
```python
# backend/models/sar_model.py
class SARReport(BaseModel):
    id: str  # ObjectId
    case_id: str
    ai_generated_text: str
    human_edited_text: str | None = None
    status: SARStatus  # Enum: pending, approved, rejected
    confidence_score: float  # 0.0-1.0
    retrieved_context: List[str]
    generation_metadata: dict
    
    # Approval tracking
    created_by: str  # Analyst user ID who generated
    created_at: datetime
    
    approved_by: str | None  # Supervisor user ID
    approved_at: datetime | None
    
    rejected_by: str | None
    rejected_at: datetime | None
    rejection_reason: str | None
    
    updated_at: datetime
```

### **Updated Case Model**
```python
# Add field to track who created the case
class Case(BaseModel):
    # ... existing fields
    created_by: str  # User ID
    created_at: datetime
```

---

## 🚀 Execution Order (Recommended)

```
Week 1:
- [ ] Setup OAuth (Google/GitHub)
- [ ] Create user_model.py with roles
- [ ] Create auth middleware & decorators
- [ ] Create login page
- [ ] Protect endpoints with @require_role

Week 2:
- [ ] Create audit_logs collection
- [ ] Implement audit logging in services
- [ ] Create audit API endpoints
- [ ] Create database indexes
- [ ] Update error handling

Week 3:
- [ ] Add missing SAR endpoints (GET /sars, etc.)
- [ ] Update frontend API client
- [ ] Update History page to use real data
- [ ] Add loading states & error boundaries
- [ ] Add form validation

Week 4:
- [ ] Testing & bug fixes
- [ ] User acceptance testing
- [ ] Deployment preparation
```

---

## 📝 CHECKLIST FOR IMPLEMENTATION

### OAuth & Auth
- [ ] Google OAuth provider configured
- [ ] OAuth callback endpoint implemented
- [ ] User collection created
- [ ] JWT token generation & validation
- [ ] Auth middleware protecting endpoints
- [ ] Login page with OAuth button
- [ ] Session management on frontend
- [ ] Logout functionality

### Audit & Compliance
- [ ] audit_logs collection created
- [ ] Audit service logging all changes
- [ ] Audit API endpoint (supervisor+ only)
- [ ] TTL index for 90-day retention

### Database
- [ ] All indexes created
- [ ] User collection with OAuth fields
- [ ] SAR model updated with user tracking
- [ ] Audit log model created

### API Endpoints
- [ ] GET /sars with filtering
- [ ] GET /sars/{sar_id}
- [ ] POST /sars/{id}/regenerate
- [ ] DELETE /sars/{id}
- [ ] GET /audit-logs
- [ ] All endpoints protected with auth

### Frontend
- [ ] Login page created
- [ ] Auth context & hooks
- [ ] API client updated with auth token
- [ ] History page using real data
- [ ] Error boundary component
- [ ] Loading states on async operations
- [ ] Toast notifications

### Error Handling
- [ ] Structured error responses
- [ ] Input validation middleware
- [ ] Global error handler
- [ ] All endpoints return proper HTTP status codes

---

## 🎯 SUCCESS CRITERIA

After completing this work:

1. **Security**: 
   - ✅ User must be authenticated to access any API
   - ✅ Role-based access control enforced
   - ✅ SAR approvals tracked with user ID

2. **Compliance**:
   - ✅ Full audit trail of all changes
   - ✅ 90-day retention policy enforced
   - ✅ Who approved/rejected each SAR is recorded

3. **Performance**:
   - ✅ Database queries < 100ms (indexes working)
   - ✅ API responses < 500ms
   - ✅ SAR generation < 3 seconds

4. **Functionality**:
   - ✅ Users can login with OAuth
   - ✅ History page shows real SAR list
   - ✅ Supervisors can approve/reject
   - ✅ All SARs are auditable

5. **UX**:
   - ✅ No mock data in production UI
   - ✅ Loading states on all async operations
   - ✅ Clear error messages
   - ✅ Form validation prevents bad data

---

## 📚 KEY FILES REFERENCE

**Backend Core**:
- `backend/app.py` - FastAPI application setup
- `backend/config.py` - Settings & environment
- `backend/db/connection.py` - MongoDB connection

**Authentication** (to create):
- `backend/auth/oauth_service.py` - OAuth provider logic
- `backend/auth/rbac.py` - Role-based decorators
- `backend/middleware/auth.py` - Auth middleware

**Models**:
- `backend/models/user_model.py` - User schema (create)
- `backend/models/audit_log_model.py` - Audit schema (create)
- `backend/models/case_model.py` - Case schema (update)
- `backend/models/sar_model.py` - SAR schema (update)

**Routes** (update/create):
- `backend/routes/auth_routes.py` - Login/logout (create)
- `backend/routes/case_routes.py` - Case endpoints (update)
- `backend/routes/sar_routes.py` - SAR endpoints (update)
- `backend/routes/audit_routes.py` - Audit endpoints (create)

**Services**:
- `backend/services/ai_service.py` - LLM & SAR generation (update)
- `backend/services/case_service.py` - Case queries (update)
- `backend/services/audit_service.py` - Audit logging (create)

**Frontend**:
- `src/lib/api.ts` - API client (update)
- `src/pages/LoginPage.tsx` - Login UI (create)
- `src/pages/History.tsx` - SAR history (update)
- `src/pages/SARReview.tsx` - SAR review (update)
- `src/contexts/AuthContext.tsx` - Auth state (create)

---

## ❓ QUESTIONS FOR CLARIFICATION

Before Codex starts implementation:

1. **OAuth Provider**: Google only, or both Google + GitHub?
2. **Session Duration**: How long should JWT tokens be valid? (24h recommended)
3. **Role Structure**: 3 roles (analyst/supervisor/admin) or more?
4. **Data Retention**: 90 days for audit logs, or different?
5. **Email Notifications**: Should approval/rejection send emails?
6. **Approval Workflow**: Single approval or multi-level?

---

## 🎓 LEARNING RESOURCES

- OAuth 2.0: https://oauth.net/2/
- FastAPI Security: https://fastapi.tiangolo.com/tutorial/security/
- MongoDB Indexes: https://docs.mongodb.com/manual/indexes/
- LangChain: https://python.langchain.com/
- React Auth: https://reactrouter.com/en/main/start/overview

---

**END OF PROMPT**

Use this with Codex to implement the full authentication, audit logging, and API completion for Phase 1-6.
