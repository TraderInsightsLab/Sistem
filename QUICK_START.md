# 🎯 TraderInsightsLab - Platform Setup

## ✅ Setup Complet (Vercel + Supabase Migration)

### Status Migrare
- ✅ Database: Supabase PostgreSQL
- ✅ Backend: Vercel Serverless API Routes
- ✅ Frontend: Next.js 15 cu Zustand store
- ✅ Payment: Stripe integration
- ⏳ Deployment: Ready for GitHub push

---

## 📋 Pași Rapidi

### 1. Verificare Environment Variables

Fișierul `.env.local` este configurat cu:
- ✅ Supabase URL și Keys
- ✅ Stripe Publishable și Secret Keys
- ⚠️ Stripe Webhook Secret (trebuie setat după deployment)

### 2. Push la GitHub

```bash
cd "d:\Testare profil trader\Sistem"
git add .
git commit -m "Migrate to Vercel + Supabase"
git push origin main
```

### 3. Deploy pe Vercel

1. Mergi pe https://vercel.com/TraderInsightsLab
2. Import project from GitHub
3. Configurează environment variables (vezi MIGRATION_GUIDE.md)
4. Deploy!

---

## 🔑 Environment Variables pentru Vercel

Copiază-le în Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://fgyvghiovhujyhvtdxpp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51R1or5GVlY8clYXh...
STRIPE_SECRET_KEY=sk_test_51R1or5GVlY8clYXh...
STRIPE_WEBHOOK_SECRET=whsec_... (după ce creezi webhook-ul)
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

---

## 📂 Structura Proiect

```
Sistem/
├── api/                    # Vercel Serverless Functions
│   ├── startTest.ts        # Inițializare test
│   ├── saveAnswer.ts       # Salvare răspunsuri
│   ├── processResults.ts   # Procesare rezultate
│   ├── createPaymentSession.ts  # Stripe checkout
│   └── webhooks/
│       └── stripe.ts       # Webhook confirmări plată
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/           # Pages (/, /test, /results)
│   │   ├── components/    # React components
│   │   ├── store/         # Zustand stores
│   │   └── data/          # Questions definition (8 questions)
│   └── package.json
├── supabase/
│   └── schema.sql         # Database schema (deployed)
├── .env.local             # Environment variables
├── vercel.json            # Vercel configuration
└── MIGRATION_GUIDE.md     # Detailed migration guide
```

---

## 🎮 Test Local (Dev Mode)

```bash
# Frontend
cd frontend
npm run dev
# Opens http://localhost:3000

# Backend (Vercel CLI pentru test local)
npm install -g vercel
vercel dev
```

---

## 🐛 Troubleshooting

Dacă întâmpini probleme, consultă **MIGRATION_GUIDE.md** section "Troubleshooting".

---

## 📊 8 Întrebări în Test

1. Scale (1-7): Confort decizii rapide
2. Scale (1-7): Plan structurat vs improvizație
3. Choice: Reacție la pierdere
4. Choice: Acțiune scăzută 15%
5. Choice: FOMO situație
6. Game: Pattern recognition (30s)
7. Game: Risk assessment (45s)
8. Game: Decision speed (60s)

**Toate folosesc format corect**: `scaleMin/scaleMax` pentru scale, `options` array pentru choice.

---

**Next Step**: Urmează instrucțiunile din **MIGRATION_GUIDE.md** pentru deployment pe Vercel! 🚀
