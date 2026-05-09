# 🥜 CajuScript

**Automated Official Website Finder for Business Prospecting**

CajuScript is a Next.js 15 application that automates the search for official company websites using the Google Custom Search API. Upload an Excel spreadsheet with company names, and it returns up to 4 relevant links per company — ready to download as a new spreadsheet.

---

## ✨ Features

- 📤 **Excel Upload** — Drop a `.xlsx` file with a column named `empresa` containing company names
- 🔍 **Smart Search** — Generates multiple optimized queries per company (exact name, "site oficial", probable domains like `company.com.br`)
- 🛡️ **Domain Blacklist** — Automatically filters out irrelevant domains (TikTok, YouTube, Indeed, Glassdoor, Twitter, Serasa, etc.)
- 🏆 **Relevance Ranking** — Scores results based on domain match, `.com.br` / `.br` TLDs, company name in title, and "oficial" keywords
- 🔄 **Smart Fallback** — If the API doesn't find results, tries HEAD checks on probable domains and generates suggested URLs
- ⚡ **Retry with Backoff** — Exponential backoff + jitter for API resilience (up to 3 retries)
- 📊 **Excel Export** — Download results as `prospeccao_com_links.xlsx`
- 🌐 **i18n Support** — Interface available in Portuguese (BR) and English
- 📱 **Responsive UI** — Built with TailwindCSS, works on any device

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17.0 or higher
- **pnpm** (package manager)
- **Google API Key** — [Get one here](https://developers.google.com/custom-search/v1/overview)
- **Custom Search Engine ID (CX)** — [Create one here](https://programmablesearchengine.google.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cajuscript.git
cd cajuscript

# Install dependencies
pnpm install

# Start development server (with Turbopack)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix ESLint issues |
| `pnpm fix` | Run Prettier + ESLint auto-fix |
| `pnpm test` | Run Playwright E2E tests |
| `pnpm record` | Open Playwright codegen tool |

---

## 🎯 How It Works

```
📋 Excel Upload → ⚙️ Configuration → 🔄 Processing → 📊 Results
```

1. **Upload** an Excel file with company names in a column called `empresa`
2. **Configure** your Google API Key and Search Engine ID (CX) in the UI
3. **Process** — For each company, CajuScript:
   - Generates multiple search queries (exact name, "site oficial", domain guesses)
   - Calls the Google Custom Search API with automatic retry
   - Filters out blacklisted domains
   - Ranks results by relevance score
   - Falls back to domain guessing if the API returns nothing
4. **Download** the results as a new Excel file with up to 4 links per company

### Relevance Scoring

| Signal | Score |
|---|---|
| Exact domain match | +200 |
| `.com.br` TLD | +80 |
| Company name in title | +50 |
| "Oficial" / "Official" in title or URL | +30–50 |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   └── page.tsx              # Main page (client component)
│   ├── actions/
│   │   └── searchCompanies.ts    # Server Actions for processing
│   ├── api/
│   │   └── search/route.ts       # API route (POST)
│   └── services/
│       └── googleSearch.ts       # Core search logic
├── components/
│   ├── ConfigurationForm.tsx      # API key & settings form
│   ├── FileUploadForm.tsx         # Excel upload form
│   ├── Header.tsx                 # App header
│   ├── LogDisplay.tsx             # Processing log viewer
│   ├── ProgressIndicator.tsx      # Progress bar
│   └── ResultsTable.tsx           # Results display table
├── constants/
│   └── blacklist.ts               # Blocked domains list
├── messages/
│   ├── br.json                    # Portuguese translations
│   └── en.json                    # English translations
├── types/
│   └── company.ts                 # TypeScript interfaces
└── utils/
    └── excelParser.ts             # Excel parsing & generation
```

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router + Server Actions)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **State:** [Zustand](https://zustand-demo.pmnd.rs/) + [React Hook Form](https://react-hook-form.com/)
- **Validation:** [Zod](https://zod.dev/)
- **i18n:** [next-intl](https://next-intl-docs.vercel.app/)
- **Excel:** [SheetJS (XLSX)](https://github.com/SheetJS/sheetjs)
- **Testing:** [Playwright](https://playwright.dev/)
- **Deploy:** [Netlify](https://www.netlify.com/)

---

## 📄 Excel File Format

Your input Excel file must contain a column named **`empresa`** with company names:

| empresa |
|---|
| Empresa Exemplo Ltda |
| Tech Solutions SA |
| Comércio Digital Brasil |

The output file (`prospeccao_com_links.xlsx`) will include the original company name plus up to 4 website links.

---

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Site base URL (e.g. `https://cajuscript.tdevs.co/`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification code |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID |
| `NEXT_PUBLIC_COUNTER_DEV_ID` | Counter.dev analytics ID |
| `NEXT_PUBLIC_PORTFOLIO_URL` | Portfolio website URL |
| `NEXT_PUBLIC_GITHUB_URL` | GitHub profile URL |
| `NEXT_PUBLIC_LINKEDIN_URL` | LinkedIn profile URL |
| `NEXT_PUBLIC_X_URL` | X (Twitter) profile URL |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile URL |
| `NEXT_PUBLIC_YOUTUBE_URL` | YouTube channel URL |
| `NEXT_PUBLIC_FACEBOOK_URL` | Facebook profile URL |
| `NEXT_PUBLIC_FIGMA_URL` | Figma profile URL |
| `NEXT_PUBLIC_99FREELAS_URL` | 99Freelas profile URL |
| `NEXT_PUBLIC_WORKANA_URL` | Workana profile URL |
| `NEXT_PUBLIC_BUYMEACOFFEE_URL` | Buy Me a Coffee page URL |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email address |
| `COUNTER_API_KEY` | Counter.dev API key (server-side) |

> **Note:** On Netlify, these vars are also set with the `VITE_` prefix for legacy compatibility. The code always uses `NEXT_PUBLIC_*`.

---

## 📜 License

[MIT](https://choosealicense.com/licenses/mit/)
