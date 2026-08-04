# ROADMAP — rembourse-moi

> Priorités identifiées, pas un backlog exhaustif. Réordonné à chaque cycle si l'impact/effort/risque change.

## Fait — 2026-08-04

- ✅ Ajout de `jest-expo` + 10 tests unitaires sur `lib/reimbursementEngine.ts` (`estimateReimbursement`, `computeGuaranteeUsage`, `isReimbursementOverdue`, `buildCoverageDiagnostic`). `npm test` disponible.
- ✅ Commit du fix de validation de schéma dans `context/ReimbursementContext.tsx`.

## Priorité 1 — Étendre la couverture de tests

- Tester `getExpiringGuarantees` (alertes plafond en fin d'année) — non couvert, utilisé pour les relances utilisateur.
- Tester `daysUntilYearEnd` — non couvert, base de calcul des alertes de fin d'année.
- Tester le verdict par défaut `adaptee` de `buildCoverageDiagnostic` — seuls les verdicts `sur-couverture`/`sous-couverture` sont couverts actuellement, le cas nominal ne l'est pas.
- `generateReimbursementPdf.ts` non couvert.
- Les tests actuels ne couvrent que `lib/`. Aucun test sur les contexts (`AsyncStorage`) ni les écrans.

## À surveiller / vérifier (pas encore des bugs confirmés)

- Pas de backend / sync multi-appareil : à confirmer si c'est un choix assumé pour ce stade du produit ou une limite à lever bientôt.
