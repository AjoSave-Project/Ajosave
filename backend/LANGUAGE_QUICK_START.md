# Language Preference API - Quick Start Guide

## 🚀 Quick Start

### Backend is Ready!
The language preference API is fully implemented and ready to use. All endpoints are live and tested.

## 📋 Available Endpoints

### 1. Get Supported Languages (Public)
```bash
GET /api/language/supported
```
No authentication required. Returns list of all supported languages.

### 2. Get User's Language
```bash
GET /api/language/preference
Authorization: Bearer <token>
```

### 3. Update User's Language
```bash
PUT /api/language/preference
Authorization: Bearer <token>
Content-Type: application/json

{
  "language": "yo"
}
```

### 4. Get All Preferences
```bash
GET /api/language/preferences/all
Authorization: Bearer <token>
```

### 5. Bulk Update Preferences
```bash
PUT /api/language/preferences/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "language": "ig",
  "currency": "NGN",
  "notifications": {
    "email": true,
    "push": false
  }
}
```

## 🌍 Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| `en` | English | English |
| `pcm` | Nigerian Pidgin | Naija |
| `ig` | Igbo | Igbo |
| `yo` | Yoruba | Yorùbá |
| `ha` | Hausa | Hausa |

## 🔧 Frontend Integration Steps

### Step 1: Create API Service
```typescript
// services/languageService.ts
import api from './api';

export const getSupportedLanguages = () => 
  api.get('/language/supported');

export const getUserLanguage = () => 
  api.get('/language/preference');

export const updateUserLanguage = (language: string) => 
  api.put('/language/preference', { language });
```

### Step 2: Create Language Context
```typescript
// contexts/LanguageContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { getUserLanguage, updateUserLanguage } from '../services/languageService';
import i18n from '../i18n';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    loadUserLanguage();
  }, []);

  const loadUserLanguage = async () => {
    try {
      const response = await getUserLanguage();
      const userLang = response.data.language;
      setLanguage(userLang);
      i18n.changeLanguage(userLang);
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  };

  const changeLanguage = async (newLanguage: string) => {
    try {
      await updateUserLanguage(newLanguage);
      setLanguage(newLanguage);
      i18n.changeLanguage(newLanguage);
    } catch (error) {
      console.error('Failed to update language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

### Step 3: Create Language Selector Component
```typescript
// components/LanguageSelector.tsx
import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pcm', name: 'Nigerian Pidgin', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' }
];

export const LanguageSelector = () => {
  const { language, changeLanguage } = useContext(LanguageContext);

  return (
    <div>
      <h3>Select Language</h3>
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={language === lang.code ? 'active' : ''}
        >
          {lang.flag} {lang.name}
        </button>
      ))}
    </div>
  );
};
```

### Step 4: Install i18n
```bash
# For React Native
npm install i18next react-i18next

# For React Web
npm install i18next react-i18next i18next-http-backend
```

### Step 5: Configure i18n
```typescript
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';
import pcm from './locales/pcm.json';
import ig from './locales/ig.json';
import yo from './locales/yo.json';
import ha from './locales/ha.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pcm: { translation: pcm },
      ig: { translation: ig },
      yo: { translation: yo },
      ha: { translation: ha }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

### Step 6: Create Translation Files
```json
// locales/en.json
{
  "welcome": "Welcome to AjoSave",
  "login": "Login",
  "register": "Register",
  "dashboard": "Dashboard",
  "settings": "Settings",
  "language": "Language"
}

// locales/pcm.json (Nigerian Pidgin)
{
  "welcome": "Welcome to AjoSave",
  "login": "Login",
  "register": "Register",
  "dashboard": "Dashboard",
  "settings": "Settings",
  "language": "Language"
}

// locales/yo.json
{
  "welcome": "Káàbọ̀ sí AjoSave",
  "login": "Wọlé",
  "register": "Forúkọsílẹ̀",
  "dashboard": "Ojú-ìwé àkọ́kọ́",
  "settings": "Àwọn ètò",
  "language": "Èdè"
}

// locales/ig.json
{
  "welcome": "Nnọọ na AjoSave",
  "login": "Banye",
  "register": "Debanye aha",
  "dashboard": "Dashibọọdụ",
  "settings": "Ntọala",
  "language": "Asụsụ"
}

// locales/ha.json
{
  "welcome": "Barka da zuwa AjoSave",
  "login": "Shiga",
  "register": "Yi rajista",
  "dashboard": "Dashboard",
  "settings": "Saitunan",
  "language": "Harshe"
}
```

