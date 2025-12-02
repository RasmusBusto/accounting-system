import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// All translations merged from all apps into a single resource bundle
const resources = {
  no: {
    translation: {
      // Navigation (from shell)
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
      // Dashboard (from dashboard app)
      dashboard: {
        title: "Dashboard",
        totalRevenue: "Total Inntekt",
        pendingInvoices: "Ventende Fakturaer",
        activeClients: "Aktive Kunder",
        recentActivity: "Nylig Aktivitet",
        recentActivityDescription: "Dine nylige transaksjoner og oppdateringer vil vises her."
      },
      // Invoicing (from invoicing app)
      invoicing: {
        title: "Fakturaer",
        createInvoice: "Opprett Ny Faktura",
        description: "Administrer dine fakturaer her.",
        cancel: "Avbryt",
        next: "Neste",
        previous: "Forrige",
        finish: "Fullfør",
        step: "Steg",
        of: "av",
        step1: {
          title: "Dokumenttype og navn",
          subtitle: "Velg dokumenttype og oppgi navn",
          invoice: "Faktura",
          invoiceDescription: "Utgående faktura til kunde",
          receipt: "Kvittering",
          receiptDescription: "Kvittering for kjøp eller betaling",
          otherDocument: "Annet dokument",
          otherDocumentDescription: "Last opp et annet type dokument",
          name: "Navn",
          namePlaceholder: "Kundenavn eller beskrivelse",
          uploadFile: "Last opp fil",
          dragDropOrClick: "Dra og slipp fil her, eller klikk for å velge",
          supportedFormats: "PDF, JPG, JPEG eller PNG",
          selectedFile: "Valgt fil",
          changeFile: "Bytt fil"
        },
        step2: {
          title: "Pris og detaljer",
          subtitle: "Oppgi pris, MVA og type vare/tjeneste",
          price: "Pris",
          priceExVat: "Pris eks. MVA",
          priceIncVat: "Pris inkl. MVA",
          vat: "MVA",
          vatRate: "MVA-sats",
          vatAmount: "MVA-beløp",
          noVat: "Ingen MVA (0%)",
          lowVat: "Lav sats (12%)",
          standardVat: "Standard sats (25%)",
          goodsOrService: "Vare eller tjeneste",
          goods: "Vare",
          service: "Tjeneste",
          description: "Beskrivelse",
          descriptionPlaceholder: "Beskriv varen eller tjenesten",
          quantity: "Antall",
          unitPrice: "Enhetspris",
          totalExVat: "Sum eks. MVA",
          totalIncVat: "Sum inkl. MVA"
        },
        step3: {
          title: "Betaling",
          subtitle: "Velg betalingsmetode og forfallsdato",
          paymentMethod: "Betalingsmetode",
          bankTransfer: "Bankoverføring",
          cash: "Kontant",
          card: "Kort",
          vipps: "Vipps",
          other: "Annet",
          accountNumber: "Kontonummer",
          accountNumberPlaceholder: "1234 56 78901",
          dueDate: "Forfallsdato",
          invoiceDate: "Fakturadato",
          paymentTerms: "Betalingsbetingelser",
          days: "dager",
          net10: "Netto 10 dager",
          net15: "Netto 15 dager",
          net30: "Netto 30 dager",
          net45: "Netto 45 dager",
          net60: "Netto 60 dager",
          immediate: "Ved mottak",
          reference: "Referanse",
          referencePlaceholder: "KID eller referansenummer",
          notes: "Notater",
          notesPlaceholder: "Tilleggsinformasjon til kunden",
          summary: "Oppsummering",
          documentType: "Dokumenttype",
          customerName: "Kundenavn",
          file: "Fil",
          successMessage: "Dokumentet ble registrert!",
          registerAnother: "Registrer et nytt dokument"
        }
      },
      // Expenses (from expenses app)
      expenses: {
        title: "Utgifter",
        addExpense: "Legg til Utgift",
        description: "Spor og administrer dine utgifter."
      },
      // Clients (from clients app)
      clients: {
        title: "Kunder",
        addClient: "Legg til Ny Kunde",
        description: "Administrer dine kunder."
      },
      // Reports (from reports app)
      reports: {
        title: "Rapporter",
        plReport: "Resultatregnskap",
        balanceSheet: "Balanse",
        description: "Se dine økonomiske rapporter."
      },
      ledger: {
        title: "Hovedbok",
        description: "Bla gjennom kontoer og bilag organisert etter kategori.",
        entries: "bilag",
        entriesFound: "bilag funnet",
        accounts: "kontoer",
        noEntries: "Ingen bilag funnet for denne perioden.",
        expandAll: "Utvid alle",
        collapseAll: "Lukk alle",
        total: "Sum",
        crossEntry: "Merk som krysset",
        viewDocument: "Vis dokument",
        columns: {
          entryId: "Bilagsnr",
          lineId: "Linje",
          date: "Dato",
          entryType: "Type",
          account: "Konto",
          description: "Beskrivelse",
          debit: "Debet",
          credit: "Kredit",
          status: "Status",
          document: "Dok",
          crossed: "Krysset",
          vatCode: "MVA-kode",
          vatAmount: "MVA"
        },
        entryTypes: {
          sale: "Salg",
          purchase: "Kjøp",
          salary: "Lønn",
          bank: "Bank",
          journal: "Journalføring",
          depreciation: "Avskrivning",
          adjustment: "Justering"
        },
        status: {
          open: "Åpen",
          closed: "Lukket"
        },
        details: {
          createdAt: "Opprettet",
          createdBy: "Av",
          reference: "Referanse",
          customerSupplier: "Kunde/Leverandør",
          project: "Prosjekt"
        },
        filters: {
          period: "Periode",
          periodTypes: {
            month: "Måned",
            year: "År",
            custom: "Egendefinert"
          },
          months: {
            january: "Januar",
            february: "Februar",
            march: "Mars",
            april: "April",
            may: "Mai",
            june: "Juni",
            july: "Juli",
            august: "August",
            september: "September",
            october: "Oktober",
            november: "November",
            december: "Desember"
          },
          project: "Prosjekt",
          allProjects: "Alle prosjekter",
          entryType: "Bilagstype",
          allTypes: "Alle typer",
          showCrossedOnly: "Kun kryssede",
          showOpenOnly: "Kun åpne poster",
          searchPlaceholder: "Søk i bilag...",
          sortBy: "Sorter etter",
          ascending: "Stigende",
          descending: "Synkende",
          moreFilters: "Flere filtre",
          clearFilters: "Nullstill filtre"
        },
        sortFields: {
          date: "Dato",
          entryId: "Bilagsnr",
          amount: "Beløp",
          accountId: "Konto",
          entryType: "Type"
        }
      },
      // Settings - Departments (from settings app)
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
      // Settings - Projects (from settings app)
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
      dashboard: {
        title: "Dashboard",
        totalRevenue: "Total Revenue",
        pendingInvoices: "Pending Invoices",
        activeClients: "Active Clients",
        recentActivity: "Recent Activity",
        recentActivityDescription: "Your recent transactions and updates will appear here."
      },
      invoicing: {
        title: "Invoices",
        createInvoice: "Create New Invoice",
        description: "Manage your invoices here.",
        cancel: "Cancel",
        next: "Next",
        previous: "Previous",
        finish: "Finish",
        step: "Step",
        of: "of",
        step1: {
          title: "Document type and name",
          subtitle: "Choose document type and provide name",
          invoice: "Invoice",
          invoiceDescription: "Outgoing invoice to customer",
          receipt: "Receipt",
          receiptDescription: "Receipt for purchase or payment",
          otherDocument: "Other document",
          otherDocumentDescription: "Upload another type of document",
          name: "Name",
          namePlaceholder: "Customer name or description",
          uploadFile: "Upload file",
          dragDropOrClick: "Drag and drop file here, or click to select",
          supportedFormats: "PDF, JPG, JPEG or PNG",
          selectedFile: "Selected file",
          changeFile: "Change file"
        },
        step2: {
          title: "Price and details",
          subtitle: "Enter price, VAT and type of goods/service",
          price: "Price",
          priceExVat: "Price excl. VAT",
          priceIncVat: "Price incl. VAT",
          vat: "VAT",
          vatRate: "VAT rate",
          vatAmount: "VAT amount",
          noVat: "No VAT (0%)",
          lowVat: "Low rate (12%)",
          standardVat: "Standard rate (25%)",
          goodsOrService: "Goods or service",
          goods: "Goods",
          service: "Service",
          description: "Description",
          descriptionPlaceholder: "Describe the goods or service",
          quantity: "Quantity",
          unitPrice: "Unit price",
          totalExVat: "Total excl. VAT",
          totalIncVat: "Total incl. VAT"
        },
        step3: {
          title: "Payment",
          subtitle: "Choose payment method and due date",
          paymentMethod: "Payment method",
          bankTransfer: "Bank transfer",
          cash: "Cash",
          card: "Card",
          vipps: "Vipps",
          other: "Other",
          accountNumber: "Account number",
          accountNumberPlaceholder: "1234 56 78901",
          dueDate: "Due date",
          invoiceDate: "Invoice date",
          paymentTerms: "Payment terms",
          days: "days",
          net10: "Net 10 days",
          net15: "Net 15 days",
          net30: "Net 30 days",
          net45: "Net 45 days",
          net60: "Net 60 days",
          immediate: "Upon receipt",
          reference: "Reference",
          referencePlaceholder: "Payment reference number",
          notes: "Notes",
          notesPlaceholder: "Additional information for customer",
          summary: "Summary",
          documentType: "Document type",
          customerName: "Customer name",
          file: "File",
          successMessage: "Document registered successfully!",
          registerAnother: "Register another document"
        }
      },
      expenses: {
        title: "Expenses",
        addExpense: "Add Expense",
        description: "Track and manage your expenses."
      },
      clients: {
        title: "Clients",
        addClient: "Add New Client",
        description: "Manage your clients."
      },
      reports: {
        title: "Reports",
        plReport: "P&L Report",
        balanceSheet: "Balance Sheet",
        description: "View your financial reports."
      },
      ledger: {
        title: "General Ledger",
        description: "Browse your accounts and journal entries organized by category.",
        entries: "entries",
        entriesFound: "entries found",
        accounts: "accounts",
        noEntries: "No entries found for this period.",
        expandAll: "Expand all",
        collapseAll: "Collapse all",
        total: "Total",
        crossEntry: "Mark as crossed",
        viewDocument: "View document",
        columns: {
          entryId: "Entry ID",
          lineId: "Line",
          date: "Date",
          entryType: "Type",
          account: "Account",
          description: "Description",
          debit: "Debit",
          credit: "Credit",
          status: "Status",
          document: "Doc",
          crossed: "Crossed",
          vatCode: "VAT Code",
          vatAmount: "VAT"
        },
        entryTypes: {
          sale: "Sale",
          purchase: "Purchase",
          salary: "Payroll",
          bank: "Bank",
          journal: "Journal",
          depreciation: "Depreciation",
          adjustment: "Adjustment"
        },
        status: {
          open: "Open",
          closed: "Closed"
        },
        details: {
          createdAt: "Created",
          createdBy: "By",
          reference: "Reference",
          customerSupplier: "Customer/Supplier",
          project: "Project"
        },
        filters: {
          period: "Period",
          periodTypes: {
            month: "Month",
            year: "Year",
            custom: "Custom"
          },
          months: {
            january: "January",
            february: "February",
            march: "March",
            april: "April",
            may: "May",
            june: "June",
            july: "July",
            august: "August",
            september: "September",
            october: "October",
            november: "November",
            december: "December"
          },
          project: "Project",
          allProjects: "All projects",
          entryType: "Entry type",
          allTypes: "All types",
          showCrossedOnly: "Crossed only",
          showOpenOnly: "Open items only",
          searchPlaceholder: "Search entries...",
          sortBy: "Sort by",
          ascending: "Ascending",
          descending: "Descending",
          moreFilters: "More filters",
          clearFilters: "Clear filters"
        },
        sortFields: {
          date: "Date",
          entryId: "Entry ID",
          amount: "Amount",
          accountId: "Account",
          entryType: "Type"
        }
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
      app: {
        title: "Zarządzanie ustawieniami"
      },
      tabs: {
        departments: "Działy",
        projects: "Projekty"
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
        language: "Język",
        saving: "Zapisywanie...",
        actions: "Akcje",
        active: "Aktywny",
        inactive: "Nieaktywny"
      },
      dashboard: {
        title: "Pulpit",
        totalRevenue: "Całkowity przychód",
        pendingInvoices: "Oczekujące faktury",
        activeClients: "Aktywni klienci",
        recentActivity: "Ostatnia aktywność",
        recentActivityDescription: "Twoje ostatnie transakcje i aktualizacje pojawią się tutaj."
      },
      invoicing: {
        title: "Faktury",
        createInvoice: "Utwórz nową fakturę",
        description: "Zarządzaj swoimi fakturami tutaj."
      },
      expenses: {
        title: "Wydatki",
        addExpense: "Dodaj wydatek",
        description: "Śledź i zarządzaj swoimi wydatkami."
      },
      clients: {
        title: "Klienci",
        addClient: "Dodaj nowego klienta",
        description: "Zarządzaj swoimi klientami."
      },
      reports: {
        title: "Raporty",
        plReport: "Rachunek zysków i strat",
        balanceSheet: "Bilans",
        description: "Zobacz swoje raporty finansowe."
      },
      ledger: {
        title: "Księga główna"
      },
      departments: {
        title: "Działy",
        addNew: "Dodaj dział",
        create: "Utwórz dział",
        edit: "Edytuj dział",
        confirmDelete: "Czy na pewno chcesz usunąć ten dział?",
        noData: "Nie znaleziono działów",
        fields: {
          code: "Kod",
          name: "Nazwa",
          description: "Opis",
          active: "Aktywny"
        },
        validation: {
          codeRequired: "Kod jest wymagany",
          nameRequired: "Nazwa jest wymagana"
        },
        error: {
          load: "Nie udało się załadować działów",
          save: "Nie udało się zapisać działu",
          delete: "Nie udało się usunąć działu"
        }
      },
      projects: {
        title: "Projekty",
        addNew: "Dodaj projekt",
        create: "Utwórz projekt",
        edit: "Edytuj projekt",
        confirmDelete: "Czy na pewno chcesz usunąć ten projekt?",
        noData: "Nie znaleziono projektów",
        fields: {
          code: "Kod",
          name: "Nazwa",
          description: "Opis",
          startDate: "Data rozpoczęcia",
          endDate: "Data zakończenia",
          dates: "Daty",
          status: "Status",
          active: "Aktywny"
        },
        status: {
          ACTIVE: "Aktywny",
          COMPLETED: "Zakończony",
          ON_HOLD: "Wstrzymany",
          CANCELLED: "Anulowany"
        },
        validation: {
          codeRequired: "Kod jest wymagany",
          nameRequired: "Nazwa jest wymagana",
          startDateRequired: "Data rozpoczęcia jest wymagana",
          endDateRequired: "Data zakończenia jest wymagana",
          endDateAfterStart: "Data zakończenia musi być po dacie rozpoczęcia"
        },
        error: {
          load: "Nie udało się załadować projektów",
          save: "Nie udało się zapisać projektu",
          delete: "Nie udało się usunąć projektu"
        }
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
      app: {
        title: "Управління налаштуваннями"
      },
      tabs: {
        departments: "Відділи",
        projects: "Проєкти"
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
        language: "Мова",
        saving: "Збереження...",
        actions: "Дії",
        active: "Активний",
        inactive: "Неактивний"
      },
      dashboard: {
        title: "Панель",
        totalRevenue: "Загальний дохід",
        pendingInvoices: "Очікувані рахунки",
        activeClients: "Активні клієнти",
        recentActivity: "Остання активність",
        recentActivityDescription: "Ваші останні транзакції та оновлення з'являться тут."
      },
      invoicing: {
        title: "Рахунки",
        createInvoice: "Створити новий рахунок",
        description: "Керуйте своїми рахунками тут."
      },
      expenses: {
        title: "Витрати",
        addExpense: "Додати витрату",
        description: "Відстежуйте та керуйте своїми витратами."
      },
      clients: {
        title: "Клієнти",
        addClient: "Додати нового клієнта",
        description: "Керуйте своїми клієнтами."
      },
      reports: {
        title: "Звіти",
        plReport: "Звіт про прибутки та збитки",
        balanceSheet: "Баланс",
        description: "Перегляньте свої фінансові звіти."
      },
      ledger: {
        title: "Головна книга"
      },
      departments: {
        title: "Відділи",
        addNew: "Додати відділ",
        create: "Створити відділ",
        edit: "Редагувати відділ",
        confirmDelete: "Ви впевнені, що хочете видалити цей відділ?",
        noData: "Відділи не знайдено",
        fields: {
          code: "Код",
          name: "Назва",
          description: "Опис",
          active: "Активний"
        },
        validation: {
          codeRequired: "Код є обов'язковим",
          nameRequired: "Назва є обов'язковою"
        },
        error: {
          load: "Не вдалося завантажити відділи",
          save: "Не вдалося зберегти відділ",
          delete: "Не вдалося видалити відділ"
        }
      },
      projects: {
        title: "Проєкти",
        addNew: "Додати проєкт",
        create: "Створити проєкт",
        edit: "Редагувати проєкт",
        confirmDelete: "Ви впевнені, що хочете видалити цей проєкт?",
        noData: "Проєкти не знайдено",
        fields: {
          code: "Код",
          name: "Назва",
          description: "Опис",
          startDate: "Дата початку",
          endDate: "Дата завершення",
          dates: "Дати",
          status: "Статус",
          active: "Активний"
        },
        status: {
          ACTIVE: "Активний",
          COMPLETED: "Завершено",
          ON_HOLD: "Призупинено",
          CANCELLED: "Скасовано"
        },
        validation: {
          codeRequired: "Код є обов'язковим",
          nameRequired: "Назва є обов'язковою",
          startDateRequired: "Дата початку є обов'язковою",
          endDateRequired: "Дата завершення є обов'язковою",
          endDateAfterStart: "Дата завершення повинна бути після дати початку"
        },
        error: {
          load: "Не вдалося завантажити проєкти",
          save: "Не вдалося зберегти проєкт",
          delete: "Не вдалося видалити проєкт"
        }
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
  });

export default i18n;
