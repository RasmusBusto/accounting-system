import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources defined inline to avoid JSON import issues
const resources = {
  no: {
    translation: {
      nav: {
        dashboard: "Dashbord",
        invoices: "Fakturaer",
        expenses: "Utgifter",
        reports: "Rapporter",
        clients: "Kunder",
        settings: "Innstillinger",
        demoUser: "Demo Bruker"
      },
      app: {
        title: "Innstillinger"
      },
      tabs: {
        departments: "Avdelinger",
        projects: "Prosjekter"
      },
      common: {
        loading: "Laster...",
        error: "Feil",
        save: "Lagre",
        cancel: "Avbryt",
        delete: "Slett",
        edit: "Rediger",
        add: "Legg til",
        search: "Søk",
        filter: "Filter",
        export: "Eksporter",
        import: "Importer",
        settings: "Innstillinger",
        logout: "Logg ut",
        login: "Logg inn",
        language: "Språk",
        saving: "Lagrer...",
        actions: "Handlinger",
        active: "Aktiv",
        inactive: "Inaktiv"
      },
      departments: {
        title: "Avdelinger",
        addNew: "Legg til avdeling",
        create: "Opprett avdeling",
        edit: "Rediger avdeling",
        confirmDelete: "Er du sikker på at du vil slette denne avdelingen?",
        noData: "Ingen avdelinger funnet",
        fields: {
          code: "Kode",
          name: "Navn",
          description: "Beskrivelse",
          active: "Aktiv"
        },
        validation: {
          codeRequired: "Kode er påkrevd",
          nameRequired: "Navn er påkrevd"
        },
        error: {
          load: "Kunne ikke laste avdelinger",
          save: "Kunne ikke lagre avdeling",
          delete: "Kunne ikke slette avdeling"
        }
      },
      projects: {
        title: "Prosjekter",
        addNew: "Legg til prosjekt",
        create: "Opprett prosjekt",
        edit: "Rediger prosjekt",
        confirmDelete: "Er du sikker på at du vil slette dette prosjektet?",
        noData: "Ingen prosjekter funnet",
        fields: {
          code: "Kode",
          name: "Navn",
          description: "Beskrivelse",
          startDate: "Startdato",
          endDate: "Sluttdato",
          dates: "Datoer",
          status: "Status",
          active: "Aktiv"
        },
        status: {
          ACTIVE: "Aktiv",
          COMPLETED: "Fullført",
          ON_HOLD: "På vent",
          CANCELLED: "Kansellert"
        },
        validation: {
          codeRequired: "Kode er påkrevd",
          nameRequired: "Navn er påkrevd",
          startDateRequired: "Startdato er påkrevd",
          endDateRequired: "Sluttdato er påkrevd",
          endDateAfterStart: "Sluttdato må være etter startdato"
        },
        error: {
          load: "Kunne ikke laste prosjekter",
          save: "Kunne ikke lagre prosjekt",
          delete: "Kunne ikke slette prosjekt"
        }
      },
      languages: {
        no: "Norsk",
        en: "Engelsk",
        pl: "Polsk",
        uk: "Ukrainsk"
      }
    }
  },
  en: {
    translation: {
      nav: {
        dashboard: "Dashboard",
        invoices: "Invoices",
        expenses: "Expenses",
        reports: "Reports",
        clients: "Clients",
        settings: "Settings",
        demoUser: "Demo User"
      },
      app: {
        title: "Settings Management"
      },
      tabs: {
        departments: "Departments",
        projects: "Projects"
      },
      common: {
        loading: "Loading...",
        error: "Error",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        add: "Add",
        search: "Search",
        filter: "Filter",
        export: "Export",
        import: "Import",
        settings: "Settings",
        logout: "Logout",
        login: "Login",
        language: "Language",
        saving: "Saving...",
        actions: "Actions",
        active: "Active",
        inactive: "Inactive"
      },
      departments: {
        title: "Departments",
        addNew: "Add Department",
        create: "Create Department",
        edit: "Edit Department",
        confirmDelete: "Are you sure you want to delete this department?",
        noData: "No departments found",
        fields: {
          code: "Code",
          name: "Name",
          description: "Description",
          active: "Active"
        },
        validation: {
          codeRequired: "Code is required",
          nameRequired: "Name is required"
        },
        error: {
          load: "Failed to load departments",
          save: "Failed to save department",
          delete: "Failed to delete department"
        }
      },
      projects: {
        title: "Projects",
        addNew: "Add Project",
        create: "Create Project",
        edit: "Edit Project",
        confirmDelete: "Are you sure you want to delete this project?",
        noData: "No projects found",
        fields: {
          code: "Code",
          name: "Name",
          description: "Description",
          startDate: "Start Date",
          endDate: "End Date",
          dates: "Dates",
          status: "Status",
          active: "Active"
        },
        status: {
          ACTIVE: "Active",
          COMPLETED: "Completed",
          ON_HOLD: "On Hold",
          CANCELLED: "Cancelled"
        },
        validation: {
          codeRequired: "Code is required",
          nameRequired: "Name is required",
          startDateRequired: "Start date is required",
          endDateRequired: "End date is required",
          endDateAfterStart: "End date must be after start date"
        },
        error: {
          load: "Failed to load projects",
          save: "Failed to save project",
          delete: "Failed to delete project"
        }
      },
      languages: {
        no: "Norwegian",
        en: "English",
        pl: "Polish",
        uk: "Ukrainian"
      }
    }
  },
  pl: {
    translation: {
      nav: {
        dashboard: "Pulpit",
        invoices: "Faktury",
        expenses: "Wydatki",
        reports: "Raporty",
        clients: "Klienci",
        settings: "Ustawienia",
        demoUser: "Użytkownik Demo"
      },
      common: {
        loading: "Ładowanie...",
        error: "Błąd",
        save: "Zapisz",
        cancel: "Anuluj",
        delete: "Usuń",
        edit: "Edytuj",
        add: "Dodaj",
        search: "Szukaj",
        filter: "Filtruj",
        export: "Eksportuj",
        import: "Importuj",
        settings: "Ustawienia",
        logout: "Wyloguj",
        login: "Zaloguj",
        language: "Język"
      },
      languages: {
        no: "Norweski",
        en: "Angielski",
        pl: "Polski",
        uk: "Ukraiński"
      }
    }
  },
  uk: {
    translation: {
      nav: {
        dashboard: "Панель",
        invoices: "Рахунки",
        expenses: "Витрати",
        reports: "Звіти",
        clients: "Клієнти",
        settings: "Налаштування",
        demoUser: "Демо Користувач"
      },
      common: {
        loading: "Завантаження...",
        error: "Помилка",
        save: "Зберегти",
        cancel: "Скасувати",
        delete: "Видалити",
        edit: "Редагувати",
        add: "Додати",
        search: "Пошук",
        filter: "Фільтр",
        export: "Експорт",
        import: "Імпорт",
        settings: "Налаштування",
        logout: "Вийти",
        login: "Увійти",
        language: "Мова"
      },
      languages: {
        no: "Норвезька",
        en: "Англійська",
        pl: "Польська",
        uk: "Українська"
      }
    }
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'no',
    lng: 'no',
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    load: 'languageOnly',
  })
  .then(() => {
    // Force add shell translations (deep merge, overwrite existing keys)
    i18n.addResourceBundle('no', 'translation', resources.no.translation, true, true);
    i18n.addResourceBundle('en', 'translation', resources.en.translation, true, true);
    i18n.addResourceBundle('pl', 'translation', resources.pl.translation, true, true);
    i18n.addResourceBundle('uk', 'translation', resources.uk.translation, true, true);
    console.log('Shell i18n initialized', i18n.t('nav.dashboard'));
  });

export default i18n;
