# AI_CONTEXT — rembourse-moi

> Snapshot d'architecture pour onboarding rapide (humain ou agent). Mis à jour à chaque changement structurel important, pas à chaque commit.

## Stack

- Expo SDK 54 (`~54.0.35`), New Architecture activée (`newArchEnabled: true`)
- Expo Router 6, typed routes activées
- React 19.1 / React Native 0.81.5
- NativeWind 4 (Tailwind pour RN) — `global.css` + `tailwind.config.js`
- Icônes : `lucide-react-native`
- État : React Context (pas de Redux/Zustand) + AsyncStorage pour la persistance locale
- Pas de backend, pas d'auth — l'app est 100% locale (mock data + calculs on-device)

## Domaine métier

App de suivi de remboursements mutuelle pour une famille. Concepts clés (`types/index.ts`) :

- `FamilyMember` : un proche, avec son `MutuelleContractInfo` (garanties, taux, plafonds)
- `GuaranteeLine` : une ligne de garantie (catégorie, taux de remboursement, plafond en montant ou en séances)
- `Reimbursement` : une demande de remboursement (statut `pending` / `reimbursed` / `action_required`)
- Le cœur de calcul vit dans `lib/reimbursementEngine.ts` :
  - `estimateReimbursement` — calcule le reste à charge pour une nouvelle facture en tenant compte du plafond déjà consommé
  - `computeGuaranteeUsage` — consommation d'un plafond, uniquement sur les remboursements `reimbursed` (un dossier en attente ne consomme pas encore le plafond)
  - `buildCoverageDiagnostic` — détecte sur-couverture / sous-couverture en comparant dépense réelle et plafond du contrat

## Structure

```
app/(tabs)/        écrans (index, mutuelle, family, scan, profile) — Expo Router
components/        UI partagée + components/mutuelle/ (flows métier)
context/           3 providers : Reimbursement, BankSync, Profile
lib/               reimbursementEngine.ts (calcul) + generateReimbursementPdf.ts
data/mockData.ts   données de démo
types/index.ts     modèle de domaine
```

## État des lieux (audit du 2026-08-04)

- Pas de tests (aucun framework configuré) — priorité n°1 pour `lib/reimbursementEngine.ts`, qui est le code à plus fort impact business
- Pas de backend : toute donnée est locale à l'appareil (AsyncStorage), pas de sync multi-appareil
- `npx tsc --noEmit` : aucune erreur à ce jour
- Un garde-fou a été ajouté dans `context/ReimbursementContext.tsx` pour ignorer un cache AsyncStorage d'un ancien format de schéma (évite un crash au démarrage)

## Où regarder en premier selon le type de tâche

| Type de tâche | Fichiers concernés |
|---|---|
| Calcul de remboursement / plafonds | `lib/reimbursementEngine.ts`, `types/index.ts` |
| Écran / UI | `app/(tabs)/*.tsx`, `components/` |
| Persistance locale | `context/*.tsx` (AsyncStorage) |
| Export PDF | `lib/generateReimbursementPdf.ts` |
