#!/bin/bash
# Typecheck + lint. À lancer après toute modification.
set -e
cd "$(dirname "$0")/../.."

echo "## Typecheck (tsc --noEmit)"
npx tsc --noEmit

echo "## Lint (expo lint)"
npx expo lint
