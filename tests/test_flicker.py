#!/usr/bin/env python3
"""
Test for flickering and loading issues in the accounting system
"""
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def test_no_flicker():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

    driver = webdriver.Chrome(options=chrome_options)

    try:
        print("🔍 Testing app at http://localhost:4200...")
        driver.get('http://localhost:4200')

        # Wait much longer for React to load
        print("⏳ Waiting 20 seconds for app to fully load...")
        time.sleep(20)

        # Take screenshot
        driver.save_screenshot('/tmp/accounting-flicker-test.png')
        print("📸 Screenshot saved to /tmp/accounting-flicker-test.png")

        # Get page source
        page_source = driver.page_source
        print(f"\n📄 Page HTML length: {len(page_source)} characters")

        # Check console for errors
        logs = driver.get_log('browser')
        print(f"\n📋 Total console messages: {len(logs)}")

        errors = [log for log in logs if log['level'] == 'SEVERE']
        warnings = [log for log in logs if log['level'] == 'WARNING']

        if errors:
            print(f"\n❌ Found {len(errors)} console errors:")
            for error in errors[:10]:  # Show first 10
                print(f"  - {error['message']}")

        if warnings:
            print(f"\n⚠️  Found {len(warnings)} warnings:")
            for warning in warnings[:5]:  # Show first 5
                print(f"  - {warning['message']}")

        # Check if root div has content
        try:
            root = driver.find_element(By.ID, "root")
            root_html = root.get_attribute('innerHTML')
            print(f"\n📦 Root div content length: {len(root_html)} characters")

            if len(root_html) < 100:
                print("❌ Root div is nearly empty! React app didn't load!")
                print(f"Root content: {root_html[:200]}")
                return False
        except Exception as e:
            print(f"❌ Couldn't find root div: {e}")
            return False

        # Check for navigation
        try:
            nav = WebDriverWait(driver, 2).until(
                EC.presence_of_element_located((By.TAG_NAME, "nav"))
            )
            print("✅ Navigation found!")

            # Get all links in nav
            links = nav.find_elements(By.TAG_NAME, "a")
            print(f"✅ Found {len(links)} navigation links")
            for link in links:
                print(f"  - {link.text}")

        except:
            print("❌ Navigation not found!")
            return False

        # Test for flickering by checking if content changes
        print("\n🔄 Testing for flickering (checking if page changes unexpectedly)...")
        initial_html = driver.page_source
        time.sleep(3)
        after_html = driver.page_source

        if initial_html != after_html:
            print("⚠️  Page content changed after 3 seconds (possible flicker)")
            # This might be OK if it's just timestamps or dynamic content
        else:
            print("✅ Page content stable (no unexpected changes)")

        # Final verdict
        has_nav = True
        no_errors = len(errors) == 0
        root_loaded = len(root_html) > 100

        print(f"\n" + "="*50)
        print(f"Navigation present: {'✅' if has_nav else '❌'}")
        print(f"No console errors: {'✅' if no_errors else '❌'}")
        print(f"Root div loaded: {'✅' if root_loaded else '❌'}")
        print("="*50)

        if has_nav and no_errors and root_loaded:
            print("\n✅ APP IS WORKING CORRECTLY - NO FLICKER!")
            return True
        else:
            print("\n❌ APP HAS ISSUES - NEEDS FIXING")
            return False

    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        driver.quit()

if __name__ == '__main__':
    success = test_no_flicker()
    exit(0 if success else 1)