### Step 7: Use Translations in Components
```typescript
import { useTranslation } from 'react-i18next';

const HomeScreen = () => {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('welcome')}</Text>
      <Button title={t('login')} />
    </View>
  );
};
```

## 📱 Mobile App (React Native) Specific

### AsyncStorage Integration
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save language locally
const saveLanguageLocally = async (language: string) => {
  await AsyncStorage.setItem('userLanguage', language);
};

// Load language on app start
const loadLanguageLocally = async () => {
  const savedLanguage = await AsyncStorage.getItem('userLanguage');
  if (savedLanguage) {
    i18n.changeLanguage(savedLanguage);
  }
};
```

## 🌐 Admin Web App (React) Specific

### LocalStorage Integration
```typescript
// Save language locally
const saveLanguageLocally = (language: string) => {
  localStorage.setItem('userLanguage', language);
};

// Load language on app start
const loadLanguageLocally = () => {
  const savedLanguage = localStorage.getItem('userLanguage');
  if (savedLanguage) {
    i18n.changeLanguage(savedLanguage);
  }
};
```

## ✅ Testing Checklist

- [ ] Install required packages (i18next, react-i18next)
- [ ] Create translation files for all languages
- [ ] Configure i18n
- [ ] Create LanguageContext
- [ ] Create LanguageSelector component
- [ ] Add language selector to settings page
- [ ] Test language switching
- [ ] Test persistence (AsyncStorage/LocalStorage)
- [ ] Test API integration
- [ ] Test fallback to English
- [ ] Test all translated strings

## 🐛 Common Issues & Solutions

### Issue: Language not persisting after app restart
**Solution:** Ensure you're saving to AsyncStorage/LocalStorage and loading on app start.

### Issue: Translations not showing
**Solution:** Check that translation keys match between your code and JSON files.

### Issue: API returns 401 Unauthorized
**Solution:** Ensure you're sending the JWT token in the Authorization header.

### Issue: Language updates but UI doesn't change
**Solution:** Make sure you're using the `t()` function from useTranslation hook.

## 📚 Additional Resources

- Full API Documentation: `backend/LANGUAGE_API_DOCUMENTATION.md`
- Implementation Summary: `backend/LANGUAGE_IMPLEMENTATION_SUMMARY.md`
- Test Suite: `backend/src/controllers/languageController.test.js`

## 🎯 Next Steps

1. ✅ Backend API (Complete)
2. ⏳ Install i18n packages in mobile and web apps
3. ⏳ Create translation files
4. ⏳ Implement LanguageContext
5. ⏳ Create LanguageSelector component
6. ⏳ Add to settings page
7. ⏳ Test thoroughly

## 💡 Pro Tips

1. **Start with English** - Get all your strings working in English first
2. **Use keys consistently** - Use dot notation for nested translations (e.g., `auth.login`)
3. **Test with real content** - Use actual translations, not Lorem Ipsum
4. **Handle plurals** - i18next supports plural forms for different languages
5. **Cache translations** - Store locally to reduce API calls
6. **Fallback gracefully** - Always have English as fallback

## 🚀 Ready to Implement!

The backend is complete and ready. Follow the steps above to integrate language preferences into your mobile and web apps. Start with the mobile app or web app - your choice!
