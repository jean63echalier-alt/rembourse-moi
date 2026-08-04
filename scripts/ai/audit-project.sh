#!/bin/bash
# Snapshot rapide de l'état du projet : git, typecheck, structure.
set -e
cd "$(dirname "$0")/../.."

echo "## Git"
git status --short
echo "Branche : $(git branch --show-current)"
echo

echo "## Typecheck"
npx tsc --noEmit && echo "OK — aucune erreur"
echo

echo "## Fichiers volumineux (>200 lignes) dans app/ lib/ context/ components/"
find app lib context components -type f \( -name "*.ts" -o -name "*.tsx" \) -exec wc -l {} \; | awk '$1 > 200'
