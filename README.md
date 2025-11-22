# Events WebMobi Automation Agent

[![CI](https://github.com/rishabh0282/webmobi-test-automation/actions/workflows/ci.yml/badge.svg)](https://github.com/rishabh0282/webmobi-test-automation/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/Pages-Live_Report-blue?logo=github)](https://rishabh0282.github.io/webmobi-test-automation/)

Automated testing agent built with Playwright that logs in to events.webmobi.com, creates events, and validates the results.

## Features

- ✅ Automated authentication with environment variables
- ✅ Event creation with unique timestamps
- ✅ Event validation in the events list
- ✅ Evidence capture (screenshots, videos, traces)
- ✅ HTML test reports
- ✅ CI/CD integration with GitHub Actions
- ✅ GitHub Pages report publishing

## Known Issues (Summary)

- Delete Event not persisting in UI despite backend `204` response  
- Heading locator mismatch (accessibility roles missing)  
- Credits exceed quota (63/50, automation still works)  

Full details in [Issues-Test-Report](./Issues-Test-Report.md)



## Prerequisites

- Node.js 20 or higher
- npm or yarn

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rishabh0282/webmobi-test-automation.git
   cd webmobi-test-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install chromium
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   LOGIN_EMAIL=your-email@example.com
   LOGIN_PASSWORD=your-password
   ```
   
   The `.env` file is automatically loaded by dotenv when running tests. You can also set these as environment variables directly:
   ```bash
   export LOGIN_EMAIL=your-email@example.com
   export LOGIN_PASSWORD=your-password
   ```

   On Windows (PowerShell):
   ```powershell
   $env:LOGIN_EMAIL="your-email@example.com"
   $env:LOGIN_PASSWORD="your-password"
   ```

## Running Tests

### Run all tests (headless)
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### View HTML report
```bash
npm run report
```

## Test Structure

- **`tests/auth.spec.ts`**: Authentication tests
  - Logs in using credentials from environment variables
  - Validates successful login by checking for dashboard elements

- **`tests/event.spec.ts`**: Event creation and validation tests
  - Creates an event with a unique timestamp-based title
  - Fills required fields (title, date, time, description)
  - Validates the event appears in the events list

## Configuration

The Playwright configuration (`playwright.config.ts`) includes:

- **Base URL**: `https://events.webmobi.com`
- **Headless mode**: Enabled by default
- **Tracing**: Enabled on first retry
- **Screenshots**: Captured on failure
- **Videos**: Retained on failure
- **HTML Reporter**: Generates reports in `playwright-report/`

## CI/CD

### GitHub Actions

The workflow (`.github/workflows/ci.yml`) automatically:

1. Runs tests on push/PR to main/master branches
2. Uploads artifacts:
   - HTML report
   - Test results
   - Trace files
   - Videos
   - Screenshots
3. Publishes HTML report to GitHub Pages

### Setting up GitHub Secrets

For CI/CD to work, add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `LOGIN_EMAIL`: Your login email
   - `LOGIN_PASSWORD`: Your login password

### GitHub Pages Setup

To enable GitHub Pages publishing:

1. Go to **Settings** → **Pages**
2. Set source to **GitHub Actions**
3. The workflow will automatically deploy the HTML report after each run

## Test Reports

### Local Reports

After running tests, view the HTML report:
```bash
npm run report
```

This opens the report in your default browser.

### CI Reports

- **Artifacts**: Download from the GitHub Actions run page
- **GitHub Pages**: View the live report at:
  ```
  https://<username>.github.io/<repository-name>/
  ```

## Evidence Capture

The following evidence is automatically captured:

- **Screenshots**: On test failure
- **Videos**: On test failure (retained)
- **Traces**: On first retry (interactive debugging)
- **Logs**: Console logs for key steps (auth start, event title, validation)

## Troubleshooting

### Tests fail to find elements

The tests use flexible selectors to adapt to different page structures. If tests fail:

1. Check the HTML report for screenshots
2. Review the trace files for interactive debugging
3. Update selectors in test files if the page structure has changed

### Authentication fails

- Verify `LOGIN_EMAIL` and `LOGIN_PASSWORD` are set correctly
- Check that the login page structure matches expected selectors
- Review screenshots/videos in the test report

### Event creation fails

- Verify you're logged in successfully
- Check that the event creation form fields match expected selectors
- Review the trace files to see what happened during form submission

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions workflow
├── tests/
│   ├── auth.spec.ts            # Authentication tests
│   └── event.spec.ts           # Event creation and validation tests
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Dependencies and scripts
├── .env.example                 # Example environment variables
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## License

MIT

