---
id: shared-messages
title: Shared Status Messages
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## Purpose
This module standardizes small inline status messages used by auth and profile forms.

## Where It Is Used
- `public/backend/pages/login-page.js`
- `public/backend/pages/create-account-page.js`
- `public/backend/pages/account-page.js`

## Imports and Dependencies
- No external imports.
- Depends on a message container element with `textContent` and `style` support.

## Exported API
### `setStatusMessage(messageEl, text = "", type = "error")`
Sets or clears the text and color of a message element.

Behavior:
- Clears the element when `text` is empty.
- Uses green for `success`.
- Uses blue for `info`.
- Uses red for the default error state.

## Internal Helpers
There are no private named helpers in this module.

## Side Effects
- Mutates the provided DOM element's `textContent` and inline `style.color`.

## DOM / Firebase Dependencies
- Requires a message element node.
- No Firebase dependency.

## Failure Modes
- If `messageEl` is missing, the function returns without throwing.
- If callers pass an element without mutable `style`, the color update can fail in non-DOM test environments.
- The helper is intentionally lightweight; it does not manage ARIA attributes or message history.

## Implementation Status
- Implemented and stable for the current app.
