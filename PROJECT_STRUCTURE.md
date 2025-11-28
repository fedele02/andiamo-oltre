# Struttura del Progetto

Questo documento spiega l'organizzazione delle cartelle e dei file del progetto.

## 📁 Struttura delle Cartelle

```
src/
├── assets/                          # Risorse statiche
│   ├── logo.jpg                    # Logo del partito
│   └── react.svg                   # Icona React
│
├── components/                     # Componenti riutilizzabili
│   ├── common/                    # Componenti condivisi/generici
│   │   ├── Navbar/               # Barra di navigazione
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── ContactForm/          # Form dei contatti
│   │   │   ├── ContactForm.jsx
│   │   │   └── ContactForm.css
│   │   └── SearchBar/            # Barra di ricerca
│   │       ├── SearchBar.jsx
│   │       └── SearchBar.css
│   │
│   └── features/                 # Componenti specifici per feature
│       ├── news/                # Componenti per notizie
│       │   ├── NewsCard.jsx
│       │   └── NewsCard.css
│       └── members/             # Componenti per membri
│           ├── MemberCard.jsx
│           └── MemberCard.css
│
├── pages/                         # Pagine dell'applicazione
│   ├── Home/                     # Pagina principale
│   │   ├── Home.jsx
│   │   └── Home.css
│   ├── Members/                  # Pagina membri
│   │   ├── Members.jsx
│   │   └── Members.css
│   ├── Proposals/                # Pagina proposte/notizie
│   │   └── Proposals.jsx
│   └── Admin/                    # Pannello amministrazione
│       ├── Admin.jsx
│       └── Admin.css
│
├── styles/                       # Stili globali
│   └── index.css                # CSS principale e reset
│
├── data/                        # Dati statici (per uso futuro)
│   └── (placeholder)
│
├── utils/                       # Funzioni di utilità (per uso futuro)
│   └── (placeholder)
│
├── App.jsx                      # Componente principale
├── App.css                      # Stili del componente App
└── main.jsx                     # Entry point dell'applicazione
```

## 🎯 Convenzioni

### Componenti
- **Common**: Componenti riutilizzabili in tutta l'app (Navbar, ContactForm, SearchBar)
- **Features**: Componenti specifici per una feature (NewsCard per notizie, MemberCard per membri)
- Ogni componente ha la sua cartella con JSX e CSS

### Pages
- Ogni pagina ha la sua cartella dedicata
- Include il file JSX e il CSS specifico
- Import relativi: `../../components/...`

### Import Path Examples
```javascript
// Da App.jsx
import Navbar from './components/common/Navbar/Navbar';
import Home from './pages/Home/Home';

// Da una Page (es. Home.jsx)
import logo from '../../assets/logo.jpg';

// Da una Page (es. Members.jsx)
import MemberCard from '../../components/features/members/MemberCard';
```

## 🚀 Benefici della Nuova Struttura

✅ **Organizzazione chiara**: Facile trovare componenti e pagine  
✅ **Scalabilità**: Semplice aggiungere nuove features  
✅ **Manutenibilità**: File correlati sono raggruppati insieme  
✅ **Best practices**: Segue le convenzioni React standard  
✅ **Separazione dei concetti**: Common vs Features vs Pages

## 📝 Note

- La cartella `data/` è pronta per contenere file di dati statici (es. `newsData.js`, `membersData.js`)
- La cartella `utils/` è disponibile per funzioni helper e utilities
- Tutti i CSS sono co-locati con i loro componenti per facilità di manutenzione
