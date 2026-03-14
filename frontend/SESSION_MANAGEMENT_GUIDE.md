# AjoSave Session Management & Home Page Guide

## Overview
This document outlines the enhanced session management and home page implementation for AjoSave.

## Session Management Features

### 1. Authentication Context (`AuthContext.jsx`)
- **Persistent Sessions**: Uses httpOnly cookies for secure session storage
- **Auto-initialization**: Checks for existing sessions on app load
- **OTP Support**: Handles two-factor authentication flow
- **Error Handling**: Comprehensive error handling with user feedback

### 2. Route Protection
- **ProtectedRoute**: Redirects unauthenticated users to login
- **PublicRoute**: Redirects authenticated users to dashboard
- **Loading States**: Shows loading spinners during authentication checks

### 3. Session Timeout Management (`useSessionTimeout.js`)
- **Automatic Timeout**: 30-minute session timeout with 5-minute warning
- **Activity Tracking**: Resets timer on user activity
- **Session Extension**: Allows users to extend their session
- **Visual Warning**: Modal popup before session expires

### 4. Network Status Monitoring (`useNetworkStatus.js`)
- **Online/Offline Detection**: Monitors network connectivity
- **Connection Quality**: Detects slow connections
- **Visual Indicators**: Shows network status banners

### 5. Progressive Web App (PWA) Support
- **Service Worker**: Caches static assets for offline use
- **Manifest**: Enables "Add to Home Screen" functionality
- **Offline Support**: Basic offline functionality for cached pages

## Home Page Features

### 1. Enhanced Design
- **Hero Section**: Prominent logo and value proposition
- **Feature Cards**: Highlighted benefits with statistics
- **Testimonials**: Social proof from users
- **Call-to-Action**: Clear path to registration
- **Statistics**: Trust indicators (users, savings, etc.)

### 2. Session-Aware Behavior
- **Welcome Back**: Shows personalized message for returning users
- **Auto-redirect**: Authenticated users go directly to dashboard
- **Loading States**: Smooth loading experience

### 3. Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Progressive Enhancement**: Works on all screen sizes
- **Touch-friendly**: Large buttons and touch targets

## Security Features

### 1. HTTP Security Headers
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Basic XSS protection

### 2. Session Security
- **HttpOnly Cookies**: Prevents XSS attacks on session tokens
- **Automatic Logout**: Logs out inactive users
- **CSRF Protection**: Built into the API layer

## Usage Instructions

### For Developers

1. **Session Management**:
   ```jsx
   const { user, isAuthenticated, login, logout } = useAuth();
   ```

2. **Session Timeout**:
   ```jsx
   const sessionTimeout = useSessionTimeout(30, 5); // 30min timeout, 5min warning
   ```

3. **Network Status**:
   ```jsx
   const { isOnline, isSlowConnection } = useNetworkStatus();
   ```

### For Users

1. **First Visit**: Users see the enhanced home page with features and testimonials
2. **Returning Users**: Authenticated users see a welcome message and are redirected to dashboard
3. **Session Warnings**: Users get a 5-minute warning before session expires
4. **Offline Support**: Basic functionality works offline with cached content

## File Structure

```
frontend/src/
├── components/
│   ├── common/
│   │   ├── SessionTimeoutWarning.jsx
│   │   └── NetworkStatus.jsx
│   └── layout/
│       ├── Header.jsx (enhanced with user menu)
│       └── Layout.jsx
├── hooks/
│   ├── useSessionTimeout.js
│   └── useNetworkStatus.js
├── pages/
│   └── Home.jsx (enhanced design)
├── context/
│   └── AuthContext.jsx (existing, robust)
└── App.jsx (integrated session management)

frontend/public/
├── sw.js (service worker)
└── manifest.json (PWA manifest)
```

## Configuration

### Session Timeout
- Default: 30 minutes with 5-minute warning
- Configurable in `AppContent` component
- Tracks user activity to reset timer

### Network Monitoring
- Automatically detects online/offline status
- Shows warnings for slow connections
- Handles connection type detection

### PWA Settings
- Installable on mobile devices
- Offline support for cached content
- Custom theme colors and icons

## Best Practices

1. **Always check authentication status** before making API calls
2. **Handle loading states** to improve user experience
3. **Provide feedback** for network issues and session timeouts
4. **Test offline functionality** to ensure graceful degradation
5. **Monitor session activity** to prevent unexpected logouts

## Troubleshooting

### Common Issues

1. **Session not persisting**: Check if cookies are enabled
2. **Timeout warnings not showing**: Verify user activity tracking
3. **Offline mode not working**: Check service worker registration
4. **PWA not installable**: Verify manifest.json and HTTPS

### Debug Tools

- Browser DevTools → Application → Service Workers
- Browser DevTools → Network → Offline simulation
- Browser DevTools → Application → Storage (cookies)
- Console logs for authentication flow

## Future Enhancements

1. **Biometric Authentication**: Fingerprint/Face ID support
2. **Advanced Offline Sync**: Queue actions when offline
3. **Push Notifications**: Session expiry and security alerts
4. **Multi-device Sessions**: Manage sessions across devices
5. **Session Analytics**: Track user engagement patterns