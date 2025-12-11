# Istruzioni del Progetto & Best Practices

## Regole Generali per l'AI
- **Stile**: Niente emoji, tono professionale e diretto.
- **Esecuzione**: Verifica se esistono approcci simili prima di scrivere nuovo codice. Riutilizza pattern esistenti.

## Panoramica del Progetto
"Andiamo Oltre" è una piattaforma web costruita con **React (Vite)**, **Tailwind CSS**, **Supabase** (Database) e **Cloudinary** (Archiviazione Media). Serve come CMS per un movimento comunitario.

## Stack Tecnologico
- **Frontend**: React 18, Vite, Tailwind CSS.
- **Backend/DB**: Supabase (PostgreSQL).
- **Storage**: Cloudinary (Immagini & Documenti).
- **Email**: EmailJS.
- **Routing**: React Router DOM.

## Design System & UI
- **Colore Primario**: `#66CBFF` (Azzurro Cielo).
- **Secondario/Gradiente**: `from-[#66CBFF] to-[#4facfe]`.
- **Sfondi**: Bianco o Azzurro Chiaro (`#f0f9ff`).
- **Font**: `Montserrat` (Titoli), `Open Sans` (Corpo).
- **Stile**: Tailwind CSS.
  - **Card**: `rounded-[15px]` o `rounded-3xl`, `shadow-card`, `hover:-translate-y-[5px]`.

## Regole di Sviluppo & Best Practices

### 1. Organizzazione del Codice & Riutilizzo
- **Componenti UI**: Se crei un componente che può essere riutilizzato in più parti del sito (es. Carousel, Modale generico, Bottone custom), DEVI salvarlo in `src/components/ui/`.
- **Globals (`src/globals/`)**:
  - Questa cartella centralizza costanti, hook e utility.
  - **PRIMA** di scrivere una nuova funzione helper o hook, controlla sempre se esiste già in `src/globals/`.
  - Se un approccio esiste già in `globals`, utilizza quello senza crearne altri duplicati.
  - Importa sempre da `@/globals` (o percorso relativo) invece che dai singoli file.
- **Struttura Cartelle**:
  - `src/components/`: Componenti specifici.
  - `src/pages/`: Pagine intere.
  - `src/lib/`: Servizi esterni (Supabase, Cloudinary).

### 2. Configurazione & Sicurezza
- **.env & Gitignore**: **NON** aggiungere MAI il file `.env` al `.gitignore`. Il file `.env` deve rimanere visibile e tracciato nel repository.

### 3. Design Responsivo (Obbligatorio)
- **Sviluppo Simultaneo**: Implementa SEMPRE Desktop e Mobile insieme.
- **Mobile First**: Usa `flex-col` per mobile e `md:flex-row` per desktop.

### 4. Coerenza Admin & Anteprima
- **Mirroring**: Se modifichi un componente pubblico (es. `NewsCard`), aggiorna immediatamente l'anteprima in `Admin.jsx`.

### 5. Gestione Cloudinary
- **Upload**: Usa `src/lib/cloudinary/upload.js`.
- **Pulizia**: Quando elimini un record dal DB, elimina SEMPRE il file associato su Cloudinary usando `deleteFile`.

### 6. Database (Supabase)
- Usa sempre il layer di servizio in `src/lib/supabase/`. Non chiamare `supabase` direttamente nella UI.
- Gestisci sempre gli errori con `try/catch`.

### 7. Problemi Comuni
- **Array Vuoti**: Gestisci sempre `images || []` per evitare crash.
- **PDF**: Carica i PDF come `raw` su Cloudinary.

## Checklist del Workflow
1. [ ] Verificare se esiste già una utility in `globals`.
2. [ ] Implementare funzionalità (Mobile + Desktop).
3. [ ] Se componente riutilizzabile -> `src/components/ui/`.
4. [ ] Aggiornare Anteprima Admin se necessario.
5. [ ] Pulizia Cloudinary se si elimina qualcosa.
6. [ ] Verificare che `.env` NON sia in gitignore.
