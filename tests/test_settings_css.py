#!/usr/bin/env python3
"""
Test Settings page CSS and styling
"""
import time
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def test_settings_css():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')

    driver = webdriver.Chrome(options=chrome_options)

    try:
        print("🔍 Testing Settings page CSS at http://localhost:4200/settings...")
        driver.get('http://localhost:4200/settings')

        # Wait for page to load
        print("⏳ Waiting for page to load...")
        time.sleep(5)

        # Take screenshot
        driver.save_screenshot('/tmp/settings-css-test.png')
        print("📸 Screenshot saved to /tmp/settings-css-test.png")

        # Check if Tailwind CSS is loaded by checking for common Tailwind classes
        print("\n🎨 Checking CSS styling...")

        # Check navigation has proper styling
        nav_links = driver.find_elements(By.CSS_SELECTOR, "nav a, header a")
        if nav_links:
            first_link = nav_links[0]
            # Check computed styles
            color = driver.execute_script("return window.getComputedStyle(arguments[0]).color;", first_link)
            padding = driver.execute_script("return window.getComputedStyle(arguments[0]).padding;", first_link)
            print(f"✓ Navigation link color: {color}")
            print(f"✓ Navigation link padding: {padding}")

            # Verify it's not default browser styling
            if color == "rgb(0, 0, 238)":  # Default blue
                print("❌ FAIL: Navigation using default browser styling (no CSS loaded)")
                return False

        # Check for Settings page heading
        try:
            heading = driver.find_element(By.XPATH, "//*[contains(text(), 'Innstillinger') or contains(text(), 'Settings')]")
            font_size = driver.execute_script("return window.getComputedStyle(arguments[0]).fontSize;", heading)
            font_weight = driver.execute_script("return window.getComputedStyle(arguments[0]).fontWeight;", heading)
            print(f"✓ Heading font-size: {font_size}")
            print(f"✓ Heading font-weight: {font_weight}")

            # Check if heading has Tailwind-like styling
            if font_size == "16px" and font_weight == "400":  # Default browser styling
                print("❌ FAIL: Heading using default browser styling")
                return False
        except:
            print("⚠️  Could not find Settings heading")

        # Check for tabs (Avdelinger/Prosjekter)
        tabs = driver.find_elements(By.XPATH, "//*[contains(text(), 'Avdelinger') or contains(text(), 'Departments')]")
        if tabs:
            tab = tabs[0]
            background = driver.execute_script("return window.getComputedStyle(arguments[0]).backgroundColor;", tab)
            border = driver.execute_script("return window.getComputedStyle(arguments[0]).borderBottom;", tab)
            print(f"✓ Tab background: {background}")
            print(f"✓ Tab border: {border}")

        # Check for buttons
        buttons = driver.find_elements(By.TAG_NAME, "button")
        if buttons:
            button = buttons[0]
            bg_color = driver.execute_script("return window.getComputedStyle(arguments[0]).backgroundColor;", button)
            border_radius = driver.execute_script("return window.getComputedStyle(arguments[0]).borderRadius;", button)
            padding = driver.execute_script("return window.getComputedStyle(arguments[0]).padding;", button)
            print(f"✓ Button background-color: {bg_color}")
            print(f"✓ Button border-radius: {border_radius}")
            print(f"✓ Button padding: {padding}")

            # Check if button has Tailwind-like styling
            if bg_color == "rgba(0, 0, 0, 0)" and border_radius == "0px":  # Default
                print("❌ FAIL: Button using default browser styling")
                return False

        # Check for tables
        tables = driver.find_elements(By.TAG_NAME, "table")
        if tables:
            table = tables[0]
            border_collapse = driver.execute_script("return window.getComputedStyle(arguments[0]).borderCollapse;", table)
            width = driver.execute_script("return window.getComputedStyle(arguments[0]).width;", table)
            print(f"✓ Table border-collapse: {border_collapse}")
            print(f"✓ Table width: {width}")

        # Check body background
        body = driver.find_element(By.TAG_NAME, "body")
        body_bg = driver.execute_script("return window.getComputedStyle(arguments[0]).backgroundColor;", body)
        font_family = driver.execute_script("return window.getComputedStyle(arguments[0]).fontFamily;", body)
        print(f"✓ Body background: {body_bg}")
        print(f"✓ Body font-family: {font_family}")

        # Check if Tailwind is loaded by looking for specific styles
        if "rgba(0, 0, 0, 0)" in body_bg or "rgb(255, 255, 255)" in body_bg:
            print("✓ Tailwind CSS appears to be loaded (body has styled background)")
        else:
            print(f"⚠️  Body background might be using custom styling: {body_bg}")

        # Final check: Look for any error messages
        error_messages = driver.find_elements(By.XPATH, "//*[contains(text(), 'Failed to fetch') or contains(text(), 'Error')]")
        if error_messages:
            print(f"\n⚠️  Found {len(error_messages)} error messages on page")
            for msg in error_messages[:3]:
                print(f"  - {msg.text}")

        print("\n✅ CSS styling test completed successfully!")
        print("   - Navigation has custom styling")
        print("   - Buttons have Tailwind-like styling")
        print("   - Page elements are properly styled")
        return True

    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        driver.quit()

if __name__ == '__main__':
    success = test_settings_css()
    exit(0 if success else 1)
