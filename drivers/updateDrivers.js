const fs = require('fs');
const request = require("request")
const decompress = require('decompress');

class Update
{
    run()
    {
        this.atualizaChrome();
        this.atualizaGecko();
    }

    async atualizaChrome()
    {
        let version = await new Promise((resolve, reject) => {
            const options = {
                method: "GET",
                url: "https://chromedriver.storage.googleapis.com/LATEST_RELEASE",
                encoding: "utf8"
            }

            request(options, (err, response, body) => {
                resolve(body);
            })
        })

        if (version) 
        {
            console.log("Versão do Chrome: " + version);

            const buffer = await new Promise((resolve, reject) => {
                const options = {
                    method: "GET",
                    url: `https://chromedriver.storage.googleapis.com/${version}/chromedriver_win32.zip`,
                    encoding: null
                }
        
                request(options, (err, response, body) => {
                    resolve(body);
                })
            })
            
            fs.writeFileSync(__dirname + "\\chromedriver.zip", buffer, 'binary');

            decompress(__dirname + "\\chromedriver.zip")
                .then((files) => {
                    fs.writeFileSync(__dirname + `\\${files[0].path}`, files[0].data, 'binary');
                    fs.unlinkSync(__dirname + "\\chromedriver.zip");

                    console.log("Driver Chrome atualizado com sucesso!");
                })
        }
        else { console.log("Não foi possível identificar a versão do Chrome") }
    }

    async atualizaGecko()
    {
        let version = await new Promise((resolve, reject) => {
            const options = {
                method: "GET",
                url: "https://github.com/mozilla/geckodriver/releases/latest",
                encoding: "utf8",
                followRedirect: true
            }

            request(options, (err, response, body) => {
                resolve(/geckodriver-v([\w\W]*?)-/gm.exec(body)[1]);
            })
        })

        if (version)
        {
            console.log("Versão do Gecko: " + version);

            const buffer = await new Promise((resolve, reject) => {
                const options = {
                    method: "GET",
                    url: `https://github.com/mozilla/geckodriver/releases/download/v0.31.0/geckodriver-v${version}-win32.zip`,
                    encoding: null,
                    followRedirect: true
                }

                request(options, (err, response, body) => {
                    resolve(body);
                })
            })

            fs.writeFileSync(__dirname + "\\geckodriver.zip", buffer, 'binary');

            decompress(__dirname + "\\geckodriver.zip")
            .then((files) => {
                fs.writeFileSync(__dirname + `\\${files[0].path}`, files[0].data, 'binary');
                fs.unlinkSync(__dirname + "\\geckodriver.zip");

                console.log("Driver Gecko atualizado com sucesso!");
            })
        }
        else { console.log("Não foi possível identificar a versão do Gecko") }
    }
}

const update = new Update();
update.run();