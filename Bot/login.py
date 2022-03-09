from selenium import webdriver
import undetected_chromedriver as uc
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import json
import time

class Login:

    def __init__(self):

        options = webdriver.ChromeOptions()
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        options.add_argument("--disable-blink-features=AutomationControlled")

        self.driver = uc.Chrome(options=options)
    
    def run(self):

        self.login()
    
    def getCookies(self):
        
        cookies = self.driver.get_cookies()
    
        cookiesJson = json.dumps(cookies)

        print(cookiesJson)

        self.driver.quit()

    def login(self):
        
        try:
            self.driver.maximize_window()
            self.driver.get('https://www.chess.com/')
            self.driver.find_element(By.XPATH, '//*[@id="sb"]/div[2]/a[8]').click()
            
            elem = self.driver.find_element(By.ID, 'username')
            elem.clear()
            elem.send_keys('Perceptronx')
            elem = self.driver.find_element(By.ID, 'password')
            elem.clear()
            elem.send_keys('$xTL/!BA6q8_3aS')
            
            self.driver.find_element_by_xpath('//*[@id="login"]').click()

            try:
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "home-profile-link"))
                )

                print('\nLogin efetuado!\n')
                time.sleep(3)
                self.getCookies()
            except:
                pass
        except:
            pass

bot = Login()
bot.run()