# AGENTS.md — rembourse-moi

Règles permanentes pour tout agent (Claude Code ou autre) travaillant sur ce projet.

## Contexte à lire avant de coder

1. `docs/ai/AI_CONTEXT.md` — architecture, stack, domaine métier
2. `docs/ai/BUGS.md` — bugs connus (ouverts et résolus)
3. `docs/ai/ROADMAP.md` — priorités actuelles
4. `docs/ai/DECISIONS.md` — décisions déjà tranchées, à ne pas re-débattre sans fait nouveau

## Expo a changé

Lire la doc versionnée exacte sur https://docs.expo.dev/versions/v54.0.0/ avant d'utiliser une API Expo — ne pas se fier à une connaissance générale d'Expo qui peut être obsolète.

## Priorité : stabilité

- `lib/reimbursementEngine.ts` est le code le plus critique du projet : il calcule de l'argent réel pour l'utilisateur. Toute modification y touchant doit être plus prudente qu'ailleurs (raisonnement explicite sur les cas limites : plafond atteint, garantie absente, remboursement en attente vs validé).
- Préférer un petit changement sûr à une refonte, sauf si Jean demande explicitement une refonte.
- Ne jamais supprimer une fonctionnalité existante sans validation explicite.

## Approche

- Ingénieur senior pragmatique : résoudre le problème demandé, pas plus. Pas d'abstraction pour un besoin hypothétique futur.
- Pas de nouvelle dépendance sans justification courte (impact sur la taille du bundle Expo à considérer).
- Si une information manque pour avancer correctement, la lister brièvement et proposer la meilleure hypothèse sûre plutôt que de deviner en silence.

## Git

- Ne jamais commit/push directement sur `main` pour un changement non trivial — travailler sur une branche (convention observée : `claude/<sujet>`).
- Un commit = un changement logique cohérent. Message clair sur le "pourquoi", pas juste le "quoi".
- Toujours vérifier `git status` avant une opération destructive (checkout/restore/reset/clean).

## Tests

- Il n'y a aujourd'hui aucun framework de test configuré (voir `docs/ai/ROADMAP.md`, priorité n°1). Avant d'ajouter du code dans `lib/`, vérifier si un test existe déjà pour la fonction touchée ; sinon le signaler plutôt que de laisser passer silencieusement.
- Faire tourner `scripts/ai/check-quality.sh` après toute modification (typecheck + lint).

## Autonomie

- Action évidente et réversible (lecture, typecheck, lint, edit de fichier suivi de test) → agir directement.
- Action destructive (suppression de fichier/dossier non trivial, `git reset`/`push --force`, suppression de dépendance) → confirmer avec Jean avant, même si le contexte semble l'autoriser.
- Si une découverte pendant le travail change la priorité en cours (ex: bug bloquant trouvé), le signaler avant de continuer plutôt que de dévier silencieusement.

## Communication

- Français par défaut.
- Concis : cause → changement → diff → tests, pas de pavé narratif.
- Toute réponse technique se termine par une phrase "Résumé simple" compréhensible sans jargon.

## Boucle d'amélioration continue

```
OBSERVE → UNDERSTAND → IDENTIFY → PRIORITIZE → IMPLEMENT → TEST → DOCUMENT → LEARN → REPEAT
```

À chaque cycle :
1. Lire `docs/ai/ROADMAP.md` et `docs/ai/BUGS.md` pour l'état courant.
2. Choisir l'action au meilleur ratio impact utilisateur / effort / risque.
3. Implémenter en petit changement testable.
4. Faire tourner `scripts/ai/check-quality.sh` (et `run-tests.sh` une fois des tests présents).
5. Mettre à jour `docs/ai/CHANGELOG_AI.md` (et `BUGS.md`/`DECISIONS.md` si pertinent).
