# Cadet AF Tracker

App de suivi de préparation à la sélection pilote Cadet Air France (PSY0 / PSY1 / PSY2).

## Stack
- **Frontend** : React + Vite
- **Base de données** : Supabase
- **Hébergement** : Vercel

## Déploiement

### 1. Clone le repo en local
```bash
git clone https://github.com/TON_USERNAME/cadet.git
cd cadet
npm install
npm run dev
```

### 2. Push sur GitHub
```bash
git add .
git commit -m "init cadet tracker"
git push origin main
```

### 3. Connecte Vercel à GitHub
- Va sur vercel.com → Import project → sélectionne le repo `cadet`
- Framework preset : **Vite**
- Clique Deploy

C'est tout. Vercel redéploie automatiquement à chaque push.

## Structure
```
src/
  main.jsx      → Entry point React
  App.jsx       → App principale (UI complète)
  data.js       → Constantes (épreuves, planning, questions)
  supabase.js   → Client Supabase
  db.js         → Fonctions lecture/écriture Supabase
```
