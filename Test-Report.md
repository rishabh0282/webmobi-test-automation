# Bug Report: Event Management & Credit System Issues

## Summary
Automation testing of the **My Events** dashboard and credit system revealed multiple defects. While the backend DELETE API is now firing successfully (`204 No Content`), the frontend does not persist the deletion. Additional issues include accessibility locator mismatches and quota enforcement failures.

---

## Environment
- Application: WebMobi Dashboard  
- Module: Event Management / Credits  
- Browser: Playwright automation (Chromium)  
- Date: 21 Nov 2025  
- Tester: Rishabh Tiwari  

---

## Issues Found

### 1. Delete Event not persisting in UI
- **Steps to Reproduce**
  1. Navigate to **My Events**.  
  2. Open the 3‑dots menu for an event.  
  3. Click **Delete Event** and accept the browser confirm dialog.  
  4. Observe network traffic: `DELETE /api/events/:id` returns **204 No Content**.  
  5. Refresh the page.  
- **Expected Result**: Event should be permanently removed from the list after backend deletion.  
- **Actual Result**: Event reappears after refresh, despite successful API response.  
- **Impact**: Backend deletion works, but frontend state/UI reload logic is broken.  

---

### 2. Heading locator mismatch
- **Steps to Reproduce**
  1. Navigate to **My Events**.  
  2. Attempt to locate heading via Playwright:  
     ```js
     page.getByRole('heading', { name: 'My Events' })
     ```  
- **Expected Result**: Locator finds `<h1>My Events`.  
- **Actual Result**: Locator fails; element not found.  
- **Impact**: Accessibility roles may be missing or incorrectly applied, breaking automation and accessibility compliance.  

---

### 3. Credits exceed quota
- **Steps to Reproduce**
  1. Observe credits counter in dashboard.  
  2. Run automation scripts repeatedly.  
- **Expected Result**: Usage capped at 50/50 credits; further actions blocked.  
- **Actual Result**: Counter shows **63/50** and scripts continue to run.  
- **Impact**: Quota enforcement bug — backend does not validate limits, allowing over-consumption.  

---

## Severity & Priority
- **Severity**: High (functional blockers, quota bypass, frontend/backend mismatch).  
- **Priority**: Immediate fix recommended before further automation or production rollout.  

---

## Recommendations
- Ensure **frontend state sync** with backend after successful DELETE (`204`).  
- Fix **heading accessibility roles** for reliable locators and compliance.  
- Enforce **credit quota validation** at backend level.  
- Add automated tests to catch quota overflow and deletion persistence issues.  

---

📌 **Final Takeaway:**  
The DELETE API is functioning correctly, but the **UI does not reflect backend state**. Combined with the quota bug and accessibility mismatch, these are critical issues that block reliable automation and need urgent 