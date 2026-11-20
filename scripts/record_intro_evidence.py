import os
import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def capture_intro_frames():
    evidence_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "docs", "evidence", "intro"))
    os.makedirs(evidence_dir, exist_ok=True)

    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--window-size=1366,768")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=chrome_options)
    try:
        url = "http://127.0.0.1:8000/"
        print(f"Loading {url}...")
        driver.get(url)
        time.sleep(1.0)

        # Clear sessionStorage and trigger replay
        print("Triggering Gold Refinement intro sequence...")
        driver.execute_script("""
            sessionStorage.removeItem('verity_seal_intro_played');
            window.dispatchEvent(new CustomEvent('verity:replay-intro'));
        """)

        # Capture key frames according to section 3 and acceptance criteria:
        # 1.5s: Lens glide, amber warming (#E9A23B), rule tags appear
        # 2.0s: Letters lift, blur, fine gold dust streams into lens
        # 2.6s: Condensation letter-by-letter into corrected sentence
        # 3.0s: Finished sentence + gold underline sweep
        # 3.8s: Gold seal of Verity calligraphic V mark + rising VERITY letters

        timestamps = [
            (1.5, "frame_1.5s.png", "Stage 2: Amber glow & rule tags"),
            (2.0, "frame_2.0s.png", "Stage 3: Gold dust motes streaming into lens"),
            (2.6, "frame_2.6s.png", "Stage 4: Dust condensing into corrected sentence"),
            (3.0, "frame_3.0s.png", "Stage 4: Condensed sentence with gold underline sweep"),
            (3.8, "frame_3.8s.png", "Stage 5: Gold Seal of Verity V mark and VERITY letters"),
        ]

        t0 = time.time()
        for target_time, filename, description in timestamps:
            now = time.time() - t0
            wait_needed = target_time - now
            if wait_needed > 0:
                time.sleep(wait_needed)

            out_path = os.path.join(evidence_dir, filename)
            driver.save_screenshot(out_path)
            print(f"✓ Saved {filename} at {target_time:.1f}s ({description}): {out_path}")

        print("\nAll 5 evidence frames captured successfully in docs/evidence/intro/")
    finally:
        driver.quit()

if __name__ == "__main__":
    capture_intro_frames()
