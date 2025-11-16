#!/usr/bin/env python3
"""
Detailed test for Settings page to match what user sees in browser
"""
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def test_settings_detailed():
    chrome_options = Options()
    # Run in non-headless mode to see what happens
    # chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

    driver = webdriver.Chrome(options=chrome_options)

    try:
        print("🔍 Testing Settings page at http://localhost:4200/settings...")
        driver.get('http://localhost:4200/settings')

        # Wait for page to load
        print("⏳ Waiting 15 seconds for page to fully load...")
        time.sleep(15)

        # Take screenshot
        driver.save_screenshot('/tmp/settings-detailed-test.png')
        print("📸 Screenshot saved to /tmp/settings-detailed-test.png")

        # Get full page text
        body = driver.find_element(By.TAG_NAME, "body")
        page_text = body.text
        print(f"\n📝 Full page text:\n{page_text}\n")

        # Check console for errors
        logs = driver.get_log('browser')
        errors = [log for log in logs if log['level'] == 'SEVERE']

        print(f"\n❌ Found {len(errors)} console errors:")
        for error in errors:
            print(f"  - {error['message']}")

        # Check for specific error messages on page
        if "NetworkError" in page_text:
            print("\n❌ CRITICAL: NetworkError visible on page!")

        if "Error when attempting to fetch resource" in page_text:
            print("❌ CRITICAL: Fetch error visible on page!")

        # Check table structure
        tables = driver.find_elements(By.TAG_NAME, "table")
        print(f"\n📊 Found {len(tables)} tables")

        if tables:
            for i, table in enumerate(tables):
                print(f"\nTable {i+1} details:")
                thead = table.find_elements(By.TAG_NAME, "thead")
                tbody = table.find_elements(By.TAG_NAME, "tbody")
                rows = table.find_elements(By.TAG_NAME, "tr")

                print(f"  - Has thead: {len(thead) > 0}")
                print(f"  - Has tbody: {len(tbody) > 0}")
                print(f"  - Total rows: {len(rows)}")

                # Check table classes
                table_classes = table.get_attribute('class')
                print(f"  - Classes: {table_classes}")

        # Look for error messages
        error_divs = driver.find_elements(By.XPATH, "//*[contains(text(), 'Error')]")
        print(f"\n⚠️  Found {len(error_divs)} elements with 'Error' text:")
        for div in error_divs[:5]:
            print(f"  - {div.text}")

        # Check if data is actually loading
        loading_indicators = driver.find_elements(By.XPATH, "//*[contains(text(), 'Laster') or contains(text(), 'Loading')]")
        print(f"\n⏳ Found {len(loading_indicators)} loading indicators")

        # Wait a bit more and check again
        print("\n⏳ Waiting another 10 seconds...")
        time.sleep(10)

        body2 = driver.find_element(By.TAG_NAME, "body")
        page_text2 = body2.text

        if page_text != page_text2:
            print("⚠️  Page content changed!")
            print(f"New text:\n{page_text2}\n")

        return False

    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        # Keep browser open for inspection
        print("\n⏸️  Browser will stay open for 30 seconds for inspection...")
        time.sleep(30)
        driver.quit()

if __name__ == '__main__':
    success = test_settings_detailed()
    exit(0 if success else 1)
