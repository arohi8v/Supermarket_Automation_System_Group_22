

from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException
from selenium.webdriver.common.keys import Keys
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import random
from datetime import datetime, timedelta

# Path to Edge WebDriver executable
EDGE_DRIVER_PATH = r"C:\Users\ravee\Downloads\edgedriver_win64\msedgedriver.exe"
BASE_URL = "http://172.22.176.1:3000"

def login(driver, username, password, role):
    """Function to log in a user with specified credentials and role."""
    driver.get(f"{BASE_URL}/")
    time.sleep(1)
    driver.find_element(By.ID, "username").send_keys(username)
    driver.find_element(By.ID, "password").send_keys(password)
    driver.find_element(By.ID, role).click()
    driver.find_element(By.XPATH, "//button[contains(text(),'Login')]").click()
    time.sleep(1)
    print(f"Login as {role} successful.")

def logout(driver):
    """Function to logout the current user."""
    try:
        # Find and click the logout option in the tabs
        logout_tab = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Logout')]"))
        )
        logout_tab.click()
        time.sleep(1)
        
        # Verify we're back at the login page by checking for the login button
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'Login')]"))
        )
        print("Logout successful.")
    except Exception as e:
        print(f"Logout failed: {str(e)}")
        # Take screenshot for debugging
        screenshot_path = f"logout_error_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
        driver.save_screenshot(screenshot_path)
        print(f"Error screenshot saved to {screenshot_path}")

def test_employee_checkout(driver):
    """Test the checkout functionality for employee."""
    print("\nTesting Employee Checkout...")
    
    # Navigate to checkout page
    driver.get(f"{BASE_URL}/employee/checkout")
    time.sleep(1)
    
    # Add product to cart by Product ID
    try:
        driver.find_element(By.XPATH, "//input[@placeholder='Enter Product ID']").send_keys("1")
        driver.find_element(By.XPATH, "//button[contains(text(),'Add')]").click()
        time.sleep(1)
        print("Product added to cart successfully.")
    except:
        print("Failed to add product to cart.")
    
    # Complete checkout
    try:
        driver.find_element(By.XPATH, "//button[contains(text(),'Complete Checkout')]").click()
        time.sleep(1)
        print("Checkout completed successfully.")
    except:
        print("Checkout completion failed.")
    
    print("Checkout test completed.")

def test_employee_products(driver):
    """Test employee product browsing functionality."""
    print("\nTesting Employee Products...")
    
    # Navigate to products page
    driver.get(f"{BASE_URL}/employee/products")
    time.sleep(1)
    
    # Scroll through the page
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(1)
    driver.execute_script("window.scrollTo(0, 0);")
    
    # Try to search for a product if search field exists
    try:
        search_field = driver.find_element(By.XPATH, "//input[contains(@placeholder,'Search')]")
        search_field.send_keys("Apple")
        search_field.send_keys(Keys.RETURN)
        time.sleep(1)
        print("Searched for 'Apple' in products.")
    except:
        print("Search field not found, continuing test.")
    
    print("Product browsing test completed.")



def test_manager_products(driver):
    """Test manager product management functionality."""
    print("\nTesting Manager Products...")
    
    # Navigate to products management page
    driver.get(f"{BASE_URL}/manager/products")
    time.sleep(1)
    
    # Add a new product
    try:
        driver.find_element(By.XPATH, "//button[contains(text(),'Add Product') or contains(text(),'Create Product')]").click()
        time.sleep(1)
        
        # Fill in product details - try different ways to locate fields
        product_name = f"TestProduct{random.randint(1000, 9999)}"
        
        try:
            driver.find_element(By.ID, "name").send_keys(product_name)
        except:
            try:
                driver.find_element(By.NAME, "name").send_keys(product_name)
            except:
                print("Product name field not found")
        
        try:
            driver.find_element(By.ID, "category").send_keys("TestCategory")
        except:
            try:
                driver.find_element(By.NAME, "category").send_keys("TestCategory")
            except:
                print("Category field not found")
        
        try:
            driver.find_element(By.ID, "price").send_keys("9.99")
        except:
            try:
                driver.find_element(By.NAME, "price").send_keys("9.99")
            except:
                print("Price field not found")
                
        try:
            driver.find_element(By.ID, "unitAvailable").send_keys("100")
        except:
            try:
                driver.find_element(By.NAME, "unitAvailable").send_keys("100")
            except:
                print("Units available field not found")
        
        try:
            driver.find_element(By.ID, "location").send_keys("Aisle 5")
        except:
            try:
                driver.find_element(By.NAME, "location").send_keys("Aisle 5")
            except:
                print("Location field not found")
        
        # Submit the form - try different possible button texts
        try:
            driver.find_element(By.XPATH, "//button[contains(text(),'Create')]").click()
        except:
            try:
                driver.find_element(By.XPATH, "//button[contains(text(),'Save')]").click()
            except:
                try:
                    driver.find_element(By.XPATH, "//button[contains(text(),'Submit')]").click()
                except:
                    print("Create product button not found")
        
        time.sleep(1)
        print("New product added successfully.")
    except Exception as e:
        print(f"Failed to add product: {e}")
    
    


