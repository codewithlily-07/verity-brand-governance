import os
import sys
import time
import json
import shutil
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://127.0.0.1:8000"
AXE_PATH = os.path.abspath("frontend/node_modules/axe-core/axe.min.js")
DOCS_EVIDENCE_DIR = os.path.abspath("docs/evidence/design")
ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\8a5aadc7-a582-4590-bcd7-296d77474541"

os.makedirs(DOCS_EVIDENCE_DIR, exist_ok=True)
os.makedirs(ARTIFACT_DIR, exist_ok=True)

with open(AXE_PATH, "r", encoding="utf-8") as f:
    AXE_JS = f.read()

VIEWPORTS = [
    ("390x844_mobile", 390, 844),
    ("768x1024_tablet", 768, 1024),
    ("980x1100_desktop_site_phone", 980, 1100),
    ("1366x768_laptop", 1366, 768),
    ("1920x1080_fhd", 1920, 1080),
]

PAGES = [
    ("landing", "/"),
    ("how_it_works", "/how-it-works"),
    ("resources", "/resources"),
    ("product", "/product"),
    ("trust_security", "/trust-security"),
    ("quality", "/quality"),
]

def create_driver(width=1920, height=1080, reduced_motion=False):
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument(f"--window-size={width},{height}")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    if reduced_motion:
        options.add_argument("--force-prefers-reduced-motion")
    driver = webdriver.Chrome(options=options)
    driver.set_window_size(width, height)
    return driver

def test_intro_flow():
    print("\n--- 1. Testing Intro Animation & Role Picker ---")
    driver = create_driver(1920, 1080)
    try:
        driver.get(BASE_URL)
        time.sleep(0.5)

        # Check if overlay is present
        overlays = driver.find_elements(By.CSS_SELECTOR, "#seal-intro-overlay")
        print(f"Overlay present on initial load: {len(overlays) > 0}")

        # Check for skip button
        skip_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Skip')]")
        if skip_buttons:
            print("Skip button found. Clicking Skip...")
            skip_buttons[0].click()
            time.sleep(0.8)

        # Verify sessionStorage set
        val = driver.execute_script("return sessionStorage.getItem('verity_seal_intro_played');")
        print(f"sessionStorage 'verity_seal_intro_played': {val}")

        # Reload and verify intro does not trigger again
        driver.get(BASE_URL)
        time.sleep(1.0)
        overlays_after_reload = driver.find_elements(By.CSS_SELECTOR, "#seal-intro-overlay")
        print(f"Overlay present after reload in same session: {len(overlays_after_reload) > 0}")

        # Test Explore Demo button triggering Role Picker
        explore_btns = driver.find_elements(By.XPATH, "//button[contains(text(), 'Explore Demo')]")
        if explore_btns:
            print("Clicking Explore Demo to open Role Picker...")
            driver.execute_script("arguments[0].click();", explore_btns[0])
            time.sleep(0.5)
            modals = driver.find_elements(By.XPATH, "//*[contains(text(), 'How do you want to explore Verity?')]")
            print(f"Role Picker Modal opened: {len(modals) > 0}")

            # Take screenshot of role picker modal
            modal_shot = os.path.join(DOCS_EVIDENCE_DIR, "role_picker_modal.png")
            driver.save_screenshot(modal_shot)
            shutil.copy(modal_shot, os.path.join(ARTIFACT_DIR, "role_picker_modal.png"))
            print(f"Saved {modal_shot}")
    finally:
        driver.quit()

def run_axe_and_screenshots():
    print("\n--- 2. Running Axe-Core Contrast Audits & Viewport Screenshots ---")
    axe_results_summary = {}

    for page_name, route in PAGES:
        print(f"\nProcessing Page: {page_name} ({route})")
        
        # 1. Axe-core test at 1920x1080
        driver = create_driver(1920, 1080)
        try:
            # Set sessionStorage so intro doesn't block page inspect
            driver.get(BASE_URL)
            driver.execute_script("sessionStorage.setItem('verity_seal_intro_played', 'true');")
            
            target_url = f"{BASE_URL}{route}"
            driver.get(target_url)
            time.sleep(1.2)

            # Inject axe-core
            driver.execute_script(AXE_JS)
            time.sleep(0.3)

            # Run axe for color-contrast
            axe_script = """
            var callback = arguments[arguments.length - 1];
            axe.run({
                runOnly: {
                    type: 'rule',
                    values: ['color-contrast']
                }
            }).then(function(results) {
                callback(results);
            }).catch(function(err) {
                callback({ error: err.message });
            });
            """
            result = driver.execute_async_script(axe_script)
            violations = result.get('violations', [])
            axe_results_summary[page_name] = {
                'violations_count': len(violations),
                'violations': violations
            }
            print(f"  [Axe-Core Color-Contrast] Violations: {len(violations)}")
            if len(violations) > 0:
                for v in violations:
                    print(f"    - {v.get('id')}: {v.get('help')} (Nodes: {len(v.get('nodes', []))})")
        finally:
            driver.quit()

        # 2. Viewport Screenshots
        for vp_name, width, height in VIEWPORTS:
            vp_driver = create_driver(width, height)
            try:
                vp_driver.get(BASE_URL)
                vp_driver.execute_script("sessionStorage.setItem('verity_seal_intro_played', 'true');")
                vp_driver.get(f"{BASE_URL}{route}")
                time.sleep(1.0)

                filename = f"{page_name}_{vp_name}.png"
                filepath = os.path.join(DOCS_EVIDENCE_DIR, filename)
                vp_driver.save_screenshot(filepath)
                shutil.copy(filepath, os.path.join(ARTIFACT_DIR, filename))
                print(f"  Captured: {filename} ({width}x{height})")
            finally:
                vp_driver.quit()

    # Save Axe summary report
    report_path = os.path.join(DOCS_EVIDENCE_DIR, "axe_contrast_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(axe_results_summary, f, indent=2)
    print(f"\nAxe contrast report saved to {report_path}")

if __name__ == "__main__":
    test_intro_flow()
    run_axe_and_screenshots()
