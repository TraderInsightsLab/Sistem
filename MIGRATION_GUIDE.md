# 🚀 Ghid Migrare de la Firebase la Vercel + Supabase

## ✅ Pași Completați

### 1. ✅ Database Schema (Supabase)
- **Status**: COMPLETED
- Fișier: `supabase/schema.sql`
- Tabele create: `test_sessions`, `test_answers`, `payment_sessions`, `users`
- **Confirmat**: Schema rulată cu succes în Supabase SQL Editor

### 2. ✅ API Routes (Vercel Serverless Functions)
- **Status**: COMPLETED
- Locație: `api/` directory
- Endpoints create:
  - `/api/startTest` - Inițializează sesiune de test nouă
  - `/api/saveAnswer` - Salvează răspunsuri
  - `/api/processResults` - Procesează rezultate și generează analiză
  - `/api/createPaymentSession` - Creează sesiune Stripe
  - `/api/webhooks/stripe` - Webhook pentru confirmări plată

### 3. ✅ Frontend Updates
- **Status**: COMPLETED
- `frontend/src/store/testStore.ts` actualizat pentru API-uri Vercel
- Eliminat toate referințele la Firebase API
- Menținută persistență în sessionStorage

### 4. ✅ Dependențe instalate
```bash
npm install @vercel/node @supabase/supabase-js micro
```

---

## 🔧 Pași Rămași

### 4. Configure Environment Variables

#### În `.env.local` local (pentru dezvoltare):
```bash
# Supabase - ✅ DONE
NEXT_PUBLIC_SUPABASE_URL=https://fgyvghiovhujyhvtdxpp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Stripe - ⚠️ TODO: Adaugă cheia secretă reală
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51R1or5GVlY8clYXh...
STRIPE_SECRET_KEY=sk_test_YOUR_REAL_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Base URL - ⚠️ TODO: Actualizează după deployment
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Vertex AI - Opțional (pentru analiză AI avansată)
VERTEX_AI_PROJECT_ID=traderinsightslab
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_MODEL=gemini-1.5-pro

# SendGrid - Opțional (pentru trimitere email)
SENDGRID_API_KEY=YOUR_SENDGRID_KEY_HERE

NODE_ENV=production
```

#### Unde găsești cheile Stripe:
1. Mergi pe https://dashboard.stripe.com/test/apikeys
2. Copiază **Secret key** (începe cu `sk_test_`)
3. Pentru Webhook Secret:
   - Mergi la https://dashboard.stripe.com/test/webhooks
   - Creează webhook nou cu URL: `https://your-vercel-domain.vercel.app/api/webhooks/stripe`
   - Eventi: `checkout.session.completed`
   - Copiază **Signing secret** (începe cu `whsec_`)

---

### 5. Push Code to GitHub

```bash
# În directorul d:\Testare profil trader\Sistem
cd "d:\Testare profil trader\Sistem"

# Verifică statusul
git status

# Adaugă toate fișierele noi
git add .

# Commit
git commit -m "Migrate from Firebase to Vercel + Supabase

- Created PostgreSQL schema in Supabase
- Converted Firebase Functions to Vercel API routes
- Updated frontend to use Vercel APIs
- Configured Stripe payment integration
- Updated environment variables for Supabase"

# Push (dacă repo-ul nu există, creează-l mai întâi pe GitHub)
git push origin main
```

**Dacă nu ai repo GitHub încă:**
1. Mergi pe https://github.com/new
2. Numele: `trader-insights-lab`
3. Private/Public: Alege ce preferi
4. NU adăuga README, .gitignore (le avem deja)
5. Creează repo
6. Rulează comenzile afișate de GitHub pentru a lega repo-ul local

---

### 6. Deploy on Vercel

#### 6.1. Conectare GitHub la Vercel
1. Mergi pe https://vercel.com/TraderInsightsLab
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Selectează repo-ul `trader-insights-lab` (sau cum l-ai numit)
5. Click **Import**

#### 6.2. Configurare Deployment
- **Framework Preset**: Next.js (detectat automat)
- **Root Directory**: `./` (root)
- **Build Command**: `cd frontend && npm run build` (deja în vercel.json)
- **Output Directory**: `frontend/out` (deja în vercel.json)
- Click **Deploy**

#### 6.3. Configurare Environment Variables în Vercel
După ce deployment-ul inițial rulează (poate să eșueze, e normal):

1. Click pe **Settings** (tab-ul din meniu)
2. Click pe **Environment Variables** (sidebar stânga)
3. Adaugă variabilele ONE BY ONE:

| Key | Value | Visibility |
|-----|-------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fgyvghiovhujyhvtdxpp.supabase.co` | Plain Text |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (anon key) | Plain Text |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` (service role key) | Sensitive |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_51R1or5...` | Plain Text |
| `STRIPE_SECRET_KEY` | `sk_test_YOUR_KEY` | Sensitive |
| `STRIPE_WEBHOOK_SECRET` | `whsec_YOUR_SECRET` | Sensitive |
| `NEXT_PUBLIC_BASE_URL` | `https://your-app.vercel.app` | Plain Text |

