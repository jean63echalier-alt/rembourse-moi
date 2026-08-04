#!/bin/bash
# Rapport de fin de cycle : agrège audit + qualité + tests dans un seul fichier daté.
set -e
cd "$(dirname "$0")/../.."

OUT="docs/ai/reports/$(date +%Y-%m-%d).md"
mkdir -p docs/ai/reports

{
  echo "# Rapport — $(date +%Y-%m-%d)"
  echo
  echo "## Audit"
  echo '```'
  bash scripts/ai/audit-project.sh
  echo '```'
  echo
  echo "## Qualité"
  echo '```'
  bash scripts/ai/check-quality.sh || true
  echo '```'
  echo
  echo "## Tests"
  echo '```'
  bash scripts/ai/run-tests.sh || true
  echo '```'
} > "$OUT"

echo "Rapport généré : $OUT"
