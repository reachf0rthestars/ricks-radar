---
id: docs-audit-checklist
title: Docs Audit Checklist
---

## Document Metadata
- Owner: Docs Maintainer
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
A maintainer checklist to run before merging documentation updates into branch `docs`.

## Why It Exists
This creates a consistent quality bar across all docs updates.

## Checklist
- [ ] All changed pages include metadata header (Owner, Last-Verified, Review-Cadence, Status).
- [ ] All code snippets reflect current repository behavior.
- [ ] Firebase links point to official docs.
- [ ] Branch/deploy instructions still match workflow files.
- [ ] Known pitfalls list includes current rule and runtime constraints.
- [ ] Broken links scan passes.
- [ ] Docusaurus build passes.
- [ ] Docs deployment workflow changes (if any) were tested.

## Subagent Audit Checklist
- [ ] Subagent A report included (HTML/CSS drift).
- [ ] Subagent B report included (JS/data-flow drift).
- [ ] Subagent C report included (Firebase/rules/deploy drift).
- [ ] Subagent D report included (links/stale/duplicates).
- [ ] Conflicts between reports resolved in final docs PR summary.

## Annotated Snippet
```yaml
name: Deploy Docs to Firebase Hosting
on:
  push:
    branches: [docs]
```
- Ensures docs deploy only from the docs branch.
- Prevents docs updates from altering production app deploy behavior.

## Common Mistakes
- Running checklist mentally instead of marking items in PR description.
- Merging docs without confirming build output.

## Official Docs Links
- Firebase Hosting deploy action: https://github.com/FirebaseExtended/action-hosting-deploy
- GitHub Actions workflow syntax: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions
- Firebase Hosting docs: https://firebase.google.com/docs/hosting
