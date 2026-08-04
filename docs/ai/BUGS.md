# BUGS — rembourse-moi

> Un bug = une ligne quand il est trouvé, déplacée vers "Résolus" avec la référence du commit qui le corrige. Ne pas garder de bugs "peut-être" ici — si ce n'est pas reproduit, ça va dans ROADMAP.md comme point à vérifier.

## Ouverts

_Aucun bug ouvert connu au 2026-08-04._

## Résolus

- **2026-08-04** — Crash potentiel au démarrage si le cache AsyncStorage de `familyMembers` provient d'une version antérieure du schéma (sans `contract.guarantees`). Fix : validation de forme avant utilisation dans `context/ReimbursementContext.tsx` (`isValidFamilyMembers`).
