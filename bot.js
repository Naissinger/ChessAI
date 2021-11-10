const {Builder, By, Key, until, WebElement} = require('selenium-webdriver');

class Browser {

    constructor() {
        
        this.driver;
        this.urlAtual;
        this.estado;
        this.username = 'naissingerbrasil@gmail.com';
        this.password = 'K8cyMytziNtq7qy';
    }

    async run() {
        await this.main();
    }

    async login() {

        await this.driver.manage().window().maximize();

        let loginAttempt = 1;
        while(loginAttempt <= 10) {
            try {
                await this.driver.get('https://binomo.com/');
                await this.driver.sleep(2000);
                await this.driver.findElement(By.className('button_btn__dCMn2')).click();    
                await this.driver.sleep(1000);
                await this.driver.findElement(By.xpath('/html/body/app-sidebar/div/vui-sidebar/div/div/div/lib-platform-scroll/div/div/ng-component/vui-tabs/div/div[1]/div/vui-tab-button[2]/div/button')).click();
                await this.driver.sleep(1000);
                await this.driver.findElement(By.id('qa_auth_LoginEmailInput')).click();
                await this.driver.findElement(By.xpath('//*[@id="qa_auth_LoginEmailInput"]/vui-input/div[1]/div[1]/vui-input-text/input')).sendKeys(this.username);                               
                await this.driver.findElement(By.id('qa_auth_LoginPasswordInput')).click();                               
                await this.driver.findElement(By.xpath('//*[@id="qa_auth_LoginPasswordInput"]/vui-input/div[1]/div[1]/vui-input-password/input')).sendKeys(this.password);  
                await this.driver.findElement(By.id('qa_auth_LoginBtn')).click();

                await this.driver.sleep(1500);
                await this.driver.switchTo().frame(0);
                await this.driver.findElement(By.id('recaptcha-token'));

            } catch(NoSuchElementError) {
                console.log('Login Efetuado com sucesso!');
                return true;
            } finally {
                console.log(`Tentativa ${loginAttempt}: Tentando passar Captcha...`);
                loginAttempt++;
            }
        }

        return false;
    }

    async inicializa() {
        
        const chrome = require("selenium-webdriver/chrome");
        const chromeOptions = new chrome.Options();

        chromeOptions.addArguments("test-type");
        chromeOptions.addArguments("--js-flags=--expose-gc");
        chromeOptions.addArguments("--enable-precise-memory-info");
        chromeOptions.addArguments("--disable-popup-blocking");
        chromeOptions.addArguments("--disable-default-apps");
        chromeOptions.addArguments("--disable-infobars");
        chromeOptions.addArguments(['user-agent="Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.11 Safari/537.36"']);

        this.driver = new Builder().forBrowser('chrome').setChromeOptions().build();
    }

    async inicia() {

        while(true) {

        }
    }

    async encerraBrowser() {

        console.log('Não foi possível passar o Captcha, a sessão será encerrada.\n');
        await this.driver.sleep(5000);
        this.driver.quit();
    }

    async main() {

        this.inicializa();

        try{
            if(await this.login()) {
                await this.inicia();
            } else {
                console.log('\nHouve um erro ao efetuar login. Verifique as credenciais\n');

                this.encerraBrowser();
            }
            

        } finally {

        }
    }
}

const browser = new Browser();
browser.run();