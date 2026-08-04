# ROADMAP — rembourse-moi

> Priorités identifiées, pas un backlog exhaustif. Réordonné à chaque cycle si l'impact/effort/risque change.

## Priorité 1 — Fiabilité du cœur métier

- Ajouter des tests unitaires sur `lib/reimbursementEngine.ts` (aucun framework de test configuré actuellement). C'est le code qui calcule de l'argent réel pour l'utilisateur — le plus haut risque du projet en l'absence de tests.

## Priorité 2 — Commit du travail en cours

- Committer le fix de validation de schéma dans `context/ReimbursementContext.tsx` (actuellement en modification non commitée).

## À surveiller / vérifier (pas encore des bugs confirmés)

- Pas de backend / sync multi-appareil : à confirmer si c'est un choix assumé pour ce stade du produit ou une limite à lever bientôt.