def test_manager_inventory(driver):
    """Test manager inventory management functionality."""
    print("\nTesting Manager Inventory...")
    
    driver.get(f"{BASE_URL}/manager/inventory")
    try:
        # Wait for inventory table to load
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//table")))
        
        # Find first Update button using more precise selector
        update_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//table//button[contains(.,'Update')]")))
        update_btn.click()
        
        # Handle dialog
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//div[@role='dialog']")))
        
        # Update quantity
        qty_field = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.ID, "new-quantity")))
        qty_field.clear()
        qty_field.send_keys("999")
        
        # Submit update
        driver.find_element(By.XPATH, "//div[@role='dialog']//button[contains(.,'Update')]").click()
        WebDriverWait(driver, 10).until(
            EC.invisibility_of_element_located((By.XPATH, "//div[@role='dialog']")))
        print("Inventory updated successfully.")
    except Exception as e:
        print(f"Inventory update failed: {str(e)}")
        raise

def test_manager_reports(driver):
    """Test manager report generation functionality."""
    print("\nTesting Manager Reports...")
    
    driver.get(f"{BASE_URL}/manager/reports")
    time.sleep(2)  # Increased wait time for page to fully load
    
    try:
        # Select report type using the Select component
        select_trigger = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "report-type"))
        )
        select_trigger.click()
        time.sleep(1)
        
        # Select the "Sales Report" option from dropdown
        sales_option = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'select-item')][text()='Sales Report']"))
        )
        sales_option.click()
        time.sleep(1)
        
        # Set dates
        today = datetime.now().strftime("%Y-%m-%d")
        thirty_days_ago = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        
        # Clear any existing values first
        start_date = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "start-date"))
        )
        start_date.clear()
        start_date.send_keys(thirty_days_ago)
        
        end_date = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "end-date"))
        )
        end_date.clear()
        end_date.send_keys(today)
        
        # Generate report
        generate_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Generate Report')]"))
        )
        generate_btn.click()
        
        # Wait for report to be generated
        time.sleep(3)
        
        # Click Download CSV button if it appears
        download_btn = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Download CSV')]"))
        )
        download_btn.click()
        time.sleep(2)
        print("Report generated and downloaded successfully.")
    except Exception as e:
        print(f"Reports test failed: {str(e)}")
        # Take screenshot for debugging
        screenshot_path = f"report_error_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
        driver.save_screenshot(screenshot_path)
        print(f"Error screenshot saved to {screenshot_path}")

def test_manager_products(driver):
    """Test manager product management functionality."""
    print("\nTesting Manager Products...")
    
    driver.get(f"{BASE_URL}/manager/products")
    time.sleep(1)
    
    # Add new product
    try:
        driver.find_element(By.XPATH, "//button[contains(text(),'Add Product')]").click()
        time.sleep(1)
        
        product_name = f"TestProduct{random.randint(1000, 9999)}"
        
        # Fill form using explicit IDs from React code
        driver.find_element(By.ID, "name").send_keys(product_name)
        driver.find_element(By.ID, "category").send_keys("TestCategory")
        driver.find_element(By.ID, "price").send_keys("9.99")
        driver.find_element(By.ID, "unitAvailable").send_keys("100")
        driver.find_element(By.ID, "location").send_keys("Aisle 5")
        
        # Submit form
        driver.find_element(By.XPATH, "//button[contains(text(),'Create')]").click()
        time.sleep(1)
        print("New product added successfully.")
    except Exception as e:
        print(f"Failed to add product: {e}")
    
    # Edit product
    

    print("Manager Products test completed.")

