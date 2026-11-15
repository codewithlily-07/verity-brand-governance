#!/usr/bin/env python3
"""
scripts/check_links.py
VERITY Link & Console Integrity Auditor (WCC Forge 48 · Team Cognexa)

Opens every navbar and footer link on the website and inside the app workspace
at 1366px width, asserts HTTP 200 status and zero browser console errors,
and formats the results as a clean verification table.
"""

import sys
import time
import httpx
from tabulate import tabulate
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://127.0.0.1:8000"

# Target links to audit
LINKS_TO_CHECK = [
    # Public Website Navigation
    {"category": "Website Navbar", "label": "Home / Landing", "path": "/"},
    {"category": "Website Navbar", "label": "Product", "path": "/product"},
    {"category": "Website Navbar", "label": "How It Works", "path": "/how-it-works"},
    {"category": "Website Navbar", "label": "Trust & Security", "path": "/trust-security"},
    {"category": "Website Navbar", "label": "Resources", "path": "/resources"},
    {"category": "Website Navbar", "label": "Quality Panel", "path": "/quality"},
    {"category": "Website Navbar", "label": "Sign In", "path": "/login"},
    {"category": "Website Navbar", "label": "Register", "path": "/register"},
    {"category": "Website Navbar", "label": "Forgot Password", "path": "/forgot-password"},
    
    # Public Website Footer Sections
    {"category": "Website Footer", "label": "Product: Capabilities", "path": "/product#capabilities"},
    {"category": "Website Footer", "label": "Product: Architecture", "path": "/product#architecture"},
    {"category": "Website Footer", "label": "Product: Governance", "path": "/product#governance"},
    {"category": "Website Footer", "label": "How It Works: Pipeline", "path": "/how-it-works#pipeline"},
    {"category": "Website Footer", "label": "How It Works: Engine", "path": "/how-it-works#engine"},
    {"category": "Website Footer", "label": "How It Works: Facts", "path": "/how-it-works#facts"},
    {"category": "Website Footer", "label": "How It Works: Signoff", "path": "/how-it-works#signoff"},
    {"category": "Website Footer", "label": "Trust: Commitments", "path": "/trust-security#commitments"},
    {"category": "Website Footer", "label": "Trust: Data Flow", "path": "/trust-security#data-flow"},
    {"category": "Website Footer", "label": "Trust: Threat Matrix", "path": "/trust-security#threat-matrix"},
    {"category": "Website Footer", "label": "Trust: AI Disclosure", "path": "/trust-security#ai-disclosure"},
    {"category": "Website Footer", "label": "Trust: Roadmap", "path": "/trust-security#roadmap"},
    {"category": "Website Footer", "label": "Resources: API Endpoints", "path": "/resources#api-endpoints"},
    {"category": "Website Footer", "label": "Resources: Benchmark Set", "path": "/resources#benchmark"},
    {"category": "Website Footer", "label": "Resources: Implementation", "path": "/resources#implementation"},
    {"category": "Website Footer", "label": "Resources: Architecture", "path": "/resources#architecture"},

    # App Workspace Navigation
    {"category": "App Navbar", "label": "Dashboard", "path": "/dashboard"},
    {"category": "App Navbar", "label": "New Review", "path": "/new-review"},
    {"category": "App Navbar", "label": "Brand Hub", "path": "/brand-hub"},
    {"category": "App Navbar", "label": "Review Centre", "path": "/review"},
    {"category": "App Navbar", "label": "Governance Insights", "path": "/insights"},
    {"category": "App Navbar", "label": "Quality Panel", "path": "/quality"},
    {"category": "App Navbar", "label": "Trust & AI", "path": "/trust"},
    {"category": "App Navbar", "label": "Settings", "path": "/settings"},
    {"category": "App Navbar", "label": "User Profile", "path": "/profile"},
]

def init_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1366,768")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
    driver = webdriver.Chrome(options=options)
    driver.set_window_size(1366, 768)
    return driver

def main():
    print(f"\n=======================================================")
    print(f"VERITY Automated Link & Console Error Auditor (1366px)")
    print(f"Server Target: {BASE_URL}")
    print(f"=======================================================\n")

    # 1. Check HTTP reachability
    client = httpx.Client(timeout=10.0, follow_redirects=True)
    try:
        health_resp = client.get(f"{BASE_URL}/")
        if health_resp.status_code != 200:
            print(f"[FAIL] Server responded with status {health_resp.status_code} at /")
            sys.exit(1)
    except Exception as e:
        print(f"[FAIL] Cannot reach server at {BASE_URL}: {e}")
        sys.exit(1)

    # 2. Launch Headless Browser
    try:
        driver = init_driver()
    except Exception as e:
        print(f"[FAIL] Unable to initialize headless Chrome: {e}")
        sys.exit(1)

    table_data = []
    failed_items = []

    try:
        # Initialize browser session by loading root page first
        driver.get(BASE_URL)
        time.sleep(1.0)

        for item in LINKS_TO_CHECK:
            full_url = f"{BASE_URL}{item['path']}"
            base_path = item['path'].split('#')[0] or '/'
            http_url = f"{BASE_URL}{base_path}"

            # Step A: Assert HTTP 200 via HTTP client
            try:
                resp = client.get(http_url)
                http_status = resp.status_code
            except Exception as e:
                http_status = f"ERR: {str(e)[:15]}"

            # Step B: Open in Browser at 1366px width and capture console errors
            console_errors = []
            try:
                driver.get(full_url)
                time.sleep(0.6) # Allow React SPA router and components to mount

                # Collect browser logs
                logs = driver.get_log('browser')
                for entry in logs:
                    if entry['level'] in ('SEVERE', 'ERROR'):
                        # Exclude benign network 404 on optional favicon
                        msg = entry.get('message', '')
                        if 'favicon.ico' not in msg:
                            console_errors.append(msg)
            except Exception as e:
                console_errors.append(f"Browser load exception: {e}")

            has_http_200 = (http_status == 200)
            has_no_errors = (len(console_errors) == 0)
            verdict = "PASS" if (has_http_200 and has_no_errors) else "FAIL"

            if verdict == "FAIL":
                failed_items.append({
                    "item": item,
                    "http_status": http_status,
                    "errors": console_errors
                })

            table_data.append([
                item["category"],
                item["label"],
                item["path"],
                f"HTTP {http_status}",
                f"{len(console_errors)} errors" if console_errors else "0 errors",
                "✓ PASS" if verdict == "PASS" else "✗ FAIL"
            ])

    finally:
        driver.quit()
        client.close()

    # 3. Print Results Table
    headers = ["Category", "Link / Target", "Path", "HTTP Status", "Console Errors", "Verdict"]
    print(tabulate(table_data, headers=headers, tablefmt="github"))
    print("\n-------------------------------------------------------")
    print(f"Total Links Checked: {len(table_data)}")
    print(f"Passed: {len(table_data) - len(failed_items)} | Failed: {len(failed_items)}")
    print("-------------------------------------------------------\n")

    if failed_items:
        print("[FAIL] The following links or screens encountered issues:")
        for f in failed_items:
            print(f"- {f['item']['label']} ({f['item']['path']}): HTTP {f['http_status']}")
            for err in f['errors']:
                print(f"    * Console Error: {err}")
        sys.exit(1)
    else:
        print("[SUCCESS] All navbar and footer links returned HTTP 200 with 0 console errors at 1366px wide.")
        sys.exit(0)

if __name__ == "__main__":
    main()
