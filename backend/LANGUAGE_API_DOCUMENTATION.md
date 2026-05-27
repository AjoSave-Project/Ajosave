# Language Preference API Documentation

## Overview
This API provides endpoints for managing user language preferences in the AjoSave application. Users can select from multiple Nigerian languages (English, Igbo, Yoruba, Hausa) and manage their overall preferences.

## Base URL
```
Production: https://your-domain.com/api/language
Development: http://localhost:5000/api/language
```

## Supported Languages
- **English (en)** - Default language
- **Nigerian Pidgin (pcm)** - Nigerian Pidgin English
- **Igbo (ig)** - Nigerian language
- **Yoruba (yo)** - Nigerian language  
- **Hausa (ha)** - Nigerian language

---

## Endpoints

### 1. Get Supported Languages
Get a list of all supported languages in the application.

**Endpoint:** `GET /api/language/supported`  
**Authentication:** Not required (Public)

#### Response
```json
{
  "success": true,
  "message": "Supported languages retrieved successfully",
  "data": {
    "languages": [
      {
        "code": "en",
        "name": "English",
        "nativeName": "English",
        "flag": "🇬🇧"
      },
      {
        "code": "pcm",
        "name": "Nigerian Pidgin",
        "nativeName": "Naija",
        "flag": "🇳🇬"
      },
      {
        "code": "ig",
        "name": "Igbo",
        "nativeName": "Igbo",
        "flag": "🇳🇬"
      },
      {
        "code": "yo",
        "name": "Yoruba",
        "nativeName": "Yorùbá",
        "flag": "🇳🇬"
      },
      {
        "code": "ha",
        "name": "Hausa",
        "nativeName": "Hausa",
        "flag": "🇳🇬"
      }
    ]
  }
}
```

---

### 2. Get User Language Preference
Get the current language preference for the authenticated user.

**Endpoint:** `GET /api/language/preference`  
**Authentication:** Required (Bearer Token)

#### Headers
```
Authorization: Bearer <your_jwt_token>
```

#### Response
```json
{
  "success": true,
  "message": "Language preference retrieved successfully",
  "data": {
    "language": "en"
  }
}
```

#### Error Responses
- **401 Unauthorized** - Missing or invalid authentication token
- **404 Not Found** - User not found
- **500 Internal Server Error** - Server error

---

### 3. Update User Language Preference
Update the language preference for the authenticated user.

**Endpoint:** `PUT /api/language/preference`  
**Authentication:** Required (Bearer Token)

#### Headers
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

#### Request Body
```json
{
  "language": "yo"
}
```

