# Al Maroua Bakery - Frontend

Petit site vitrine/menu pour **Al Maroua Bakery** (Azzaba), construit en SPA avec React + TypeScript + Vite.

L'objectif est simple:
- presenter la boulangerie/patisserie
- afficher un menu lisible sur mobile
- permettre un contact rapide (WhatsApp / telephone)

## Stack technique

- React 19
- TypeScript
- Vite
- React Router
- CSS classique (sans framework UI)

## Installation

Pre-requis:
- Node.js 20+ recommande
- npm

```bash
npm install
```

## Lancer en local

```bash
npm run dev
```

Application dispo en general sur `http://localhost:5173`.

## Scripts utiles

- `npm run dev` : serveur de dev Vite
- `npm run build` : build production (`tsc -b` + bundle Vite)
- `npm run preview` : previsualiser le build localement
- `npm run lint` : verifier le code avec ESLint

## Structure du projet

```txt
src/
  components/
    Layout.tsx
    Layout.css
  config/
    shop.ts
  data/
    menu.ts
    menuImages.ts
  pages/
    Home.tsx
    Home.css
    Menu.tsx
    Menu.css
  utils/
    money.ts
  App.tsx
  main.tsx
  index.css
```

### Notes de structure

- `config/shop.ts` centralise les infos repetitives (contact, horaires, titres de page).
- `data/menu.ts` contient la carte.
- `data/menuImages.ts` contient un mapping manuel des images par categorie.
- `pages/*` contient le contenu de chaque route.

## Deploiement

Le projet est un SPA avec `BrowserRouter`.

Le fichier `public/_redirects` est present pour les hebergeurs type Netlify:
- toutes les routes (`/menu`, etc.) retombent sur `index.html`.

Flux recommande:
1. `npm run build`
2. deployer le contenu de `dist/`
3. verifier que la redirection SPA est bien active cote hebergeur

## Evolutions possibles

- remplacer les images externes par de vraies photos de la boutique
- brancher le menu sur un petit back-office (ou JSON externe)
- ajouter tests de base (render des pages + routes)
- ajouter une version arabe/francaise si besoin
- ajouter un mini module de disponibilite "rupture / dispo aujourd'hui"