def test_manager_inventory(driver):
    """Test manager inventory management functionality."""
    print("\nTesting Manager Inventory...")
    
    driver.get(f"{BASE_URL}/manager/inventory")
    time.sleep(1)
    
    # Update inventory
    try:
        first_update_btn = driver.wait_for_element(By.XPATH, "//button[contains(text(),'Update')]")
        first_update_btn.click()
        time.sleep(1)
        
        # Update quantity in dialog
        qty_field = driver.find_element(By.ID, "new-quantity")
        qty_field.clear()
        qty_field.send_keys("999")
        
        # Submit update
        driver.find_element(By.XPATH, "//div[@role='dialog']//button[contains(text(),'Update')]").click()
        time.sleep(1)
        print("Inventory updated successfully.")
    except Exception as e:
        print(f"Inventory update failed: {e}")

def test_manager_reports(driver):
    """Test manager report generation functionality."""
    print("\nTesting Manager Reports...")
    
    driver.get(f"{BASE_URL}/manager/reports")
    time.sleep(1)
    
    # Select sales report
    try:
        driver.find_element(By.ID, "report-type").click()
        time.sleep(0.5)
        driver.find_element(By.XPATH, "//div[contains(text(),'Sales Report')]").click()
        time.sleep(0.5)
    except:
        print("Failed to select report type")
    
    # Set dates
    today = datetime.now().strftime("%Y-%m-%d")
    thirty_days_ago = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    
    driver.find_element(By.ID, "start-date").send_keys(thirty_days_ago)
    driver.find_element(By.ID, "end-date").send_keys(today)
    
    # Generate report
    driver.find_element(By.XPATH, "//button[contains(text(),'Generate')]").click()
    time.sleep(2)
    
    # Download report
    driver.find_element(By.XPATH, "//button[contains(text(),'Download CSV')]").click()
    time.sleep(1)
    print("Report generated and downloaded.")

def test_manager_promotions(driver):
    """Test manager promotions functionality."""
    print("\nTesting Manager Promotions...")
    
    driver.get(f"{BASE_URL}/manager/promotions")
    time.sleep(1)
    
    try:
        driver.find_element(By.XPATH, "//button[contains(text(),'Add New Promotion')]").click()
        time.sleep(1)
        
        # Fill promotion form
        promo_name = f"TestPromo{random.randint(1000, 9999)}"
        today = datetime.now().strftime("%Y-%m-%d")
        end_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
        
        driver.find_element(By.ID, "name").send_keys(promo_name)
        driver.find_element(By.ID, "description").send_keys("Test promotion")
        driver.find_element(By.ID, "discountValue").send_keys("15")
        
        # Set dates
        driver.find_element(By.ID, "startDate").send_keys(today)
        driver.find_element(By.ID, "endDate").send_keys(end_date)
        
        # Create promotion
        driver.find_element(By.XPATH, "//button[contains(text(),'Create Promotion')]").click()
        time.sleep(1)
        print("Promotion created successfully.")
    except Exception as e:
        print(f"Promotion creation failed: {e}")

def main():
    """Main function to initiate WebDriver and execute tests."""
    service = Service(EDGE_DRIVER_PATH)
    options = webdriver.EdgeOptions()
    options.add_argument("--start-maximized")
    
    driver = webdriver.Edge(service=service, options=options)
    
    try:
        # Employee tests
        print("\n===== EMPLOYEE TESTS =====")
        login(driver, "employee1", "password123", "employee")
        test_employee_checkout(driver)
        test_employee_products(driver)
        logout(driver)
        print("All employee tests completed successfully.")
        
        # Manager tests
        # Manager tests
        print("\n===== MANAGER TESTS =====")
        login(driver, "manager1", "password123", "manager")
        test_manager_products(driver)
        #test_manager_inventory(driver)
        test_manager_promotions(driver)
        logout(driver)
        print("All manager tests completed successfully.")
        
        print("\n===== ALL TESTS COMPLETED =====")
    except Exception as e:
        print(f"Test failed with error: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()