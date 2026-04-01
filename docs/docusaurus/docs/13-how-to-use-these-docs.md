---
id: 13-how-to-use-these-docs
title: How to Use These Docs
---

## Document Metadata
- Owner: Docs Maintainer
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
A short orientation for readers moving between the conceptual guides and the new reference pages.

## How to Read This Site
- Start with [System Overview](./02-system-overview) if you want the app architecture first.
- Use [Repo Tour](./03-repo-tour) when you want to map folders to responsibilities.
- Use [Page Deep Dives](./08-page-deep-dives) when you need HTML-to-JS wiring and page behavior.
- Use the module reference pages for function-level details, side effects, and selector contracts.
- Start with [Firebase Bootstrap and Services](./reference/shared/shared-firebase-config), [Shared Auth and Profile Helpers](./reference/shared/shared-auth-profile), and [Shared Navigation and Menu System](./reference/shared/shared-menu) for the shared-layer API surface.
- Use [index-page.js](./reference/pages/index-page), [login-page.js](./reference/pages/login-page), and [account-page.js](./reference/pages/account-page) for page-controller details.

## Documentation Layers
### Conceptual guides
These explain the system at a higher level:
- glossary and architecture
- HTML/CSS/JavaScript foundations
- Firebase, Firestore, Storage, and hosting
- page-by-page behavior and troubleshooting

### Reference pages
These describe the actual modules and page controllers:
- exported functions and constants
- internal helpers and event handlers
- DOM selectors, redirects, and Firebase reads or writes
- current limitations and stubs

## How to Use Cross-Links
- Follow conceptual links when you need background.
- Follow reference links when you need exact behavior or signatures.
- When a page says a feature is stubbed, treat that as the source of truth until the implementation exists.

## Good Starting Points
- [Glossary](./01-glossary)
- [System Overview](./02-system-overview)
- [Page Deep Dives](./08-page-deep-dives)
- [HTML-to-JS DOM Contracts](./14-html-js-dom-contracts)
- [Service Status and Stubs](./15-service-status-and-stubs)
- [Documentation Playbook](./documentation-playbook)
