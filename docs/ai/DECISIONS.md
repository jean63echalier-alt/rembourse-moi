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
