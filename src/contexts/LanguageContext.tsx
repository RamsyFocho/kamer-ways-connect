import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.agencies': 'Agencies',
      'nav.routes': 'Trips',
      'nav.bookings': 'My Bookings',
      'nav.admin': 'Admin Panel',
      'nav.settings': 'Settings',
      'nav.login': 'Login',
      'nav.logout': 'Logout',

      // Home Page
      'home.title': 'Travel Across Cameroon',
      'home.subtitle': 'Book your bus tickets with ease and comfort',
      'home.searchPlaceholder': 'Search destinations...',
      'home.bookNow': 'Book Now',
      'home.viewAgencies': 'View All Agencies',

      // Agencies
      'agencies.title': 'Bus Agencies',
      'agencies.rating': 'Rating',
      'agencies.reviews': 'reviews',
      'agencies.established': 'Established',
      'agencies.fleetSize': 'Fleet Size',
      'agencies.buses': 'buses',

      // Booking
      'booking.title': 'Book Your Journey',
      'booking.selectRoute': 'Select Route',
      'booking.passengerInfo': 'Passenger Information',
      'booking.seatSelection': 'Seat Selection',
      'booking.payment': 'Payment',
      'booking.confirmation': 'Confirmation',
      'booking.next': 'Next',
      'booking.previous': 'Previous',
      'booking.confirm': 'Confirm Booking',

      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error occurred',
      'common.success': 'Success!',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.sort': 'Sort',

      // Settings
      'settings.title': 'Settings',
      'settings.language': 'Language',
      'settings.theme': 'Theme',
      'settings.light': 'Light',
      'settings.dark': 'Dark',
      'settings.system': 'System',

      // Auth
      'auth.login': 'Login',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.loginButton': 'Sign In',
      'auth.adminLogin': 'Admin Login',
      'auth.customerLogin': 'Customer Login'
    }
  },
  fr: {
    translation: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.agencies': 'Agences',
      'nav.routes': 'Routes',
      'nav.bookings': 'Mes Réservations',
      'nav.admin': 'Panneau Admin',
      'nav.settings': 'Paramètres',
      'nav.login': 'Connexion',
      'nav.logout': 'Déconnexion',

      // Home Page
      'home.title': 'Voyagez à travers le Cameroun',
      'home.subtitle': 'Réservez vos billets de bus facilement et confortablement',
      'home.searchPlaceholder': 'Rechercher des destinations...',
      'home.bookNow': 'Réserver Maintenant',
      'home.viewAgencies': 'Voir Toutes les Agences',

      // Agencies
      'agencies.title': 'Agences de Bus',
      'agencies.rating': 'Note',
      'agencies.reviews': 'avis',
      'agencies.established': 'Établie',
      'agencies.fleetSize': 'Taille de la Flotte',
      'agencies.buses': 'bus',

      // Booking
      'booking.title': 'Réservez Votre Voyage',
      'booking.selectRoute': 'Sélectionner un Itinéraire',
      'booking.passengerInfo': 'Informations Passager',
      'booking.seatSelection': 'Sélection de Siège',
      'booking.payment': 'Paiement',
      'booking.confirmation': 'Confirmation',
      'booking.next': 'Suivant',
      'booking.previous': 'Précédent',
      'booking.confirm': 'Confirmer la Réservation',

      // Common
      'common.loading': 'Chargement...',
      'common.error': 'Erreur survenue',
      'common.success': 'Succès!',
      'common.cancel': 'Annuler',
      'common.save': 'Sauvegarder',
      'common.edit': 'Modifier',
      'common.delete': 'Supprimer',
      'common.search': 'Rechercher',
      'common.filter': 'Filtrer',
      'common.sort': 'Trier',

      // Settings
      'settings.title': 'Paramètres',
      'settings.language': 'Langue',
      'settings.theme': 'Thème',
      'settings.light': 'Clair',
      'settings.dark': 'Sombre',
      'settings.system': 'Système',

      // Auth
      'auth.login': 'Connexion',
      'auth.email': 'Email',
      'auth.password': 'Mot de passe',
      'auth.loginButton': 'Se connecter',
      'auth.adminLogin': 'Connexion Admin',
      'auth.customerLogin': 'Connexion Client'
    }
  },
  es: {
    translation: {
      // Navigation
      'nav.home': 'Inicio',
      'nav.agencies': 'Agencias',
      'nav.routes': 'Route',
      'nav.bookings': 'Mis Reservas',
      'nav.admin': 'Panel Admin',
      'nav.settings': 'Configuración',
      'nav.login': 'Iniciar Sesión',
      'nav.logout': 'Cerrar Sesión',

      // Home Page
      'home.title': 'Viaja por Camerún',
      'home.subtitle': 'Reserva tus boletos de autobús con facilidad y comodidad',
      'home.searchPlaceholder': 'Buscar destinos...',
      'home.bookNow': 'Reservar Ahora',
      'home.viewAgencies': 'Ver Todas las Agencias',

      // Agencies
      'agencies.title': 'Agencias de Autobús',
      'agencies.rating': 'Calificación',
      'agencies.reviews': 'reseñas',
      'agencies.established': 'Establecida',
      'agencies.fleetSize': 'Tamaño de Flota',
      'agencies.buses': 'autobuses',

      // Booking
      'booking.title': 'Reserva tu Viaje',
      'booking.selectRoute': 'Seleccionar Ruta',
      'booking.passengerInfo': 'Información del Pasajero',
      'booking.seatSelection': 'Selección de Asiento',
      'booking.payment': 'Pago',
      'booking.confirmation': 'Confirmación',
      'booking.next': 'Siguiente',
      'booking.previous': 'Anterior',
      'booking.confirm': 'Confirmar Reserva',

      // Common
      'common.loading': 'Cargando...',
      'common.error': 'Error ocurrido',
      'common.success': '¡Éxito!',
      'common.cancel': 'Cancelar',
      'common.save': 'Guardar',
      'common.edit': 'Editar',
      'common.delete': 'Eliminar',
      'common.search': 'Buscar',
      'common.filter': 'Filtrar',
      'common.sort': 'Ordenar',

      // Settings
      'settings.title': 'Configuración',
      'settings.language': 'Idioma',
      'settings.theme': 'Tema',
      'settings.light': 'Claro',
      'settings.dark': 'Oscuro',
      'settings.system': 'Sistema',

      // Auth
      'auth.login': 'Iniciar Sesión',
      'auth.email': 'Email',
      'auth.password': 'Contraseña',
      'auth.loginButton': 'Iniciar Sesión',
      'auth.adminLogin': 'Inicio Admin',
      'auth.customerLogin': 'Inicio Cliente'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const stored = localStorage.getItem('kamerways-language');
    if (stored) {
      setLanguage(stored);
      i18n.changeLanguage(stored);
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('kamerways-language', lang);
    i18n.changeLanguage(lang);
  };

  const t = (key: string) => i18n.t(key);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}