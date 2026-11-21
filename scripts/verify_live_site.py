import time
import httpx
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

LIVE_URL = "https://verity-brand-governance.onrender.com"

def verify_live():
    print(f"=== VERIFYING LIVE SITE AT {LIVE_URL} ===")
    
    # 1. API Probes
    for path in ["/api/health", "/api/ready"]:
        r = httpx.get(f"{LIVE_URL}{path}", timeout=60.0)
        print(f"[HTTP] {path} -> {r.status_code}: {r.json()}")

    # 2. Chrome DevTools & Navigation
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--window-size=1366,768")
    opts.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    driver = webdriver.Chrome(options=opts)

    try:
        pages = ["/", "/how-it-works", "/resources", "/quality", "/product", "/trust-security"]
        for p in pages:
            driver.get(f"{LIVE_URL}{p}")
            time.sleep(3)
            h1 = driver.find_element(By.TAG_NAME, "h1").text if driver.find_elements(By.TAG_NAME, "h1") else "No H1"
            logs = driver.get_log("browser")
            errors = [l for l in logs if l["level"] == "SEVERE" and "favicon" not in l["message"].lower()]
            print(f"[BROWSER] {p:16} -> H1: {h1[:35]:35} | Console Errors: {len(errors)}")
            for e in errors:
                print(f"   Console Error: {e['message']}")

        # 3. Complete Demo Journey on Live Site
        print("\n--- Executing Demo Journey on Live Site ---")
        driver.get(f"{LIVE_URL}/dashboard")
        time.sleep(3)
        dash_h1 = driver.find_element(By.TAG_NAME, "h1").text if driver.find_elements(By.TAG_NAME, "h1") else ""
        print(f"[JOURNEY] Loaded /dashboard -> H1: '{dash_h1}'")
        
        # Test API guided demo
        demo_resp = httpx.post(f"{LIVE_URL}/api/submissions/run-guided-demo", timeout=20.0)
        print(f"[JOURNEY] POST /api/submissions/run-guided-demo -> {demo_resp.status_code}")
        
    finally:
        driver.quit()
        print("\n=== LIVE VERIFICATION FINISHED ===")

if __name__ == "__main__":
    verify_live()
