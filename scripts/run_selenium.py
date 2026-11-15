import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1366,768")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

try:
    driver = webdriver.Chrome(options=options)
    driver.get("http://127.0.0.1:8000/")
    print("Page title:", driver.title)
    driver.quit()
    print("Selenium test successful!")
except Exception as e:
    print("Selenium error:", e)
    sys.exit(1)
