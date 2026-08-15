# Requirements Document: Ajosave Project Restructuring

## 1. Monorepo Infrastructure Requirements

### 1.1 Directory Structure Organization
The project MUST be restructured into a monorepo format with a packages/ directory containing backend, web, mobile, admin, and shared subdirectories, where each package maintains its own package.json and can be developed independently.

### 1.2 Workspace Configuration
The root package.json MUST configure npm/yarn workspaces to enable shared dependency management and allow cross-package imports using @ajosave/* namespace.

### 1.3 Root-Level Configuration
The project MUST have root-level config/ directory containing shared ESLint, TypeScript, and environment variable templates that can be extended by individual packages.

### 1.4 Centralized Documentation
All project documentation MUST be consolidated into a docs/ directory organized by category (api/, architecture/, deployment/, features/, security/) with no duplicate documentation across packages.

### 1.5 Cross-Project Scripts
The project MUST provide root-level scripts/ directory containing setup, deployment, and migration automation scripts that can operate across all packages.

## 2. Backend Package Requirements

### 2.1 Layered Architecture
The backend MUST organize code into three distinct layers: API layer (routes, controllers, middlewares), Core layer (services, domain models, business logic), and Infrastructure layer (database, external services, caching).

### 2.2 API Versioning
All backend routes MUST be organized under versioned directories (e.g., api/routes/v1/) to support future API evolution without breaking existing clients.

### 2.3 Admin Route Separation
Admin-specific routes MUST be organized in a separate admin/ subdirectory under routes to clearly distinguish administrative endpoints from user-facing endpoints.

### 2.4 Domain-Driven Structure
The core/domain/ directory MUST organize code by business domain (user/, group/, wallet/, transaction/) where each domain contains model, repository, and entity files.

### 2.5 Service Layer Extraction
Business logic MUST be extracted from controllers into dedicated service classes in core/services/ to enable reusability and testability.

### 2.6 Configuration Consolidation
All configuration logic MUST be consolidated into src/config/ directory with separate files for app, database, security, and environment settings.

### 2.7 Environment-Specific Configuration
The backend MUST support separate .env files for development, staging, and production environments, with a validation mechanism that checks for required variables on startup.

### 2.8 Infrastructure Abstraction
External service integrations (payment, messaging, storage, cache) MUST be abstracted behind interfaces in infrastructure/ directory to enable easy provider switching.

### 2.9 Migration Scripts Organization
Database migration scripts MUST be organized in a dedicated migrations/ directory within infrastructure/database/ with sequential numbering and rollback capabilities.

### 2.10 Shared Constants
Application constants (error codes, roles, statuses) MUST be defined in src/shared/constants/ to ensure consistency across the backend codebase.

## 3. Web Frontend Package Requirements

### 3.1 Feature-Based Organization
The web application MUST organize code by feature in src/features/ directory where each feature contains its own components, hooks, services, store, and types subdirectories.

### 3.2 Shared Component Library
Common UI components (buttons, inputs, cards, modals) MUST be organized in src/shared/components/ui/ and reused across all features to ensure UI consistency.

### 3.3 Layout Components
Layout components (Header, Footer, Sidebar) MUST be separated into src/shared/components/layout/ and composed to create page layouts.

### 3.4 Custom Hooks Organization
Shared React hooks (useLocalStorage, useNetworkStatus, useSessionTimeout) MUST be organized in src/shared/hooks/ for reuse across features.

### 3.5 API Service Abstraction
API communication MUST be abstracted through a base API client in src/services/ that handles authentication, error handling, and request configuration.

### 3.6 Environment Configuration
The web application MUST load environment-specific configuration from .env files using Vite's import.meta.env, with separate files for development and production.

### 3.7 Type Safety
All feature-specific TypeScript types MUST be defined within each feature's types/ subdirectory to maintain clear boundaries and type safety.

### 3.8 Asset Organization
Static assets (images, icons, fonts) MUST be organized in src/assets/ with subdirectories by type for easy management and optimization.

## 4. Mobile Package Requirements

### 4.1 Expo Router Structure
The mobile application MUST use Expo Router with app/ directory structure, organizing screens into route groups ((tabs)/, (auth)/) for clear navigation hierarchy.

### 4.2 Feature Alignment
The mobile app MUST follow the same feature-based organization as the web frontend (src/features/) to maintain consistency across platforms.

### 4.3 Platform-Specific Components
Mobile-specific UI components MUST be organized in src/components/ and adapted for touch interactions and native platform conventions.

### 4.4 Native Feature Integration
Device-specific features (camera, biometrics, local authentication) MUST be abstracted in src/services/ to isolate Expo API dependencies.

### 4.5 Secure Storage
The mobile app MUST use secure storage mechanisms (AsyncStorage for non-sensitive data, SecureStore for tokens) abstracted in src/services/storage.service.ts.

### 4.6 EAS Configuration
The mobile app MUST configure Expo Application Services (EAS) with separate build profiles for development, preview, and production in eas.json.

### 4.7 API Client Consistency
The mobile app MUST use the same API client structure as web, sharing the base client from @ajosave/shared package but with mobile-specific token restoration logic.

## 5. Admin Package Requirements

### 5.1 Independent Package
The admin panel MUST be a separate package in packages/admin/ with its own build configuration, deployment settings, and dependencies.

### 5.2 Admin-Specific Features
The admin application MUST organize features (dashboard/, users/, groups/, transactions/, analytics/, support/, settings/) with admin-specific concerns.

### 5.3 Admin Layout
The admin panel MUST have a dedicated AdminLayout component with sidebar navigation, header with user info, and breadcrumbs for deep navigation.

### 5.4 Data Tables
The admin panel MUST provide reusable DataTable component in src/components/common/ with sorting, filtering, pagination, and export capabilities.

### 5.5 Admin Authentication
Admin authentication MUST be handled separately from user authentication with dedicated login flow and potentially two-factor authentication support.

### 5.6 Permission Management
The admin panel MUST implement role-based UI rendering where certain features are only visible to users with appropriate permissions.

### 5.7 Separate Deployment
The admin panel MUST be deployable independently to a separate subdomain (e.g., admin.ajosavings.vercel.app) with its own Vercel configuration.

## 6. Shared Package Requirements

### 6.1 TypeScript Type Definitions
The shared package MUST export TypeScript type definitions (User, Group, Wallet, Transaction, etc.) used by all client applications to ensure type consistency.

### 6.2 API Endpoint Constants
All API endpoint paths MUST be defined as constants in shared/src/constants/api-endpoints.ts and imported by clients to prevent hardcoded URLs.

### 6.3 Error Code Constants
Standardized error codes MUST be defined in shared/src/constants/error-codes.ts for consistent error handling across all applications.

### 6.4 Shared Utilities
Common utility functions (formatters, validators, helpers) MUST be defined in shared/src/utils/ and reused across all client applications.

### 6.5 Base API Client
The shared package MUST provide a base ApiClient class that handles token management, request configuration, and error handling for all platforms.

### 6.6 Package Exports
The shared package MUST configure proper exports in package.json to allow selective importing of types, constants, and utilities by other packages.

## 7. Security Requirements

### 7.1 Environment Variable Isolation
Each environment (development, staging, production) MUST have completely isolated environment variable files with no cross-contamination of secrets.

### 7.2 Git Ignore Configuration
All .env files containing secrets MUST be gitignored at both root and package levels, with only .env.template or .env.example files committed.

### 7.3 Secret Validation
The backend MUST validate presence of all required environment variables on startup and fail fast with clear error messages if any are missing.

### 7.4 CORS Configuration
The backend MUST configure CORS to allow requests only from whitelisted origins specific to each environment, with pattern matching for preview deployments.

### 7.5 Token Security
Authentication tokens MUST be stored securely: httpOnly cookies for web applications, and secure storage (SecureStore) for mobile applications.

### 7.6 Rate Limiting
The backend MUST implement rate limiting middleware with configurable limits per endpoint type (stricter for auth, relaxed for reads).

### 7.7 Input Validation
All API endpoints MUST validate request parameters using express-validator or similar, rejecting malformed inputs before processing.

### 7.8 Security Headers
The backend MUST apply security headers (Helmet middleware) including CSP, HSTS, X-Frame-Options, and X-Content-Type-Options.

### 7.9 Audit Logging
All administrative actions MUST be logged to an audit trail with timestamp, actor, action, and affected resources for security monitoring.

### 7.10 Secret Rotation
The system MUST support secret rotation with documented procedures for rotating JWT secrets, API keys, and database credentials.

## 8. API Client Requirements

### 8.1 Base Client Implementation
All client applications MUST use a shared ApiClient base class that provides get(), post(), put(), delete() methods with consistent request/response handling.

### 8.2 Token Management
The ApiClient MUST provide setToken() and clearToken() methods to manage authentication state across all requests.

### 8.3 Automatic Token Injection
The ApiClient MUST automatically inject the authentication token into the Authorization header for all requests when a token is set.

### 8.4 Credential Inclusion
The ApiClient MUST include credentials in all requests (credentials: 'include') to support cookie-based authentication.

### 8.5 Error Handling
The ApiClient MUST throw structured errors with status code, error code, and message for consistent error handling across all clients.

### 8.6 Platform-Specific Initialization
Each platform (web, mobile, admin) MUST instantiate the ApiClient with platform-specific configuration (base URL, timeout, headers).

### 8.7 Mobile Token Restoration
The mobile API client MUST restore the authentication token from secure storage on app launch to maintain logged-in state.

## 9. Deployment Requirements

### 9.1 Independent Deployments
Each package (backend, web, mobile, admin) MUST be deployable independently without requiring simultaneous deployment of other packages.

### 9.2 Backend Vercel Configuration
The backend MUST configure Vercel with serverless function entry point, environment variables, and proper routing to api/index.js.

### 9.3 Web Vercel Configuration
The web frontend MUST configure Vercel with Vite build settings, SPA rewrites, and environment-specific variables.

### 9.4 Admin Separate Deployment
The admin panel MUST deploy to a separate Vercel project with distinct domain/subdomain and isolated environment variables.

### 9.5 Mobile EAS Configuration
The mobile app MUST configure EAS with separate build profiles (development, preview, production) specifying API URLs for each environment.

### 9.6 Environment Variable Management
Each deployment environment MUST manage environment variables through the deployment platform (Vercel Environment Variables, EAS Secrets).

### 9.7 Build Scripts
Each package MUST provide standardized npm scripts (dev, build, test, lint) for consistent development and deployment workflows.

### 9.8 Deployment Documentation
Each package MUST include deployment instructions in its README.md covering environment setup, build process, and deployment commands.

## 10. Testing Requirements

### 10.1 Backend Unit Tests
The backend MUST achieve minimum 80% code coverage with unit tests for services, utilities, and business logic using Jest or similar.

### 10.2 Backend Integration Tests
The backend MUST provide integration tests for API routes testing complete request/response cycles with test database.

### 10.3 Backend Property Tests
The backend MUST use property-based testing (fast-check) for testing invariants in rotation calculations, penalty calculations, and transaction consistency.

### 10.4 Frontend Component Tests
Web and admin applications MUST provide component tests for UI components using React Testing Library, mocking API responses.

### 10.5 Frontend Integration Tests
Web and admin applications MUST provide integration tests for complete user flows (login, create group, make transaction) with mocked backend.

### 10.6 Mobile Unit Tests
The mobile application MUST provide unit tests for business logic, utilities, and non-UI code with appropriate mocks for native modules.

### 10.7 Mobile Component Tests
The mobile application MUST provide component tests for React Native components using React Native Testing Library.

### 10.8 E2E Testing
Critical user flows (authentication, payment, group creation) MUST be covered by end-to-end tests on real devices or emulators.

### 10.9 Test Organization
Each package MUST organize tests in a tests/ directory with subdirectories for unit/, integration/, and e2e/ tests.

## 11. Performance Requirements

### 11.1 Database Indexing
The backend MUST create database indexes on frequently queried fields (userId, groupId, email) to optimize query performance.

### 11.2 Response Pagination
API endpoints returning lists MUST support pagination with configurable page size to prevent large payload transfers.

### 11.3 Code Splitting
Web and admin applications MUST implement code splitting with lazy-loaded routes to reduce initial bundle size.

### 11.4 Asset Optimization
All client applications MUST optimize images (WebP format, responsive sizes) and use lazy loading for below-the-fold images.

### 11.5 Mobile Bundle Optimization
The mobile application MUST minimize bundle size by removing unused dependencies and using Hermes JavaScript engine.

### 11.6 Caching Strategy
The backend MUST implement caching for frequently accessed data (user profiles, group metadata) with appropriate invalidation logic.

### 11.7 Compression
The backend MUST enable response compression for all text-based responses (JSON, HTML, CSS, JavaScript).

## 12. Documentation Requirements

### 12.1 Architecture Documentation
The docs/architecture/ directory MUST contain comprehensive documentation of system architecture, backend design, frontend design, and security architecture.

### 12.2 API Documentation
The docs/api/ directory MUST document all API endpoints with request/response formats, authentication requirements, and example usage.

### 12.3 Deployment Documentation
The docs/deployment/ directory MUST provide step-by-step deployment guides for each package including environment setup and troubleshooting.

### 12.4 Feature Documentation
The docs/features/ directory MUST document business features (group savings, rotation system, loans, punishments) with specifications and user flows.

### 12.5 Security Documentation
The docs/security/ directory MUST document authentication mechanisms, authorization patterns, data protection strategies, and compliance considerations.

### 12.6 Package README Files
Each package MUST have a comprehensive README.md covering purpose, installation, configuration, development workflow, and testing.

### 12.7 Migration Guide
The project MUST provide a migration guide documenting the step-by-step process to transition from current structure to new structure.

## 13. Migration Requirements

### 13.1 Phased Migration
The migration MUST be executed in phases: (1) Infrastructure setup, (2) Backend migration, (3) Web migration, (4) Mobile migration, (5) Admin setup, (6) Documentation & cleanup.

### 13.2 Zero Downtime
The migration MUST ensure zero downtime for production services by maintaining the old structure until the new structure is fully tested and deployed.

### 13.3 Import Path Updates
The migration MUST systematically update all import paths throughout the codebase to reflect new directory structure and eliminate broken imports.

### 13.4 Test Verification
Each migration phase MUST be followed by comprehensive testing to verify that functionality remains intact after restructuring.

### 13.5 Rollback Plan
The migration MUST have a documented rollback plan for each phase in case critical issues are discovered after restructuring.

### 13.6 Old Structure Removal
The old directory structure MUST be completely removed only after all packages are migrated, tested, and deployed successfully.

## 14. Code Quality Requirements

### 14.1 Linting Configuration
The project MUST configure ESLint with consistent rules shared across all packages, with package-specific overrides where necessary.

### 14.2 Code Formatting
The project MUST use Prettier for consistent code formatting across all packages with shared configuration.

### 14.3 Type Safety
TypeScript MUST be used in all new code with strict mode enabled to catch type errors at compile time.

### 14.4 Pre-commit Hooks
The project MUST configure pre-commit hooks to run linting and type checking before allowing commits.

### 14.5 Code Reviews
All code changes MUST go through code review process before merging to ensure adherence to structure and standards.

### 14.6 Dependency Management
Each package MUST keep dependencies up to date and remove unused dependencies to minimize bundle size and security vulnerabilities.

### 14.7 No Circular Dependencies
The codebase MUST maintain zero circular dependencies, enforced by automated checks in build process.
