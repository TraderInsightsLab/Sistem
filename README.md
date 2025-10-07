# TraderInsightsLab - Platformă de Evaluare Psihologică pentru Traderi

Această platformă oferă o experiență de testare interactivă, fundamentată pe un model de Inteligență Artificială, care analizează profilul utilizatorului pentru a determina potrivirea cu tradingul, stilul optim, punctele forte și slabe.

## Arhitectura Sistemului

### Frontend (Next.js 14)
- **Framework**: Next.js cu App Router
- **Styling**: Tailwind CSS + shadcn/ui components  
- **State Management**: Zustand
- **Deployment**: Firebase Hosting

### Backend (Google Cloud Functions)
- **Runtime**: Node.js 20 cu TypeScript
- **Database**: Firestore pentru sesiuni de testare
- **Storage**: Cloud Storage pentru rapoarte PDF
- **AI**: Vertex AI pentru analiza psihologică

### Servicii Externe
- **Plăți**: Stripe pentru procesarea plăților
- **Email**: SendGrid pentru trimiterea rapoartelor
- **PDF**: Puppeteer pentru generarea rapoartelor

## Instalare și Configurare

### Cerințe
- Node.js 20+
- Firebase CLI
- Google Cloud CLI (gcloud)
- Conturi: Firebase, Stripe, SendGrid, Vertex AI

### 1. Clonarea și Instalarea

```bash
# Clonează repository-ul
git clone https://github.com/TraderInsightsLab/Sistem.git
cd Sistem

# Instalează dependențele frontend
cd frontend
npm install

# Instalează dependențele backend
cd ../backend
npm install
```

### 2. Configurarea Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/trader-insights-lab/us-central1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
NODE_ENV=development
```

#### Backend (.env)
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
SENDGRID_API_KEY=SG.your_sendgrid_api_key
VERTEX_AI_PROJECT_ID=trader-insights-lab
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_MODEL_ID=gemini-pro
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
NODE_ENV=development
```

### 3. Configurarea Firebase

```bash
# Login în Firebase
firebase login

# Inițializează proiectul (dacă nu e deja inițializat)
firebase init

# Configurează Firestore și Storage
firebase firestore:rules:deploy
firebase storage:rules:deploy
```

### 4. Configurarea Google Cloud

```bash
# Autentificare Google Cloud
gcloud auth login
gcloud config set project trader-insights-lab

# Activează serviciile necesare
gcloud services enable aiplatform.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
```

### 5. Dezvoltare Locală

```bash
# Terminal 1: Start Firebase emulators
firebase emulators:start

# Terminal 2: Start frontend development server
cd frontend
npm run dev

# Terminal 3: Build și deploy functions local (opțional)
cd backend
npm run serve
```

## Deployment în Producție

### 1. Configurarea Environment Variables pentru Producție

```bash
# Setează environment variables pentru Cloud Functions
firebase functions:config:set \
  stripe.secret_key="sk_live_your_stripe_secret_key" \
  stripe.webhook_secret="whsec_your_webhook_secret" \
  sendgrid.api_key="SG.your_sendgrid_api_key" \
  vertex.project_id="trader-insights-lab" \
  vertex.location="us-central1" \
  vertex.model_id="gemini-pro"
```

### 2. Build și Deploy

```bash
# Build frontend pentru producție
cd frontend
npm run build

# Deploy backend functions
cd ../backend
npm run deploy

# Deploy frontend la Firebase Hosting
firebase deploy --only hosting

# Deploy database rules
firebase deploy --only firestore:rules,storage:rules
```

### 3. Configurarea DNS și Domeniu

```bash
# Adaugă domeniul custom în Firebase Hosting
firebase hosting:channel:deploy production
```

## Configurarea Serviciilor Externe

### Stripe
1. Creează cont Stripe și obține API keys
2. Configurează webhook endpoint: `https://your-domain.com/api/webhook/stripe`
3. Activează evenimentele: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

### SendGrid
1. Creează cont SendGrid și obține API key
2. Verifică domeniul pentru email-uri (reports@your-domain.com)
3. Configurează template-uri de email (opțional)

### Vertex AI
1. Activează Vertex AI API în Google Cloud Console
2. Configurează modelul Gemini Pro
3. Asigură-te că service account-ul are permisiuni pentru Vertex AI

## Monitoring și Logs

### Firebase Console
- Firestore pentru sesiuni de testare
- Cloud Functions logs pentru debugging
- Performance monitoring

### Google Cloud Console
- Vertex AI usage și costs
- Cloud Storage pentru rapoarte
- Error reporting

### Stripe Dashboard
- Plăți și webhooks
- Customer management
- Revenue analytics

## Securitate

### Firestore Rules
```javascript
// Utilizatorii pot accesa doar propriile sesiuni
match /testSessions/{sessionId} {
  allow read, write: if request.auth != null && 
    resource.data.userContext.email == request.auth.token.email;
}
```

### CORS și Headers
```javascript
// Cloud Functions CORS configuration
app.use(cors({
  origin: [
    'https://your-domain.com',
    'https://trader-insights-lab.firebaseapp.com'
  ],
  credentials: true
}));
```

### Environment Variables
- Nu committa niciodată API keys în repository
- Folosește Firebase Functions config pentru producție
- Restricționează domeniile în console-urile serviciilor

## Testing

### Unit Tests
```bash
cd backend
npm test
```

### Integration Tests
```bash
# Test cu emulatori Firebase
firebase emulators:exec "npm test"
```

### Load Testing
```bash
# Test performanță cu Artillery sau similar
npx artillery run load-test.yml
```

## Backup și Recovery

### Database Backup
```bash
# Export Firestore data
gcloud firestore export gs://your-backup-bucket/backups/$(date +%Y-%m-%d)
```

### Code Backup
- Repository backup pe GitHub
- Environment variables backup securizat
- Service account keys backup

## Troubleshooting

### Common Issues

1. **Cloud Functions timeout**
   - Mărește timeout-ul pentru generarea PDF
   - Optimizează Puppeteer settings

2. **Vertex AI rate limits**
   - Implementează retry logic
   - Monitorizează usage quotas

3. **Email delivery issues**
   - Verifică SendGrid domain authentication
   - Monitorizează bounce rates

4. **Payment failures**
   - Verifică Stripe webhook configuration
   - Testează cu Stripe test cards

### Logs și Debugging

```bash
# Vezi logs Cloud Functions
firebase functions:log

# Vezi logs specifice funcții
firebase functions:log --only processResults

# Vezi metrics în real-time
gcloud logging read "resource.type=cloud_function" --limit 50 --format json
```

## Performance Optimization

### Frontend
- Lazy loading pentru componente
- Image optimization
- Bundle analysis și code splitting

### Backend
- Connection pooling pentru Firestore
- Caching pentru răspunsuri frecvente
- Optimizarea size-ului bundlurilor

### Database
- Indexing pentru query-uri frecvente
- Cleanup job pentru sesiuni vechi
- Monitoring pentru hot spots

## Contributing

1. Fork repository-ul
2. Creează branch pentru feature (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push la branch (`git push origin feature/amazing-feature`)
5. Deschide Pull Request

## License

Acest proiect este licențiat sub MIT License - vezi fișierul [LICENSE](LICENSE) pentru detalii.

## Support

Pentru întrebări sau probleme:
- Email: support@traderinsightslab.com
- GitHub Issues: [Create new issue](https://github.com/TraderInsightsLab/Sistem/issues)
- Documentation: [Wiki](https://github.com/TraderInsightsLab/Sistem/wiki) 
