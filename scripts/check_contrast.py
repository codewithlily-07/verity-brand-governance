import os
import sys
import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from tabulate import tabulate

BASE_URL = "http://127.0.0.1:8000"
AXE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "node_modules", "axe-core", "axe.min.js"))

ROUTES = [
    # Marketing pages
    ("/", "Landing Page"),
    ("/product", "Product Page"),
    ("/how-it-works", "How It Works"),
    ("/trust-security", "Trust & Security"),
    ("/resources", "Resources"),
    ("/quality", "Quality & Engine"),
    # App screens
    ("/dashboard", "App Dashboard"),
    ("/brand-hub", "Brand Hub"),
    ("/new-review", "New Review"),
    ("/review", "Review & Approval"),
    ("/insights", "Governance Insights"),
    ("/settings", "Settings"),
    ("/roadmap", "Roadmap"),
    # Auth pages
    ("/login", "Login Page"),
    ("/register", "Register Page"),
    ("/forgot-password", "Forgot Password"),
]

def run_contrast_audit():
    if not os.path.exists(AXE_PATH):
        print(f"Error: axe.min.js not found at {AXE_PATH}")
        sys.exit(1)

    with open(AXE_PATH, "r", encoding="utf-8") as f:
        axe_script = f.read()

    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1366,768")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=options)
    driver.set_window_size(1366, 768)

    results_table = []
    total_violations = 0
    detailed_failures = []

    print("=" * 70)
    print("AXE-CORE COLOR CONTRAST AUDIT (WCAG AA 4.5:1 Body / 3.0:1 Large)")
    print(f"Viewport: 1366x768 | Base URL: {BASE_URL}")
    print("=" * 70)

    try:
        for path, label in ROUTES:
            url = f"{BASE_URL}{path}"
            driver.get(url)
            time.sleep(1.2)  # Wait for animations and data load

            # Inject axe-core
            driver.execute_script(axe_script)

            # Run color-contrast rule
            axe_run_script = """
            var callback = arguments[arguments.length - 1];
            axe.run(document, {
                runOnly: {
                    type: 'rule',
                    values: ['color-contrast']
                }
            }).then(results => {
                callback(results);
            }).catch(err => {
                callback({ error: err.message });
            });
            """

            axe_res = driver.execute_async_script(axe_run_script)
            violations = axe_res.get("violations", [])
            passes = axe_res.get("passes", [])

            num_violations = len(violations)
            num_passes = len(passes[0].get("nodes", [])) if passes else 0

            status = "PASS (0 failures)" if num_violations == 0 else f"FAIL ({num_violations} violations)"
            results_table.append([label, path, num_passes, num_violations, status])
            total_violations += num_violations

            if num_violations > 0:
                for v in violations:
                    for node in v.get("nodes", []):
                        detailed_failures.append({
                            "page": label,
                            "path": path,
                            "target": node.get("target", []),
                            "html": node.get("html", "")[:80],
                            "summary": node.get("failureSummary", "")
                        })

    finally:
        driver.quit()

    print("\n" + tabulate(results_table, headers=["Page Name", "Path", "Elements Checked", "Violations", "Status"], tablefmt="grid"))
    print(f"\nTOTAL CONTRAST VIOLATIONS: {total_violations}")

    if detailed_failures:
        print("\nDETAILED FAILURE SAMPLES:")
        for df in detailed_failures[:10]:
            print(f"- [{df['page']}] {df['target']} : {df['summary']}")

    return total_violations

if __name__ == "__main__":
    exit_code = run_contrast_audit()
    sys.exit(0 if exit_code == 0 else 1)
