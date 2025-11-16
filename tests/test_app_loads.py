#!/usr/bin/env python3
"""
Test that the accounting system shell app loads correctly
"""
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def test_app_loads():
    # Setup Chrome in headless mode
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(options=chrome_options)

    try:
        print("🔍 Testing app at http://localhost:4200...")
        driver.get('http://localhost:4200')

        # Wait for page to load (give it 10 seconds)
        time.sleep(10)

        # Take screenshot
        driver.save_screenshot('/tmp/accounting-app-test.png')
        print("📸 Screenshot saved to /tmp/accounting-app-test.png")

        # Get page source
        page_source = driver.page_source
        print(f"\n📄 Page HTML length: {len(page_source)} characters")

        # Check for navigation elements
        try:
            nav = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.TAG_NAME, "nav"))
            )
            print("✅ Navigation found!")
        except:
            print("❌ Navigation not found!")
            print("\n🔍 Page source:")
            print(page_source[:1000])
            return False

        # Look for navigation links
        nav_items = ['Dashboard', 'Invoices', 'Expenses', 'Reports', 'Clients',
                     'Dashbord', 'Fakturaer', 'Utgifter', 'Rapporter', 'Kunder']

        found_items = []
        for item in nav_items:
            if item.lower() in page_source.lower():
                found_items.append(item)

        print(f"✅ Found navigation items: {found_items}")

        # Check for errors in console
        logs = driver.get_log('browser')
        errors = [log for log in logs if log['level'] == 'SEVERE']

        if errors:
            print("\n❌ Browser console errors:")
            for error in errors:
                print(f"  - {error['message']}")
        else:
            print("✅ No console errors")

        # Check page title
        print(f"📄 Page title: {driver.title}")

        # Final verdict
        if nav and len(found_items) > 0 and len(errors) == 0:
            print("\n✅ APP IS WORKING!")
            return True
        else:
            print("\n❌ APP HAS ISSUES")
            return False

    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        driver.quit()

if __name__ == '__main__':
    success = test_app_loads()
    exit(0 if success else 1)
