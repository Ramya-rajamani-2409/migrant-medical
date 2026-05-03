// src/context/LanguageContext.jsx
// Simple language switcher between English and Tamil

import { createContext, useContext, useState } from 'react';

// All translated strings
const translations = {
  en: {
    appName: 'Migrant Medical Records',
    login: 'Login',
    email: 'Email Address',
    password: 'Password',
    role: 'Select Role',
    adminKey: 'Admin Secret Key',
    worker: 'Worker',
    doctor: 'Doctor',
    admin: 'Admin',
    dashboard: 'Dashboard',
    bioData: 'Bio Data',
    medicalRecords: 'Medical Records',
    qrCode: 'QR Code',
    profile: 'My Profile',
    searchWorker: 'Search Worker',
    currentPatient: 'Current Patient',
    addPrescription: 'Add Prescription',
    recentActivity: 'Recent Activity',
    manageWorkers: 'Manage Workers',
    manageDoctors: 'Manage Doctors',
    credentials: 'Credentials',
    viewRecords: 'View Records',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    search: 'Search',
    loading: 'Loading...',
    noRecords: 'No records found',
    name: 'Full Name',
    age: 'Age',
    gender: 'Gender',
    bloodGroup: 'Blood Group',
    emergency: 'Emergency Contact',
    diagnosis: 'Diagnosis',
    prescription: 'Prescription',
    hospital: 'Hospital Name',
    date: 'Date',
    notes: 'Notes',
    tests: 'Tests Taken',
    welcomeBack: 'Welcome back',
  },
  ta: {
    appName: 'புலம்பெயர் மருத்துவ பதிவுகள்',
    login: 'உள்நுழைய',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    role: 'பாத்திரம் தேர்வு',
    adminKey: 'நிர்வாக ரகசிய சாவி',
    worker: 'தொழிலாளி',
    doctor: 'மருத்துவர்',
    admin: 'நிர்வாகி',
    dashboard: 'டாஷ்போர்டு',
    bioData: 'தனிப்பட்ட தரவு',
    medicalRecords: 'மருத்துவ பதிவுகள்',
    qrCode: 'QR குறியீடு',
    profile: 'என் சுயவிவரம்',
    searchWorker: 'தொழிலாளியை தேடு',
    currentPatient: 'தற்போதைய நோயாளி',
    addPrescription: 'மருந்து சேர்',
    recentActivity: 'சமீபத்திய செயல்பாடு',
    manageWorkers: 'தொழிலாளர்களை நிர்வகி',
    manageDoctors: 'மருத்துவர்களை நிர்வகி',
    credentials: 'நற்சான்றிதழ்கள்',
    viewRecords: 'பதிவுகளை பார்',
    logout: 'வெளியேறு',
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    add: 'சேர்',
    search: 'தேடு',
    loading: 'ஏற்றுகிறது...',
    noRecords: 'பதிவுகள் எதுவும் இல்லை',
    name: 'முழு பெயர்',
    age: 'வயது',
    gender: 'பாலினம்',
    bloodGroup: 'இரத்த வகை',
    emergency: 'அவசர தொடர்பு',
    diagnosis: 'நோய் கண்டறிதல்',
    prescription: 'மருந்துச் சீட்டு',
    hospital: 'மருத்துவமனை பெயர்',
    date: 'தேதி',
    notes: 'குறிப்புகள்',
    tests: 'மேற்கொண்ட சோதனைகள்',
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key) => translations[lang][key] || key;
  const toggleLang = () => setLang(lang === 'en' ? 'ta' : 'en');

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for easy access
export const useLang = () => useContext(LanguageContext);
