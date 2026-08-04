# DECISIONS — rembourse-moi

> Décisions structurantes et leur raison d'être. Sert à éviter de re-débattre un choix déjà tranché sans nouvelle information.

## 2026-08-04 — Suppression du dossier dupliqué `rembourse-moi/rembourse-moi/`

**Décision** : supprimer le clone imbriqué trouvé à la racine du repo.
**Raison** : artefact de bootstrap (probablement `create-expo-app` relancé dans le mauvais dossier). Vérifié avant suppression : même remote GitHub, working tree clean, 3 commits en retard sur le repo principal, aucun travail unique dedans.
**Validé par** : Jean, 2026-08-04.

## 2026-08-04 — Pas d'ajout de framework de test dans cette intervention

**Décision** : signaler l'absence de tests sur `reimbursementEngine.ts` dans ROADMAP.md plutôt que d'ajouter `jest-expo` immédiatement.
**Raison** : ajouter une dépendance de test est un choix structurant (mainteneur du projet à consulter) et sort du périmètre de l'installation de la gouvernance IA demandée. À faire en premier cycle autonome si validé par Jean.
