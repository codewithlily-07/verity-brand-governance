import os
import time
import shutil
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

BASE_URL = "http://127.0.0.1:8000"
EVIDENCE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "docs", "evidence", "final-colours"))
ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\8a5aadc7-a582-4590-bcd7-296d77474541"

VIEWPORTS = [
    (390, 844, "390x844_mobile"),
    (768, 1024, "768x1024_tablet"),
    (980, 1100, "980x1100_desktop_phone"),
    (1366, 768, "1366x768_laptop"),
    (1920, 1080, "1920x1080_fhd"),
]

PAGES = [
    ("/", "landing"),
    ("/product", "product"),
    ("/how-it-works", "how_it_works"),
    ("/trust-security", "trust_security"),
    ("/resources", "resources"),
    ("/quality", "quality"),
]

def capture_all():
    os.makedirs(EVIDENCE_DIR, exist_ok=True)
    os.makedirs(ARTIFACT_DIR, exist_ok=True)

    print(f"Saving evidence screenshots to: {EVIDENCE_DIR}")
    print(f"Also copying to artifact dir: {ARTIFACT_DIR}")

    for width, height, vp_label in VIEWPORTS:
        print(f"\n--- Capturing viewport: {vp_label} ({width}x{height}) ---")
        options = Options()
        options.add_argument("--headless=new")
        options.add_argument(f"--window-size={width},{height}")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")

        driver = webdriver.Chrome(options=options)
        driver.set_window_size(width, height)

        try:
            for path, page_name in PAGES:
                url = f"{BASE_URL}{path}"
                driver.get(url)
                # Wait for animations and content to settle
                time.sleep(1.8)

                filename = f"{page_name}_{vp_label}.png"
                evidence_path = os.path.join(EVIDENCE_DIR, filename)
                driver.save_screenshot(evidence_path)
                print(f"  Captured: {filename}")

                # Copy to artifact dir
                artifact_path = os.path.join(ARTIFACT_DIR, filename)
                try:
                    shutil.copy2(evidence_path, artifact_path)
                except Exception as e:
                    print(f"  Warning: failed to copy to artifact dir: {e}")

        finally:
            driver.quit()

    print("\nAll multi-viewport screenshots captured successfully!")

if __name__ == "__main__":
    capture_all()
