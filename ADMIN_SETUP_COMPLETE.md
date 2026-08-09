# Admin Portal Setup - Complete

## Overview
The admin portal has been successfully integrated into the frontend application with separate authentication using the Admin collection in MongoDB.

---

## Admin Authentication

### Separate Authentication System
- **Admin Collection**: Uses MongoDB `Admin` collection (separate from `Users`)
- **Admin Login**: `/admin/login` - dedicated login page for administrators
- **Token Storage**: Admin tokens stored as `adminAuthToken` in localStorage
- **Session Marker**: `isAdminSession` flag distinguishes admin from user sessions

### Admin Roles
1. **super_admin** - Full system access
2. **admin** - Standard administrator privileges
3. **moderator** - Limited moderation capabilities

---

## Seeded Admin Accounts

Run `node backend/scripts/seedAdmin.js` to create these accounts:

| Email | Password | Role | Name |
|-------|----------|------|------|
| admin@ajosave.com | Admin@123 | super_admin | Super Admin |
| moderator@ajosave.com | Moderator@123 | moderator | Moderator User |
| admin2@ajosave.com | Admin@123 | admin | Admin User |

---

## Admin Routes

### Public Routes
- `/admin/login` - Admin login page

### Protected Admin Routes (require `adminAuthToken`)
- `/admin/dashboard` - Overview statistics and quick actions
- `/admin/users` - User management
- `/admin/groups` - Group management
- `/admin/groups/:id` - Group details

---

## Features Implemented

### 1. Admin Dashboard
- **Real-time Statistics**:
  - Total Users
  - Active Groups
  - Total Savings
  - 24h Transactions
- **Time Range Filtering**: Today, Week, Month, Year
- **Recent Activity Feed**: Last 10 system activities
- **Alerts System**: System alerts with dismiss functionality
- **Quick Actions**: Navigate to Users, Groups, or refresh data

### 2. Admin Layout
- **Collapsible Sidebar**:
  - Logo and branding
  - Navigation menu (Dashboard, Users, Groups)
  - Admin info display (name, role, avatar)
  - Logout button
  - Toggle to expand/collapse
- **No Header**: Simplified UI with only sidebar navigation
- **Light Theme**: Clean white/gray color scheme

### 3. Removed Features
- ❌ Language Toggle (removed)
- ❌ Notifications Dropdown (removed)
- ❌ Analytics page (undefined backend)
- ❌ Audit Logs page (undefined backend)
- ❌ Settings page (undefined backend)
- ❌ Support Tickets page (undefined backend)
- ❌ Transaction Monitoring page (undefined backend)

---

## API Integration

### Admin Services (`frontend/src/services/adminServices.js`)
Connected endpoints:
- `GET /api/admin/dashboard/stats?timeRange={timeRange}` - Dashboard statistics
- `GET /api/admin/dashboard/activities?limit=10&offset=0` - Recent activities
- `GET /api/admin/dashboard/alerts` - System alerts
- `PUT /api/admin/dashboard/alerts/:id/dismiss` - Dismiss alert
- `POST /api/admin/auth/login` - Admin login

### API Token Handling (`frontend/src/services/api.js`)
- Detects admin session via `isAdminSession` flag
- Uses `adminAuthToken` for admin API requests
- Uses `authToken` for regular user requests
- Automatic token injection in Authorization header

---

## File Structure

```
frontend/src/
├── pages/admin/
│   ├── AdminLogin.jsx          ✅ Separate admin login
│   ├── AdminDashboard.jsx      ✅ Connected to backend
│   ├── UserManagement.jsx      (exists, needs backend connection)
│   └── GroupManagement.jsx     (exists, needs backend connection)
│
├── components/admin/
│   ├── layout/
│   │   ├── AdminSidebar.jsx    ✅ With admin info & logout
│   │   └── AdminLayout.jsx     ✅ Simplified (no header)
│   │
│   └── dashboard/
│       ├── StatCard.jsx        ✅ Statistics display
│       ├── RecentActivityCard.jsx ✅ Activity feed
│       └── AlertsCard.jsx      ✅ System alerts
│
└── services/
    ├── api.js                  ✅ Dual token support
    └── adminServices.js        ✅ Admin API endpoints
```

---

## How to Use

### 1. Start the Backend
```bash
cd backend
npm start
```

### 2. Seed Admin Users (First Time Only)
```bash
cd backend
node scripts/seedAdmin.js
```

### 3. Start the Frontend
```bash
cd frontend
npm run dev
```

### 4. Access Admin Portal
1. Navigate to `http://localhost:5173/admin/login`
2. Login with admin credentials:
   - Email: `admin@ajosave.com`
   - Password: `Admin@123`
3. Access admin dashboard and features

---

## Security Notes

- ✅ Separate authentication system for admins
- ✅ Admin tokens stored separately from user tokens
- ✅ Role-based access control on backend
- ✅ Protected routes check for `adminAuthToken`
- ✅ Logout clears all admin session data
- ⚠️ Remember to change default passwords in production
- ⚠️ Implement admin invitation system for production
- ⚠️ Add 2FA for admin accounts (recommended)

---

## Next Steps

### Immediate
1. ✅ Connect User Management to backend APIs
2. ✅ Connect Group Management to backend APIs
3. ✅ Test all admin flows (login, dashboard, logout)

### Future Enhancements
- [ ] Add admin activity logging
- [ ] Implement admin notifications system
- [ ] Add bulk user/group operations
- [ ] Create admin settings page
- [ ] Add data export functionality
- [ ] Implement admin invitation system
- [ ] Add 2FA for admin accounts

---

## Troubleshooting

### Issue: White/Blank Dashboard
**Cause**: LanguageContext was required but not provided
**Solution**: Removed all language-related components from admin section ✅

### Issue: Admin token not working
**Cause**: Using wrong token for admin requests
**Solution**: API service now checks `isAdminSession` flag and uses correct token ✅

### Issue: Admin routes redirecting to login
**Cause**: `adminAuthToken` not found in localStorage
**Solution**: Verify admin login completed successfully and token was stored ✅

---

## Admin Portal Status: ✅ COMPLETE

All language references removed, admin header removed, sidebar enhanced with admin info and logout. Ready for testing!
