#!/usr/bin/env python3
"""
Test the Settings page specifically for CSS and functionality
"""
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def test_settings_page():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
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
        print("⏳ Waiting 10 seconds for page to fully load...")
        time.sleep(10)

        # Take screenshot
        driver.save_screenshot('/tmp/settings-page-test.png')
        print("📸 Screenshot saved to /tmp/settings-page-test.png")

        # Get page source length
        page_source = driver.page_source
        print(f"\n📄 Page HTML length: {len(page_source)} characters")

        # Check console for errors
        logs = driver.get_log('browser')
        errors = [log for log in logs if log['level'] == 'SEVERE']
        warnings = [log for log in logs if log['level'] == 'WARNING']

        if errors:
            print(f"\n❌ Found {len(errors)} console errors:")
            for error in errors[:10]:
                print(f"  - {error['message']}")

        if warnings:
            print(f"\n⚠️  Found {len(warnings)} warnings:")
            for warning in warnings[:5]:
                print(f"  - {warning['message']}")

        # Check if root div has content
        try:
            root = driver.find_element(By.ID, "root")
            root_html = root.get_attribute('innerHTML')
            print(f"\n📦 Root div content length: {len(root_html)} characters")
        except Exception as e:
            print(f"❌ Couldn't find root div: {e}")
            return False

        # Check for Settings page specific elements
        print("\n🔍 Looking for Settings page elements...")

        # Look for headings
        headings = driver.find_elements(By.TAG_NAME, "h1")
        headings.extend(driver.find_elements(By.TAG_NAME, "h2"))
        headings.extend(driver.find_elements(By.TAG_NAME, "h3"))

        print(f"\n📋 Found {len(headings)} headings:")
        for i, heading in enumerate(headings[:10]):
            text = heading.text.strip()
            color = heading.value_of_css_property('color')
            font_size = heading.value_of_css_property('font-size')
            font_weight = heading.value_of_css_property('font-weight')
            print(f"  {i+1}. '{text}' (color: {color}, size: {font_size}, weight: {font_weight})")

        # Look for buttons
        buttons = driver.find_elements(By.TAG_NAME, "button")
        print(f"\n🔘 Found {len(buttons)} buttons:")
        for i, button in enumerate(buttons[:10]):
            text = button.text.strip()
            bg_color = button.value_of_css_property('background-color')
            color = button.value_of_css_property('color')
            padding = button.value_of_css_property('padding')
            print(f"  {i+1}. '{text}' (bg: {bg_color}, color: {color}, padding: {padding})")

        # Look for tables
        tables = driver.find_elements(By.TAG_NAME, "table")
        print(f"\n📊 Found {len(tables)} tables")

        if tables:
            for i, table in enumerate(tables):
                rows = table.find_elements(By.TAG_NAME, "tr")
                border = table.value_of_css_property('border')
                print(f"  Table {i+1}: {len(rows)} rows (border: {border})")

        # Check for any element with background color
        all_elements = driver.find_elements(By.CSS_SELECTOR, "*")
        styled_elements = []
        for elem in all_elements[:100]:  # Check first 100 elements
            try:
                bg = elem.value_of_css_property('background-color')
                if bg and bg not in ['rgba(0, 0, 0, 0)', 'transparent']:
                    styled_elements.append((elem.tag_name, bg))
            except:
                pass

        print(f"\n🎨 Found {len(styled_elements)} elements with background colors")

        # Check if CSS seems to be applied
        has_styled_elements = len(styled_elements) > 5
        has_buttons = len(buttons) > 0
        has_headings = len(headings) > 0
        no_severe_errors = len(errors) == 0

        print(f"\n" + "="*50)
        print(f"Has styled elements: {'✅' if has_styled_elements else '❌'}")
        print(f"Has buttons: {'✅' if has_buttons else '❌'}")
        print(f"Has headings: {'✅' if has_headings else '❌'}")
        print(f"No severe errors: {'✅' if no_severe_errors else '❌'}")
        print("="*50)

        if has_styled_elements and has_buttons and has_headings and no_severe_errors:
            print("\n✅ SETTINGS PAGE LOOKS GOOD!")
            return True
        else:
            print("\n❌ SETTINGS PAGE HAS ISSUES")
            print("\nPage source preview:")
            print(page_source[:1000])
            return False

    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        driver.quit()

if __name__ == '__main__':
    success = test_settings_page()
    exit(0 if success else 1)
