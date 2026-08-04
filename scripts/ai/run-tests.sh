#!/bin/bash
# Lance la suite de tests. Aujourd'hui, aucun framework de test n'est configuré
# (voir docs/ai/ROADMAP.md, priorité n°1) : ce script le signale clairement au
# lieu de rendre un faux succès.
set -e
cd "$(dirname "$0")/../.."

if [ ! -d "__tests__" ] && ! grep -q '"test"' package.json; then
  echo "Aucun framework de test configuré (pas de script \"test\" dans package.json)."
  echo "Voir docs/ai/ROADMAP.md — priorité n°1 : tests sur lib/reimbursementEngine.ts."
  exit 1
fi

npm test
