# CHANGELOG_AI — rembourse-moi

> Journal des interventions de Claude Code sur ce projet. Une entrée par intervention notable, pas par commit.

## 2026-08-04 — Installation de la gouvernance IA

- Audit complet du projet (stack, structure, domaine métier, risques) — voir `AI_CONTEXT.md`
- Suppression du dossier dupliqué `rembourse-moi/rembourse-moi/` (clone imbriqué non tracké, 3 commits en retard sur le repo principal, même remote, aucun travail unique — vérifié avant suppression)
- Mise en place du système de mémoire IA (`docs/ai/`) et des règles permanentes (`AGENTS.md`)
- Ajout des scripts `scripts/ai/` (audit, qualité, tests, rapport)

## 2026-08-04 — Premier cycle autonome : tests sur le moteur de calcul

- Ajout de `jest-expo`/`jest`/`@types/jest` (`npx expo install --dev`, versions SDK 54)
- `package.json` : script `test`, config `jest.preset = jest-expo`
- 10 tests unitaires sur `lib/reimbursementEngine.ts` — tous verts, `tsc --noEmit` et `expo lint` propres

## 2026-08-04 — Deuxième cycle autonome : couverture de `getExpiringGuarantees` et `daysUntilYearEnd`

- Suite à l'audit "Phase 1" : ces deux fonctions alimentent l'alerte fin d'année de l'écran d'accueil (`app/(tabs)/index.tsx`) et n'avaient aucun test — plus haut risque financier identifié (perte de garanties non consommées avant le 31/12).
- 10 nouveaux tests ajoutés dans `lib/reimbursementEngine.test.ts` (aucune modification de `lib/reimbursementEngine.ts`) : garantie avec reste disponible incluse (montant et séances), garantie épuisée exclue (montant et séances), `capType: 'none'` exclue, remboursement `pending` ne réduit pas le restant, filtrage correct sur un contrat mixte à 5 garanties, `daysUntilYearEnd` avec date injectée (31 décembre, 1er janvier, 3 jours avant la fin).
- Suite complète : 20/20 tests verts, `tsc --noEmit` et `expo lint` propres, aucune régression sur les 10 tests précédents.
