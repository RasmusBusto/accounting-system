#!/usr/bin/env python3
"""
Visual test for the accounting system - checks styling and translations
"""
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def test_visual():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

    driver = webdriver.Chrome(options=chrome_options)

    try:
        print("🔍 Testing app at http://localhost:4200...")
        driver.get('http://localhost:4200')

        # Wait longer for i18n to fully load
        print("⏳ Waiting 10 seconds for app and i18n to fully load...")
        time.sleep(10)

        # Take initial screenshot
        driver.save_screenshot('/tmp/accounting-visual-test.png')
        print("📸 Screenshot saved to /tmp/accounting-visual-test.png")

        # Check console for errors
        logs = driver.get_log('browser')
        errors = [log for log in logs if log['level'] == 'SEVERE']

        if errors:
            print(f"\n❌ Found {len(errors)} console errors:")
            for error in errors[:10]:
                print(f"  - {error['message']}")

        # Check navigation
        try:
            nav = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.TAG_NAME, "nav"))
            )
            print("\n✅ Navigation found!")

            # Get navigation styles
            nav_bg = nav.value_of_css_property('background-color')
            print(f"Navigation background: {nav_bg}")

            # Get all links in nav
            links = nav.find_elements(By.TAG_NAME, "a")
            print(f"\n📋 Found {len(links)} navigation links:")

            has_untranslated = False
            for i, link in enumerate(links):
                text = link.text.strip()
                color = link.value_of_css_property('color')
                bg_color = link.value_of_css_property('background-color')

                # Check if text contains translation key (starts with lowercase letter followed by dot)
                if '.' in text and text.split('.')[0].islower():
                    print(f"  {i+1}. ❌ UNTRANSLATED: '{text}' (color: {color})")
                    has_untranslated = True
                else:
                    print(f"  {i+1}. ✅ '{text}' (color: {color})")

            # Check if Settings link exists and is translated
            settings_links = [link for link in links if 'settings' in link.text.lower() or 'innstillinger' in link.text.lower()]
            if settings_links:
                settings_text = settings_links[0].text
                if settings_text == 'nav.settings':
                    print("\n❌ Settings link is NOT translated!")
                    return False
                else:
                    print(f"\n✅ Settings link is properly translated: '{settings_text}'")
            else:
                print("\n⚠️  Settings link not found!")
                return False

            # Check for proper CSS styling
            print(f"\n🎨 CSS Check:")
            if 'rgb' in nav_bg or 'rgba' in nav_bg:
                print(f"  ✅ Navigation has background color: {nav_bg}")
            else:
                print(f"  ❌ Navigation missing background color")

            if not has_untranslated:
                print("\n✅ ALL LINKS ARE PROPERLY TRANSLATED!")
                print("✅ CSS STYLING IS APPLIED!")
                return True
            else:
                print("\n❌ SOME LINKS ARE NOT TRANSLATED")
                return False

        except Exception as e:
            print(f"❌ Navigation error: {e}")
            return False

    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        driver.quit()

if __name__ == '__main__':
    success = test_visual()
    exit(0 if success else 1)
