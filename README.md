# Playwright Test Automation Suite

This repository contains automated end‑to‑end tests built with [Playwright](https://playwright.dev/) to validate event flows in a web application.  
It covers authentication, session management, and event creation, with GitHub Actions integration for continuous testing.

---

## Features
- **Authentication tests**: Valid login, logout, and wrong password scenarios
- **Event flow tests**: Create new events and verify persistence in the events list
- **Session management**: Ensure protected routes are inaccessible without login
- **CI ready**: Minimal GitHub Action workflow to run tests on every push/PR

---

## Project Structure
- `utils/helpers.js` → reusable login, logout, and event creation helpers
- `tests/` → Playwright test cases (happy path, session management, wrong password)
- `.github/workflows/playwright.yml` → GitHub Action workflow for CI

---

## 🛠️ Setup & Run Locally
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Run tests
npx playwright test
```
---


## Known Issues (Summary)

- Delete Event not persisting in UI despite backend `204` response  
- Heading locator mismatch (accessibility roles missing)  
- Credits exceed quota (63/50, automation still works)  

Full details in [Test-Report.md](./Test-Report.md)
