# Tasks: Ajosave Project Restructuring

## Phase 1: Setup Infrastructure (Week 1)

### 1.1 Create Root Directory Structure
- [ ] Create packages/ directory in project root
- [ ] Create docs/ directory with subdirectories (api/, architecture/, deployment/, features/, security/)
- [ ] Create config/ directory for root-level configurations
- [ ] Create scripts/ directory for cross-project automation

### 1.2 Initialize Monorepo Configuration
- [ ] Create root package.json with workspaces configuration
- [ ] Configure npm/yarn workspaces to include packages/*
- [ ] Set up package namespace (@ajosave/*)
- [ ] Create root .gitignore file

### 1.3 Setup Root-Level Configurations
- [ ] Create config/eslint.config.js with shared linting rules
- [ ] Create config/tsconfig.base.json for base TypeScript configuration
- [ ] Create config/.env.template documenting all environment variables
- [ ] Configure Prettier for code formatting

### 1.4 Create Shared Package
- [ ] Create packages/shared/ directory structure
- [ ] Initialize package.json for @ajosave/shared
- [ ] Create src/types/ directory for TypeScript definitions
- [ ] Create src/constants/ directory for shared constants
- [ ] Create src/utils/ directory for shared utilities

### 1.5 Setup Pre-commit Hooks
- [ ] Install husky for git hooks
- [ ] Configure pre-commit hook to run linting
- [ ] Configure pre-commit hook to run type checking
- [ ] Configure pre-commit hook to prevent committing .env files

## Phase 2: Migrate Backend (Week 2)

### 2.1 Create Backend Directory Structure
- [ ] Create packages/backend/ directory
- [ ] Create src/api/ with subdirectories (routes/, controllers/, middlewares/, validators/)
- [ ] Create src/core/ with subdirectories (services/, domain/, utils/)
- [ ] Create src/infrastructure/ with subdirectories (database/, payment/, messaging/, storage/, cache/)
- [ ] Create src/config/ directory
- [ ] Create src/shared/ directory for backend-specific shared code

### 2.2 Migrate API Layer
- [ ] Create api/routes/v1/ directory structure
- [ ] Create api/routes/v1/admin/ for admin routes
- [ ] Move existing route files to new structure
- [ ] Update route imports to use new paths
- [ ] Create route aggregator in routes/index.js
- [ ] Move controllers to api/controllers/
- [ ] Separate admin controllers into admin/ subdirectory

### 2.3 Extract Business Logic Layer
- [ ] Create service classes in core/services/ for each domain
- [ ] Extract auth logic from authController to auth.service.js
- [ ] Extract group logic from groupController to group.service.js
- [ ] Extract wallet logic from walletController to wallet.service.js
- [ ] Extract transaction logic to transaction.service.js
- [ ] Create rotation.service.js for rotation calculations
- [ ] Create loan.service.js for loan management
- [ ] Update controllers to call services instead of direct database access

### 2.4 Organize Domain Models
- [ ] Create core/domain/user/ directory
- [ ] Move Users.js to domain/user/user.model.js
- [ ] Create user.repository.js for data access
- [ ] Create user.entity.js for domain logic
- [ ] Repeat for group/, wallet/, transaction/ domains
- [ ] Update all imports referencing old model locations

### 2.5 Restructure Infrastructure Layer
- [ ] Move database connection to infrastructure/database/mongodb.js
- [ ] Move migrations to infrastructure/database/migrations/
- [ ] Create infrastructure/payment/paystack.client.js
- [ ] Create infrastructure/messaging/twilio.client.js
- [ ] Create infrastructure/messaging/email.client.js
- [ ] Create interface files for each infrastructure component

### 2.6 Consolidate Configuration
- [ ] Create config/index.js as configuration aggregator
- [ ] Create config/app.config.js for application settings
- [ ] Create config/db.config.js for database settings
- [ ] Create config/security.config.js for security settings
- [ ] Create config/env.config.js with environment validation
- [ ] Update server.js to use new configuration structure

### 2.7 Organize Middlewares
- [ ] Move authMiddleware.js to api/middlewares/auth.middleware.js
- [ ] Rename adminAuth.js to api/middlewares/admin-auth.middleware.js
- [ ] Move validation.js to api/middlewares/validation.middleware.js
- [ ] Move security.js to api/middlewares/security.middleware.js
- [ ] Move errorHandler.js to api/middlewares/error.middleware.js
- [ ] Create api/middlewares/rate-limit.middleware.js

### 2.8 Setup Environment Configuration
- [ ] Create .env.development for development environment
- [ ] Create .env.staging for staging environment
- [ ] Create .env.production.template (without actual secrets)
- [ ] Update .gitignore to exclude all .env files except templates
- [ ] Implement environment validation in config/env.config.js
- [ ] Test environment loading for each environment

### 2.9 Update Backend Entry Point
- [ ] Update server.js imports to use new paths
- [ ] Verify all middleware imports resolve correctly
- [ ] Verify all route imports resolve correctly
- [ ] Test server startup with development configuration

### 2.10 Backend Testing & Verification
- [ ] Run backend server and verify it starts without errors
- [ ] Test all API endpoints to ensure functionality unchanged
- [ ] Verify database connections work correctly
- [ ] Test external service integrations (Paystack, Twilio, Email)
- [ ] Run existing test suite if available
- [ ] Check for circular dependencies using madge or similar tool

## Phase 3: Migrate Web Frontend (Week 3)

### 3.1 Create Web Package Structure
- [ ] Create packages/web/ directory
- [ ] Create src/app/ for application core
- [ ] Create src/features/ for feature-based modules
- [ ] Create src/shared/ for shared components and utilities
- [ ] Create src/config/ for configuration
- [ ] Create src/services/ for API services
- [ ] Create src/assets/ for media assets
- [ ] Create src/styles/ for global styles

### 3.2 Setup Web Build Configuration
- [ ] Copy and update package.json to packages/web/
- [ ] Copy and update vite.config.ts
- [ ] Copy and update tailwind.config.js
- [ ] Create tsconfig.json extending root config
- [ ] Create .env.development with API_BASE_URL
- [ ] Create .env.production.template

### 3.3 Migrate Authentication Feature
- [ ] Create src/features/auth/ directory structure
- [ ] Move Login.jsx to features/auth/components/LoginForm.tsx
- [ ] Move Signup component to features/auth/components/SignupForm.tsx
- [ ] Move OTPVerification.jsx to features/auth/components/OTPVerification.tsx
- [ ] Create features/auth/hooks/useAuth.ts
- [ ] Create features/auth/hooks/useOTP.ts
- [ ] Create features/auth/services/auth.service.ts
- [ ] Create features/auth/types/auth.types.ts

### 3.4 Migrate Groups Feature
- [ ] Create src/features/groups/ directory structure
- [ ] Move group components to features/groups/components/
- [ ] Create GroupList.tsx, GroupCard.tsx, GroupDetail.tsx
- [ ] Move GroupChat.jsx to features/groups/components/GroupChat.tsx
- [ ] Create features/groups/hooks/useGroups.ts
- [ ] Create features/groups/hooks/useGroupChat.ts
- [ ] Create features/groups/services/group.service.ts
- [ ] Create features/groups/types/group.types.ts

### 3.5 Migrate Wallet Feature
- [ ] Create src/features/wallet/ directory structure
- [ ] Move Wallet.jsx components to features/wallet/components/
- [ ] Create WalletBalance.tsx, TransactionHistory.tsx, FundWallet.tsx
- [ ] Create features/wallet/hooks/useWallet.ts
- [ ] Create features/wallet/services/wallet.service.ts
- [ ] Create features/wallet/types/wallet.types.ts

### 3.6 Migrate Dashboard Feature
- [ ] Create src/features/dashboard/ directory structure
- [ ] Move Dashboard.jsx to features/dashboard/components/DashboardLayout.tsx
- [ ] Create QuickStats.tsx component
- [ ] Create RecentActivity.tsx component
- [ ] Create features/dashboard/hooks/useDashboard.ts

### 3.7 Organize Shared Components
- [ ] Create src/shared/components/ui/ directory
- [ ] Move reusable UI components (Button, Input, Card, Modal) to ui/
- [ ] Create src/shared/components/layout/ directory
- [ ] Move Header, Footer, Sidebar to layout/
- [ ] Create src/shared/components/common/ directory
- [ ] Create LoadingSpinner.tsx and ErrorBoundary.tsx

### 3.8 Setup Shared Hooks
- [ ] Create src/shared/hooks/ directory
- [ ] Move useAuth.js to shared/hooks/ (if used across features)
- [ ] Move useLocalStorage.js to shared/hooks/
- [ ] Move useNetworkStatus.js to shared/hooks/
- [ ] Move useSessionTimeout.js to shared/hooks/

### 3.9 Setup API Services
- [ ] Create src/services/api.service.ts using shared ApiClient
- [ ] Configure API client with web-specific settings
- [ ] Create src/services/storage.service.ts for localStorage wrapper
- [ ] Create src/config/env.config.ts for environment variables
- [ ] Create src/config/api.config.ts for API endpoint configuration

### 3.10 Update Application Core
- [ ] Update src/app/App.tsx with new import paths
- [ ] Create src/app/router.tsx with React Router configuration
- [ ] Update src/app/main.tsx entry point
- [ ] Move assets to src/assets/ with proper organization
- [ ] Update global styles in src/styles/

### 3.11 Configure Web Deployment
- [ ] Create vercel.json for web deployment
- [ ] Configure build and output settings
- [ ] Set up SPA rewrites for client-side routing
- [ ] Document deployment process in packages/web/README.md

### 3.12 Web Testing & Verification
- [ ] Run web dev server and verify it starts correctly
- [ ] Test all routes and navigation
- [ ] Verify authentication flow works
- [ ] Test group creation and management
- [ ] Test wallet functionality
- [ ] Verify API calls to backend succeed
- [ ] Check for console errors and warnings

## Phase 4: Migrate Mobile App (Week 3-4)

### 4.1 Create Mobile Package Structure
- [ ] Create packages/mobile/ directory
- [ ] Ensure app/ directory exists for Expo Router
- [ ] Create src/features/ for feature modules
- [ ] Create src/components/ for mobile-specific components
- [ ] Create src/hooks/ for custom hooks
- [ ] Create src/services/ for API and platform services
- [ ] Create src/config/ for configuration
- [ ] Create src/utils/ for utilities
- [ ] Create src/types/ for TypeScript types
- [ ] Create src/constants/ for app constants

### 4.2 Setup Mobile Build Configuration
- [ ] Copy and update package.json to packages/mobile/
- [ ] Copy and update app.json for Expo configuration
- [ ] Copy babel.config.js
- [ ] Create tsconfig.json extending root config
- [ ] Create .env.development with API_BASE_URL
- [ ] Create .env.production.template

### 4.3 Organize Expo Router App Directory
- [ ] Organize app/(tabs)/ for tab navigation screens
- [ ] Create app/(auth)/ for authentication screens
- [ ] Create app/group-detail/[id].tsx for dynamic routing
- [ ] Create app/group-chat/[id].tsx for group chat
- [ ] Update app/_layout.tsx root layout
- [ ] Update app/index.tsx entry screen

### 4.4 Migrate Mobile Features
- [ ] Create src/features/auth/ with mobile auth components
- [ ] Create src/features/groups/ with mobile group components
- [ ] Create src/features/wallet/ with mobile wallet components
- [ ] Create src/features/profile/ with mobile profile components
- [ ] Align structure with web frontend features

### 4.5 Setup Mobile Components
- [ ] Create src/components/ui/ with base components (Button, Input, Card)
- [ ] Create src/components/common/ (LoadingScreen, ErrorScreen)
- [ ] Adapt components for touch interactions
- [ ] Ensure components follow React Native conventions

### 4.6 Setup Mobile Hooks
- [ ] Create src/hooks/useAuth.ts for authentication
- [ ] Create src/hooks/useBiometrics.ts for biometric auth
- [ ] Create src/hooks/useCamera.ts for camera access
- [ ] Create other feature-specific hooks as needed

### 4.7 Setup Mobile Services
- [ ] Create src/services/api.service.ts using shared ApiClient
- [ ] Implement token restoration from AsyncStorage
- [ ] Create src/services/storage.service.ts for AsyncStorage wrapper
- [ ] Create src/services/biometric.service.ts for local authentication
- [ ] Create src/config/env.config.ts

### 4.8 Configure EAS Build
- [ ] Create eas.json with build profiles
- [ ] Configure development profile with dev API URL
- [ ] Configure preview profile with staging API URL
- [ ] Configure production profile with production API URL
- [ ] Test EAS build locally

### 4.9 Mobile Testing & Verification
- [ ] Run mobile app on iOS simulator
- [ ] Run mobile app on Android emulator
- [ ] Test authentication flow
- [ ] Test navigation between screens
- [ ] Verify API calls to backend
- [ ] Test biometric authentication if implemented
- [ ] Test camera functionality if implemented
- [ ] Check for errors in Expo console

## Phase 5: Setup Admin Panel (Week 4)

### 5.1 Create Admin Package Structure
- [ ] Create packages/admin/ directory
- [ ] Create src/app/ for application core
- [ ] Create src/features/ for admin-specific features
- [ ] Create src/components/ for admin components
- [ ] Create src/services/ for admin API services
- [ ] Create src/config/ for configuration
- [ ] Create src/utils/ for utilities
- [ ] Create src/styles/ for admin-specific styles

### 5.2 Setup Admin Build Configuration
- [ ] Create package.json for admin package
- [ ] Create vite.config.ts
- [ ] Create tailwind.config.js
- [ ] Create tsconfig.json
- [ ] Create .env.development
- [ ] Create .env.production.template

### 5.3 Create Admin Authentication Feature
- [ ] Create src/features/auth/ directory
- [ ] Create AdminLogin.tsx component
- [ ] Create TwoFactorAuth.tsx component (if needed)
- [ ] Create useAdminAuth.ts hook
- [ ] Create admin-auth.service.ts
- [ ] Implement admin token management separate from user tokens

### 5.4 Create Admin Dashboard Feature
- [ ] Create src/features/dashboard/ directory
- [ ] Create SystemMetrics.tsx component
- [ ] Create UserGrowth.tsx component
- [ ] Create TransactionVolume.tsx component
- [ ] Create useDashboard.ts hook
- [ ] Wire up to backend admin dashboard endpoints

### 5.5 Create Admin Users Feature
- [ ] Create src/features/users/ directory
- [ ] Create UserTable.tsx with sorting and filtering
- [ ] Create UserDetail.tsx for user details
- [ ] Create UserActions.tsx for admin actions
- [ ] Create useUsers.ts hook
- [ ] Create user.service.ts for admin user operations

### 5.6 Create Admin Groups Feature
- [ ] Create src/features/groups/ directory
- [ ] Create GroupTable.tsx
- [ ] Create GroupMonitoring.tsx
- [ ] Create useGroups.ts hook
- [ ] Wire up to backend admin group endpoints

### 5.7 Create Admin Transactions Feature
- [ ] Create src/features/transactions/ directory
- [ ] Create TransactionTable.tsx
- [ ] Create TransactionDetail.tsx
- [ ] Create useTransactions.ts hook
- [ ] Wire up to backend admin transaction endpoints

### 5.8 Create Admin Analytics Feature
- [ ] Create src/features/analytics/ directory
- [ ] Create RevenueChart.tsx
- [ ] Create UserAnalytics.tsx
- [ ] Create GroupAnalytics.tsx
- [ ] Create useAnalytics.ts hook
- [ ] Integrate charting library (e.g., Chart.js, Recharts)

### 5.9 Create Admin Support Feature
- [ ] Create src/features/support/ directory
- [ ] Create TicketList.tsx
- [ ] Create TicketDetail.tsx
- [ ] Create useSupport.ts hook
- [ ] Wire up to backend support ticket endpoints

### 5.10 Create Admin Settings Feature
- [ ] Create src/features/settings/ directory
- [ ] Create SystemSettings.tsx
- [ ] Create SecuritySettings.tsx
- [ ] Create useSettings.ts hook
- [ ] Wire up to backend settings endpoints

### 5.11 Create Admin Layout Components
- [ ] Create src/components/layout/AdminLayout.tsx
- [ ] Create AdminSidebar.tsx with navigation menu
- [ ] Create AdminHeader.tsx with user menu and breadcrumbs
- [ ] Implement responsive admin layout

### 5.12 Create Admin Common Components
- [ ] Create src/components/common/DataTable.tsx with pagination
- [ ] Create ExportButton.tsx for data export
- [ ] Add sorting, filtering, and search functionality to DataTable

### 5.13 Setup Admin API Services
- [ ] Create src/services/admin-api.service.ts
- [ ] Configure with admin-specific base URL if different
- [ ] Implement admin token injection
- [ ] Create src/config/env.config.ts

### 5.14 Configure Admin Deployment
- [ ] Create vercel.json for admin deployment
- [ ] Configure separate Vercel project
- [ ] Set up custom subdomain (admin.ajosavings.vercel.app)
- [ ] Configure environment variables in Vercel
- [ ] Document deployment in packages/admin/README.md

### 5.15 Admin Testing & Verification
- [ ] Run admin dev server
- [ ] Test admin login flow
- [ ] Verify all dashboard metrics load
- [ ] Test user management operations
- [ ] Test group monitoring
- [ ] Test transaction viewing
- [ ] Test analytics charts
- [ ] Test support ticket management
- [ ] Verify all API calls succeed

## Phase 6: Finalize Shared Package (Week 4-5)

### 6.1 Define Shared TypeScript Types
- [ ] Create shared/src/types/user.types.ts
- [ ] Create shared/src/types/group.types.ts
- [ ] Create shared/src/types/wallet.types.ts
- [ ] Create shared/src/types/transaction.types.ts
- [ ] Create shared/src/types/common.types.ts
- [ ] Export all types from shared/src/types/index.ts

### 6.2 Define Shared Constants
- [ ] Create shared/src/constants/api-endpoints.ts
- [ ] Create shared/src/constants/error-codes.ts
- [ ] Create shared/src/constants/statuses.ts
- [ ] Create shared/src/constants/roles.ts
- [ ] Export all constants from shared/src/constants/index.ts

### 6.3 Create Shared Utilities
- [ ] Create shared/src/utils/formatters.ts (date, currency)
- [ ] Create shared/src/utils/validators.ts (email, phone, password)
- [ ] Create shared/src/utils/helpers.ts (common helper functions)
- [ ] Create shared/src/utils/api-client.ts (base API client class)
- [ ] Export all utilities from shared/src/utils/index.ts

### 6.4 Configure Shared Package Exports
- [ ] Update shared/package.json with proper exports field
- [ ] Configure TypeScript declaration files generation
- [ ] Set up build script if needed for shared package
- [ ] Export everything from shared/src/index.ts

### 6.5 Update Client Packages to Use Shared
- [ ] Update web package.json to depend on @ajosave/shared
- [ ] Update mobile package.json to depend on @ajosave/shared
- [ ] Update admin package.json to depend on @ajosave/shared
- [ ] Replace duplicate type definitions with shared imports
- [ ] Replace hardcoded endpoints with shared constants
- [ ] Replace duplicate utilities with shared imports

### 6.6 Verify Shared Package Usage
- [ ] Run type checking in all client packages
- [ ] Verify no duplicate type definitions exist
- [ ] Verify no hardcoded API URLs exist in clients
- [ ] Test that changes to shared package propagate correctly

## Phase 7: Documentation (Week 5)

### 7.1 Create Architecture Documentation
- [ ] Write docs/architecture/system-overview.md
- [ ] Write docs/architecture/backend-architecture.md
- [ ] Write docs/architecture/frontend-architecture.md
- [ ] Write docs/architecture/security-architecture.md
- [ ] Include diagrams where helpful

### 7.2 Create API Documentation
- [ ] Write docs/api/authentication.md
- [ ] Write docs/api/users.md
- [ ] Write docs/api/groups.md
- [ ] Write docs/api/wallets.md
- [ ] Write docs/api/transactions.md
- [ ] Write docs/api/admin.md
- [ ] Document request/response formats for all endpoints
- [ ] Include example requests and responses

### 7.3 Create Deployment Documentation
- [ ] Write docs/deployment/backend-deployment.md
- [ ] Write docs/deployment/web-deployment.md
- [ ] Write docs/deployment/mobile-deployment.md
- [ ] Write docs/deployment/admin-deployment.md
- [ ] Write docs/deployment/environment-setup.md
- [ ] Include step-by-step instructions
- [ ] Document troubleshooting common issues

### 7.4 Create Feature Documentation
- [ ] Write docs/features/group-savings.md
- [ ] Write docs/features/rotation-system.md
- [ ] Write docs/features/emergency-loans.md
- [ ] Write docs/features/punishment-system.md
- [ ] Document business rules and user flows

### 7.5 Create Security Documentation
- [ ] Write docs/security/authentication.md
- [ ] Write docs/security/authorization.md
- [ ] Write docs/security/data-protection.md
- [ ] Write docs/security/compliance.md
- [ ] Document security best practices
- [ ] Document secret rotation procedures

### 7.6 Update Package README Files
- [ ] Write comprehensive packages/backend/README.md
- [ ] Write comprehensive packages/web/README.md
- [ ] Write comprehensive packages/mobile/README.md
- [ ] Write comprehensive packages/admin/README.md
- [ ] Write comprehensive packages/shared/README.md
- [ ] Include installation, configuration, development, testing sections

### 7.7 Create Root Documentation
- [ ] Update root README.md with project overview
- [ ] Document monorepo structure
- [ ] Create CONTRIBUTING.md with contribution guidelines
- [ ] Create docs/migration-guide.md documenting the restructuring

### 7.8 Consolidate Existing Documentation
- [ ] Move "Ajosave docs/" contents to docs/features/
- [ ] Move backend/docs/ contents to docs/api/ or docs/architecture/
- [ ] Ensure no duplicate documentation exists
- [ ] Update all documentation links

## Phase 8: Testing & Validation (Week 5)

### 8.1 Backend Testing
- [ ] Write unit tests for new service layer
- [ ] Write integration tests for API routes
- [ ] Write property-based tests for calculations
- [ ] Achieve minimum 80% code coverage
- [ ] Run all tests and ensure they pass

### 8.2 Web Frontend Testing
- [ ] Write component tests for shared UI components
- [ ] Write integration tests for feature modules
- [ ] Test complete user flows (auth, groups, wallet)
- [ ] Run all tests and ensure they pass

### 8.3 Mobile App Testing
- [ ] Write unit tests for services and utilities
- [ ] Write component tests for UI components
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test critical flows on real devices if possible

### 8.4 Admin Panel Testing
- [ ] Write component tests for admin components
- [ ] Test complete admin workflows
- [ ] Verify all admin operations work correctly
- [ ] Run all tests and ensure they pass

### 8.5 Integration Testing
- [ ] Test complete end-to-end flows across all platforms
- [ ] Verify web client works with backend
- [ ] Verify mobile client works with backend
- [ ] Verify admin client works with backend
- [ ] Test authentication across all platforms
- [ ] Test data consistency across platforms

### 8.6 Security Testing
- [ ] Verify no secrets committed to git
- [ ] Test CORS configuration with all clients
- [ ] Test rate limiting works correctly
- [ ] Test authentication token validation
- [ ] Test authorization checks
- [ ] Verify input validation on all endpoints

### 8.7 Performance Testing
- [ ] Test backend response times
- [ ] Test web app load times
- [ ] Test mobile app performance
- [ ] Verify database queries are optimized
- [ ] Check bundle sizes for all clients

### 8.8 Dependency Verification
- [ ] Run dependency audit in all packages
- [ ] Check for circular dependencies
- [ ] Verify all imports resolve correctly
- [ ] Test workspace linking works

## Phase 9: Deployment (Week 5-6)

### 9.1 Deploy Backend
- [ ] Set up production Vercel project for backend
- [ ] Configure environment variables in Vercel
- [ ] Deploy backend to production
- [ ] Verify backend health endpoint responds
- [ ] Test API endpoints in production
- [ ] Monitor for errors

### 9.2 Deploy Web Frontend
- [ ] Set up production Vercel project for web
- [ ] Configure environment variables (production API URL)
- [ ] Deploy web frontend to production
- [ ] Test web app in production
- [ ] Verify authentication works
- [ ] Monitor for errors

### 9.3 Deploy Admin Panel
- [ ] Set up separate Vercel project for admin
- [ ] Configure custom subdomain (admin.ajosavings.vercel.app)
- [ ] Configure environment variables
- [ ] Deploy admin panel to production
- [ ] Test admin panel in production
- [ ] Verify admin authentication works

### 9.4 Deploy Mobile App
- [ ] Configure EAS production build
- [ ] Build production Android APK/AAB
- [ ] Build production iOS IPA
- [ ] Test production builds on real devices
- [ ] Submit to Google Play Store (if ready)
- [ ] Submit to Apple App Store (if ready)

### 9.5 Update CORS Configuration
- [ ] Add production web URL to backend CORS whitelist
- [ ] Add production admin URL to backend CORS whitelist
- [ ] Test CORS from production clients
- [ ] Verify credentials are properly handled

### 9.6 Monitor Production
- [ ] Set up error monitoring (Sentry or similar)
- [ ] Set up performance monitoring
- [ ] Monitor server logs for issues
- [ ] Monitor client error rates
- [ ] Set up alerts for critical errors

## Phase 10: Cleanup & Finalization (Week 6)

### 10.1 Remove Old Structure
- [ ] Verify all functionality works in new structure
- [ ] Create backup of old structure
- [ ] Delete old frontend/ directory (if exists)
- [ ] Delete old backend/ directory (if at root level)
- [ ] Delete old admin/ directory (if minimal/empty)
- [ ] Delete old mobile/ directory (if at root level)

### 10.2 Update Git Configuration
- [ ] Update .gitignore if needed
- [ ] Remove any old ignored paths no longer relevant
- [ ] Commit final structure changes
- [ ] Tag release version

### 10.3 Update CI/CD Pipelines
- [ ] Update any CI/CD configurations for new structure
- [ ] Test automated deployments
- [ ] Verify all deployment pipelines work

### 10.4 Team Onboarding
- [ ] Create onboarding document for new structure
- [ ] Document common development workflows
- [ ] Train team on new structure
- [ ] Update development guides

### 10.5 Final Verification
- [ ] Run full test suite across all packages
- [ ] Verify all deployments are successful
- [ ] Check production systems for stability
- [ ] Verify documentation is complete and accurate
- [ ] Conduct final code review

### 10.6 Post-Migration Monitoring
- [ ] Monitor production for 1 week after migration
- [ ] Address any issues that arise
- [ ] Collect team feedback on new structure
- [ ] Document lessons learned
- [ ] Plan any follow-up improvements
