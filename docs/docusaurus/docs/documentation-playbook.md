---
id: documentation-playbook
title: Documentation Playbook
---

## Document Metadata
- Owner: Docs Maintainer
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
The official process for keeping docs accurate, pruning stale content, and using subagents for rapid audits.

## Why It Exists
Documentation decays unless ownership and validation are explicit.

## How It Works Here
### Ownership model
- Frontend docs owner: HTML/CSS/JS pages and modules.
- Firebase docs owner: config, rules, emulators, deploy mapping.
- Release docs owner: GitHub workflows and branch deploy strategy.
- Docs maintainer: final merge authority for docs branch.

### Required metadata on every doc page
- Owner
- Last-Verified (YYYY-MM-DD)
- Review-Cadence (`weekly`, `monthly`, or `quarterly`)
- Status (`active`, `deprecated`, `archived`)

### Staleness detection rules
A page is stale if any is true:
- `Last-Verified` is older than its cadence.
- Commands fail or have changed.
- Linked file paths no longer exist.
- Workflow/rules behavior changed without docs update.
- Page duplicates another page without adding value.

### Verification commands
```powershell
npm ci
npm run build
npm run docs:build
npx.cmd -y firebase-tools@latest --version
npx.cmd -y firebase-tools@latest emulators:exec --only auth,firestore,storage,hosting "echo Emulator run complete"
```

### Link validation
Use a link checker in docs CI and fail on broken links:
```powershell
npx.cmd -y lychee --no-progress --exclude-mail README.md docs/**/*.md docs/docusaurus/docs/**/*.md
```

### Deprecate/archive/remove policy
1. Mark stale page `Status: deprecated` and link replacement.
2. Keep one release cycle.
3. Move to archive if still needed historically.
4. Remove only when no active references remain.

## Annotated Snippet
```powershell
npx.cmd -y lychee --no-progress --exclude-mail README.md docs/**/*.md docs/docusaurus/docs/**/*.md
```
- Uses `lychee` to catch broken links before merge.
- Scans root docs and Docusaurus docs paths used in this repo.
- Prevents stale official links from shipping.

## Subagent-Assisted Runbook
Run these in parallel and reconcile to one PR:
1. Subagent A (HTML/CSS drift):
   - Compares `public/*.html` and `public/css/*.css` with docs.
2. Subagent B (JS and data-flow drift):
   - Audits `public/backend/**/*.js` imports, events, redirects, and service calls.
3. Subagent C (Firebase/rules/deploy drift):
   - Audits `.firebaserc`, `firebase.json`, rules files, and `.github/workflows`.
4. Subagent D (link/stale/duplication audit):
   - Finds broken links, stale metadata dates, duplicate pages.

Each subagent output must include:
- Findings summary
- Proposed update/removal
- Confidence (0 to 1)
- File references

## Common Mistakes
- Updating code without updating the corresponding doc page.
- Merging docs with missing metadata headers.
- Allowing deprecated pages to stay indefinitely.

## Official Docs Links
- Firebase docs: https://firebase.google.com/docs
- Docusaurus docs: https://docusaurus.io/docs
- GitHub Actions docs: https://docs.github.com/actions
