# DECISIONS — rembourse-moi

> Décisions structurantes et leur raison d'être. Sert à éviter de re-débattre un choix déjà tranché sans nouvelle information.

## 2026-08-04 — Suppression du dossier dupliqué `rembourse-moi/rembourse-moi/`

**Décision** : supprimer le clone imbriqué trouvé à la racine du repo.
**Raison** : artefact de bootstrap (probablement `create-expo-app` relancé dans le mauvais dossier). Vérifié avant suppression : même remote GitHub, working tree clean, 3 commits en retard sur le repo principal, aucun travail unique dedans.
**Validé par** : Jean, 2026-08-04.

## 2026-08-04 — Pas d'ajout de framework de test dans cette intervention

**Décision** : signaler l'absence de tests sur `reimbursementEngine.ts` dans ROADMAP.md plutôt que d'ajouter `jest-expo` immédiatement.
**Raison** : ajouter une dépendance de test est un choix structurant (mainteneur du projet à consulter) et sort du périmètre de l'installation de la gouvernance IA demandée. À faire en premier cycle autonome si validé par Jean.
**Statut** : révisée le même jour, voir entrée ci-dessous.

## 2026-08-04 — Révision : ajout de `jest-expo` lors du premier cycle autonome

**Décision** : revenir sur la décision précédente et ajouter `jest-expo`/`jest`/`@types/jest` avec des tests sur `lib/reimbursementEngine.ts`, dès le premier cycle autonome plutôt que d'attendre.
**Raison** :
- `reimbursementEngine.ts` est le cœur métier de l'app : il calcule les remboursements réels affichés à l'utilisateur.
- Le risque utilisateur (mauvais calcul de remboursement, mauvaise estimation du reste à charge) justifie une couverture automatique plutôt qu'une simple mention dans ROADMAP.md.
- La consultation "mainteneur du projet" évoquée dans la décision initiale a eu lieu au moment du premier cycle autonome (validation de Jean) — la condition qui bloquait l'ajout immédiat n'existe donc plus.
**Validé par** : Jean, 2026-08-04.

## 2026-08-04 — Investigation en attente : traitement de `capAmount`/`capSessions === 0` dans `buildCoverageDiagnostic`

**Constat (audit, pas encore un bug confirmé)** : `buildCoverageDiagnostic` teste `guarantee.capAmount` / `guarantee.capSessions` en valeur de vérité (`if (... && guarantee.capAmount)`) plutôt qu'en `!= null` comme le fait `computeGuaranteeUsage`. Si un plafond vaut `0` (garantie déjà totalement épuisée dès la configuration du contrat), `0` est falsy → la condition échoue → `pctUsed = null` → verdict `adaptee` ("Bien adaptée", badge vert) **au lieu de** `sous-couverture` (badge rouge) qui serait attendu pour un plafond à 0.
**Pourquoi ce n'est pas encore traité** : je ne sais pas si `capAmount: 0` / `capSessions: 0` est une valeur réaliste dans les contrats gérés par l'app (aucune occurrence dans `data/mockData.ts` actuellement). Écrire un test maintenant figerait soit le comportement actuel (potentiellement incorrect), soit nécessiterait de modifier `reimbursementEngine.ts` — hors du périmètre validé pour ce cycle (tests uniquement, aucune modification de la logique de production).
**Décision à prendre** : Jean doit confirmer si ce cas est possible en pratique. Si oui → corriger `buildCoverageDiagnostic` pour utiliser `!= null` (comme `computeGuaranteeUsage`) puis ajouter un test de non-régression. Si non → documenter que ce cas n'est pas modélisé et fermer ce point.
**Statut** : ouvert, en attente de décision.