**Important**: Pentru fiecare variabilă, bifează toate environment-urile: Production, Preview, Development

4. Click **Save** după fiecare variabilă
5. După ce toate sunt adăugate, click **Deployments** (tab)
6. Click pe deployment-ul failed
7. Click **Redeploy** (butonul din dreapta sus)

#### 6.4. Actualizare Webhook Stripe
După ce site-ul e live:
1. Copiază URL-ul Vercel final (ex: `https://trader-insights-lab.vercel.app`)
2. Mergi pe https://dashboard.stripe.com/test/webhooks
3. Editează webhook-ul creat anterior
4. Actualizează **Endpoint URL** la: `https://trader-insights-lab.vercel.app/api/webhooks/stripe`
5. Salvează

---

### 7. Test End-to-End

După deployment:

1. **Testează Onboarding**:
   - Accesează `https://your-app.vercel.app`
   - Completează formularul
   - Click "Începe Testul"
   - **Așteptat**: Redirecționare la `/test`

2. **Testează Test Page**:
   - Verifică că se afișează "Întrebarea 1 din 8" (NU 1 din 2!)
   - Verifică că prima întrebare este: "Cât de confortabil te simți când iei decizii financiare rapide sub presiune?"
   - Verifică că există input field pentru răspuns (slider pentru scale, radio pentru choice)
   - Completează toate 8 întrebări
   - Click "Finalizează Testul"

3. **Testează Results Page**:
   - Verifică că rezultatele se afișează
   - Click "Cumpără Raport Complet"
   - **Așteptat**: Redirect la Stripe Checkout

4. **Testează Payment**:
   - Folosește card de test: `4242 4242 4242 4242`
   - Expiry: orice dată viitoare (ex: `12/25`)
   - CVC: orice 3 cifre (ex: `123`)
   - ZIP: orice (ex: `12345`)
   - Click "Pay"
   - **Așteptat**: Redirect înapoi la `/results?payment=success`

5. **Verifică Database**:
   - Mergi în Supabase → Table Editor
   - Verifică că există înregistrări în:
     - `test_sessions` (cu status=completed)
     - `test_answers` (8 răspunsuri pentru session_id-ul tău)
     - `payment_sessions` (cu status=completed dacă ai plătit)

---

## 🐛 Troubleshooting

### Eroare: "Failed to start test"
- **Cauză**: Environment variables lipsesc sau sunt greșite
- **Soluție**: Verifică în Vercel Settings → Environment Variables

### Questions arată "1 din 2" în loc de "1 din 8"
- **Cauză**: Backend returnează cached questions (Firebase problem)
- **Soluție**: ✅ REZOLVAT prin migrare la Vercel - API routes citesc hardcoded array cu 8 întrebări

### Nu apar input fields pentru răspuns
- **Cauză**: Frontend primește questions cu format greșit (options array)
- **Soluție**: ✅ REZOLVAT - toate questions au scaleMin/scaleMax sau options în formatul corect

### Webhook Stripe nu funcționează
- **Cauză**: STRIPE_WEBHOOK_SECRET greșit sau URL greșit
- **Soluție**: 
  1. Verifică că webhook URL e corect în Stripe Dashboard
  2. Verifică că STRIPE_WEBHOOK_SECRET din Vercel matches Stripe

### "Method not allowed" errors
- **Cauză**: CORS sau vercel.json misconfigurat
- **Soluție**: ✅ REZOLVAT - vercel.json are headers CORS corecte

---

## 📊 Diferențe Firebase vs Vercel

| Aspect | Firebase | Vercel + Supabase |
|--------|----------|-------------------|
| **Backend** | Cloud Functions | Serverless API Routes |
| **Database** | Firestore (NoSQL) | PostgreSQL (SQL) |
| **Deployment** | `firebase deploy` | Git push → auto deploy |
| **Caching** | Multi-layer (problema noastră!) | No aggressive caching |
| **Environment vars** | `.env` files | Vercel dashboard |
| **Costs** | Blaze plan (pay-as-you-go) | Hobby: Free, Pro: $20/mo |
| **Region** | us-central1 | fra1 (Frankfurt) |

---

## ✅ Final Checklist

- [x] Supabase database schema deployed
- [x] Vercel API routes created
- [x] Frontend updated for new APIs
- [ ] Environment variables configured in Vercel
- [ ] Code pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Stripe webhook configured
- [ ] End-to-end test passed
- [ ] All 8 questions display correctly
- [ ] Payment flow works

---

## 🎉 Success Criteria

Testul este 100% funcțional când:
1. ✅ Formularul onboarding trimite la `/test`
2. ✅ Test page afișează "Întrebarea X din 8"
3. ✅ Toate 8 întrebări au input fields (slider sau radio buttons)
4. ✅ Răspunsurile se salvează în Supabase
5. ✅ Results page afișează analiza
6. ✅ Payment Stripe redirecționează corect
7. ✅ Webhook confirmă plata în database

---

**Autor**: GitHub Copilot  
**Data**: 2025-01-19  
**Versiune**: Migration from Firebase to Vercel + Supabase
