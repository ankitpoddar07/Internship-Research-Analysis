
import time
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager

@pytest.fixture(scope="module")
def driver():
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.maximize_window()
    yield driver
    driver.quit()

def test_login(driver):
    driver.get("http://automationpractice.com/index.php")
    driver.find_element(By.CLASS_NAME, "login").click()
    driver.find_element(By.ID, "email").send_keys("testuser@example.com")
    driver.find_element(By.ID, "passwd").send_keys("password")
    driver.find_element(By.ID, "SubmitLogin").click()
    assert "My account" in driver.page_source

def test_search_product(driver):
    search_box = driver.find_element(By.ID, "search_query_top")
    search_box.send_keys("dress")
    search_box.send_keys(Keys.RETURN)
    assert "results have been found" in driver.page_source

def test_add_to_cart(driver):
    driver.find_element(By.CLASS_NAME, "product-container").click()
    driver.switch_to.frame(0)
    driver.find_element(By.NAME, "Submit").click()
    time.sleep(2)
    assert "Product successfully added" in driver.page_source

def test_checkout(driver):
    driver.find_element(By.CLASS_NAME, "button-medium").click()
    assert "Order" in driver.page_source
