import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://127.0.0.1:8000"
ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\8a5aadc7-a582-4590-bcd7-296d77474541"
RESOLUTIONS = [
    (1366, 768, "1366x768"),
    (1536, 864, "1536x864"),
    (1920, 1080, "1920x1080"),
]

def take_screenshots():
    for width, height, res_label in RESOLUTIONS:
        print(f"\n--- Capturing screenshots at {res_label} ---")
        options = Options()
        options.add_argument("--headless=new")
        options.add_argument(f"--window-size={width},{height}")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        
        driver = webdriver.Chrome(options=options)
        driver.set_window_size(width, height)

        try:
            # 1. Landing Hero
            driver.get(f"{BASE_URL}/")
            time.sleep(1.8)
            path1 = os.path.join(ARTIFACT_DIR, f"landing_hero_{res_label}.png")
            driver.save_screenshot(path1)
            print(f"Saved: {path1}")

            # 2. Quality Page Before Run
            driver.get(f"{BASE_URL}/quality")
            time.sleep(1.8)
            path2 = os.path.join(ARTIFACT_DIR, f"quality_before_{res_label}.png")
            driver.save_screenshot(path2)
            print(f"Saved: {path2}")

            # 3. Quality Page After Live Evaluation
            # Find and click "Run live evaluation" button
            try:
                run_btn = driver.find_element(By.XPATH, "//button[contains(., 'Run live evaluation')]")
                run_btn.click()
                time.sleep(2.0)  # Wait for evaluation run and UI update
            except Exception as e:
                print("Failed to click run button:", e)
            
            path3 = os.path.join(ARTIFACT_DIR, f"quality_after_{res_label}.png")
            driver.save_screenshot(path3)
            print(f"Saved: {path3}")

            # 4. One Marketing Page (/how-it-works)
            driver.get(f"{BASE_URL}/how-it-works")
            time.sleep(1.8)
            path4 = os.path.join(ARTIFACT_DIR, f"marketing_how_it_works_{res_label}.png")
            driver.save_screenshot(path4)
            print(f"Saved: {path4}")

            # 5. One App Screen (/dashboard)
            driver.get(f"{BASE_URL}/dashboard")
            time.sleep(1.8)
            path5 = os.path.join(ARTIFACT_DIR, f"app_dashboard_{res_label}.png")
            driver.save_screenshot(path5)
            print(f"Saved: {path5}")

        finally:
            driver.quit()

    print("\nAll deliverable screenshots captured successfully!")

if __name__ == "__main__":
    take_screenshots()
