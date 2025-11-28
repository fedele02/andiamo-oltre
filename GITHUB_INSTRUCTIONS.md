# Istruzioni Progetto "Andiamo Oltre"

## Panoramica
Questo progetto è un sito web statico React per il partito "Andiamo Oltre". Include funzionalità di gestione contenuti simulate (Admin Mode) che permettono di modificare testi, immagini e video direttamente dall'interfaccia.

## Stack Tecnologico
- **Framework**: React (Vite)
- **Routing**: React Router DOM
- **Stile**: **Tailwind CSS** (Priorità assoluta per lo styling)
- **Icone**: Material Symbols / FontAwesome

## Colori e Tema
Il sito utilizza un tema chiaro con i seguenti colori principali:
- **Primario**: `#66CBFF` (Azzurro)
- **Secondario**: `#FFFFFF` (Bianco)
- **Testo**: `#333333` (Grigio Scuro)

## Funzionalità Admin
La modalità Admin è nascosta e si attiva tramite il form "Parla con Noi".

### Come Attivare Admin
1. Vai alla pagina **Parla con Noi** (`/contatti`).
2. Nel campo **Email**, inserisci: `andiamooltre@gmail.com`.
3. Comparirà un campo **Password**. Inserisci: `Password123?`.
4. Clicca su **Invia Segnalazione**.
5. Un alert confermerà "Ora sei un Admin" e la voce "Admin" apparirà nella Navbar.

### Funzionalità Disponibili in Admin Mode
- **Navbar**: Compare il link alla dashboard Admin.
- **Home**: Pulsante "Matita" per modificare la descrizione del partito.
- **Membri**:
    - Pulsanti "Matita" e "Cestino" su ogni card membro.
    - Modifica inline di nome, ruolo, descrizione.
- **Nostre Proposte**:
    - Pulsanti "Matita" e "Cestino" su ogni notizia.
    - Modifica inline di titoli e testi.
    - Modifica ID video YouTube.
    - Eliminazione immagini dal carosello.
    - Drag & Drop simulato per nuove immagini.
- **Dashboard Admin**:
    - Form per aggiungere nuovi Membri (con Preview).
    - Form per aggiungere nuove Notizie (con Preview).
    - Visualizzazione segnalazioni ricevute.
- **Salvataggio**:
    - Un pulsante flottante "Salva Modifiche" appare in alto a destra. Cliccandolo si simula il salvataggio (alert).

## Sviluppo e Build
### Installazione
```bash
npm install
```

### Avvio Server di Sviluppo
```bash
npm run dev
```

### Build per Produzione
```bash
npm run build
```

## Struttura File Principali
- `src/App.jsx`: Gestione routing e stato Admin globale.
- `src/pages/Home.jsx`: Nuova Home con logo e descrizione.
- `src/pages/Proposals.jsx`: Ex Home, lista notizie con ricerca.
- `src/pages/Members.jsx`: Lista membri team.
- `src/pages/Admin.jsx`: Dashboard di controllo.
- `src/components/ContactForm.jsx`: Form contatti e login Admin.
