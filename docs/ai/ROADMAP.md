# ROADMAP — rembourse-moi

> Priorités identifiées, pas un backlog exhaustif. Réordonné à chaque cycle si l'impact/effort/risque change.

## Fait — 2026-08-04

- ✅ Ajout de `jest-expo` + 10 tests unitaires sur `lib/reimbursementEngine.ts` (`estimateReimbursement`, `computeGuaranteeUsage`, `isReimbursementOverdue`, `buildCoverageDiagnostic`). `npm test` disponible.
- ✅ Commit du fix de validation de schéma dans `context/ReimbursementContext.tsx`.

## Priorité 1 — Étendre la couverture de tests

- `getExpiringGuarantees` et `generateReimbursementPdf.ts` ne sont pas encore couverts.
- Les tests actuels ne couvrent que `lib/`. Aucun test sur les contexts (`AsyncStorage`) ni les écrans.

## À surveiller / vérifier (pas encore des bugs confirmés)

- Pas de backend / sync multi-appareil : à confirmer si c'est un choix assumé pour ce stade du produit ou une limite à lever bientôt.