#### Response
```json
{
  "success": true,
  "message": "Language preference updated successfully",
  "data": {
    "language": "yo",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

#### Error Responses
- **400 Bad Request** - Invalid language code
  ```json
  {
    "success": false,
    "message": "Invalid language code. Supported languages: en, pcm, ig, yo, ha"
  }
  ```
- **401 Unauthorized** - Missing or invalid authentication token
- **404 Not Found** - User not found
- **500 Internal Server Error** - Server error

---

### 4. Get All User Preferences
Get all preferences for the authenticated user (language, currency, notifications, privacy).

**Endpoint:** `GET /api/language/preferences/all`  
**Authentication:** Required (Bearer Token)

#### Headers
```
Authorization: Bearer <your_jwt_token>
```

#### Response
```json
{
  "success": true,
  "message": "User preferences retrieved successfully",
  "data": {
    "preferences": {
      "language": "en",
      "currency": "NGN",
      "notifications": {
        "email": true,
        "sms": true,
        "push": true,
        "marketing": false
      },
      "privacy": {
        "profileVisibility": "friends",
        "allowFriendRequests": true
      }
    }
  }
}
```

#### Error Responses
- **401 Unauthorized** - Missing or invalid authentication token
- **404 Not Found** - User not found
- **500 Internal Server Error** - Server error

---

### 5. Update Multiple Preferences (Bulk Update)
Update multiple user preferences at once including language, currency, notifications, and privacy settings.

**Endpoint:** `PUT /api/language/preferences/bulk`  
**Authentication:** Required (Bearer Token)

#### Headers
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

#### Request Body
All fields are optional. Only include the fields you want to update.

```json
{
  "language": "ig",
  "currency": "NGN",
  "notifications": {
    "email": true,
    "sms": false,
    "push": true,
    "marketing": false
  },
  "privacy": {
    "profileVisibility": "private",
    "allowFriendRequests": false
  }
}
```

#### Field Validations
- **language**: Must be one of: `en`, `pcm`, `ig`, `yo`, `ha`
- **currency**: Must be one of: `NGN`, `USD`
- **notifications.email**: Boolean
- **notifications.sms**: Boolean
- **notifications.push**: Boolean
- **notifications.marketing**: Boolean
- **privacy.profileVisibility**: Must be one of: `public`, `friends`, `private`
- **privacy.allowFriendRequests**: Boolean

#### Response
```json
{
  "success": true,
  "message": "User preferences updated successfully",
  "data": {
    "preferences": {
      "language": "ig",
      "currency": "NGN",
      "notifications": {
        "email": true,
        "sms": false,
        "push": true,
        "marketing": false
      },
      "privacy": {
        "profileVisibility": "private",
        "allowFriendRequests": false
      }
    },
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

#### Error Responses
- **400 Bad Request** - Invalid field values or no valid preferences provided
  ```json
  {
    "success": false,
    "message": "Invalid language code. Supported languages: en, pcm, ig, yo, ha"
  }
  ```
  ```json
  {
    "success": false,
    "message": "No valid preferences provided to update"
  }
  ```
- **401 Unauthorized** - Missing or invalid authentication token
- **404 Not Found** - User not found
- **500 Internal Server Error** - Server error

---

## Usage Examples

### JavaScript/TypeScript (Fetch API)

#### Get Supported Languages
```javascript
const getSupportedLanguages = async () => {
  try {
    const response = await fetch('https://your-domain.com/api/language/supported');
    const data = await response.json();
    console.log(data.data.languages);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Update Language Preference
```javascript
const updateLanguage = async (languageCode, token) => {
  try {
    const response = await fetch('https://your-domain.com/api/language/preference', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ language: languageCode })
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Bulk Update Preferences
```javascript
const updatePreferences = async (preferences, token) => {
  try {
    const response = await fetch('https://your-domain.com/api/language/preferences/bulk', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(preferences)
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
updatePreferences({
  language: 'yo',
  notifications: {
    email: true,
    push: false
  }
}, userToken);
```

### React Native (Axios)

```javascript
import axios from 'axios';

const API_BASE_URL = 'https://your-domain.com/api';

// Get user's language preference
export const getUserLanguage = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/language/preference`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Update language preference
export const updateUserLanguage = async (language, token) => {
  const response = await axios.put(
    `${API_BASE_URL}/language/preference`,
    { language },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
```

### React (Admin Web)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-domain.com/api',
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all preferences
export const getAllPreferences = async () => {
  const response = await api.get('/language/preferences/all');
  return response.data;
};

// Update multiple preferences
export const updateBulkPreferences = async (preferences) => {
  const response = await api.put('/language/preferences/bulk', preferences);
  return response.data;
};
```

---

## Integration Notes

### Mobile App (React Native)
1. Store the user's language preference in AsyncStorage for offline access
2. Use the language code to load appropriate translation files
3. Update the language preference on the server when changed
4. Sync language preference on app startup

### Admin Web App (React)
1. Store language preference in localStorage or Context API
2. Provide a language selector in user settings
3. Apply language changes immediately to the UI
4. Use i18n libraries like react-i18next for translations

### Best Practices
1. **Cache language preference locally** to avoid unnecessary API calls
2. **Sync on login** - Fetch user preferences after successful authentication
3. **Graceful fallback** - Default to English if language preference fails to load
4. **Optimistic updates** - Update UI immediately, then sync with server
5. **Error handling** - Show user-friendly messages if language update fails

---

## Database Schema

The language preference is stored in the User model under the `preferences` object:

```javascript
preferences: {
  language: {
    type: String,
    enum: ['en', 'pcm', 'ig', 'yo', 'ha'],
    default: 'en'
  },
  currency: {
    type: String,
    enum: ['NGN', 'USD'],
    default: 'NGN'
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  },
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'friends'
    },
    allowFriendRequests: { type: Boolean, default: true }
  }
}
```

---

## Testing

### Test with cURL

```bash
# Get supported languages
curl -X GET https://your-domain.com/api/language/supported

# Get user language preference
curl -X GET https://your-domain.com/api/language/preference \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update language preference
curl -X PUT https://your-domain.com/api/language/preference \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"language": "yo"}'

# Bulk update preferences
curl -X PUT https://your-domain.com/api/language/preferences/bulk \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "ig",
    "notifications": {
      "email": true,
      "push": false
    }
  }'
```

---

## Security Considerations

1. **Authentication Required** - All preference modification endpoints require valid JWT token
2. **User Isolation** - Users can only view/modify their own preferences
3. **Input Validation** - All inputs are validated against allowed values
4. **Rate Limiting** - Consider implementing rate limiting on preference update endpoints
5. **Audit Logging** - Consider logging preference changes for security audits

---

## Future Enhancements

1. Add more Nigerian languages (e.g., Fulani, Tiv, Efik)
2. Support for regional dialects
3. Language-specific content recommendations
4. Automatic language detection based on location
5. Multi-language support for group communications
6. Translation services for cross-language group interactions
