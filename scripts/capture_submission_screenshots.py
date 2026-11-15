import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def main():
    out_dir = os.path.join("docs", "evidence", "screenshots")
    os.makedirs(out_dir, exist_ok=True)
    
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,900")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    print("Launching Chrome headless...")
    driver = webdriver.Chrome(options=options)
    driver.set_window_size(1440, 900)
    
    base_url = "http://127.0.0.1:8000"
    
    try:
        # 1. Dashboard
        print("Capturing 01_dashboard.png...")
        driver.get(f"{base_url}/dashboard")
        time.sleep(2)
        driver.save_screenshot(os.path.join(out_dir, "01_dashboard.png"))
        
        # 2. Brand Hub
        print("Capturing 02_brand_hub.png...")
        driver.get(f"{base_url}/brand-hub")
        time.sleep(2)
        driver.save_screenshot(os.path.join(out_dir, "02_brand_hub.png"))
        
        # 3. New Review (with sample input)
        print("Capturing 03_new_review.png...")
        driver.get(f"{base_url}/new-review")
        time.sleep(2)
        # Try to find sample button or populate text
        try:
            sample_btn = driver.find_elements(By.XPATH, "//button[contains(text(), 'Sample') or contains(., 'Guarantees')]")
            if sample_btn:
                sample_btn[0].click()
                time.sleep(1)
            else:
                textarea = driver.find_element(By.TAG_NAME, "textarea")
                textarea.clear()
                textarea.send_keys("Our platform guarantees 100% results and is the best learning platform in India!")
        except Exception as e:
            print("Note populating draft:", e)
        driver.save_screenshot(os.path.join(out_dir, "03_new_review.png"))
        
        # 4. Run Analysis & Results
        print("Capturing 04_analysis_results.png...")
        try:
            analyze_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Run Brand Review') or contains(., 'Analyze')]")
            if analyze_btn:
                analyze_btn[0].click()
                time.sleep(3)
        except Exception as e:
            print("Note clicking analyze:", e)
        driver.save_screenshot(os.path.join(out_dir, "04_analysis_results.png"))
        
        # 5. Correction Diff
        print("Capturing 05_correction_diff.png...")
        try:
            fix_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Fix') or contains(., 'Diff') or contains(., 'Correction')]")
            if fix_btn:
                fix_btn[0].click()
                time.sleep(2)
        except Exception as e:
            print("Note clicking fix:", e)
        driver.save_screenshot(os.path.join(out_dir, "05_correction_diff.png"))
        
        # 6. Review & Approval Page
        print("Capturing 06_review_approval.png...")
        try:
            review_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Review') or contains(., 'Sign-Off')]")
            if review_btn:
                review_btn[0].click()
                time.sleep(2)
        except Exception as e:
            print("Note navigating review:", e)
        driver.save_screenshot(os.path.join(out_dir, "06_review_approval.png"))
        
        # 7. Governance Insights
        print("Capturing 07_governance_insights.png...")
        driver.get(f"{base_url}/insights")
        time.sleep(2)
        driver.save_screenshot(os.path.join(out_dir, "07_governance_insights.png"))
        
        # 8. Quality Evaluation Page
        print("Capturing 08_quality_evaluation.png...")
        driver.get(f"{base_url}/quality")
        time.sleep(2)
        # click run live eval
        try:
            eval_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Run live evaluation')]")
            if eval_btn:
                eval_btn[0].click()
                time.sleep(2)
        except Exception as e:
            print("Note clicking eval:", e)
        driver.save_screenshot(os.path.join(out_dir, "08_quality_evaluation.png"))
        
        print("All 8 screenshots successfully captured in docs/evidence/screenshots/!")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
