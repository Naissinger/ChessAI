const {Builder, By, Key, until, WebElement, WebDriver, Actions} = require('selenium-webdriver');
const { spawn } = require('child_process');
const util = require('util');
const fs = require('fs');
const writeFile = util.promisify(fs.writeFile);
const request = require('sync-request');

class Browser {

    constructor() {
        
        this.driver;
        this.urlAtual;
        this.estado;
        this.login;
        this.turn = false;
        this.hintsOn = false;
        this.notEatandMove = 0;
        this.moves = 1;
        this.playMove;
        this.password;
        this.player;
        this.oponent;
        this.board = [
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
        ];
    } 

    async run() {

        await this.main();

    }

    async getLogin() {
        
        try {
            
            this.login = 'EloRush';
            this.password = 'b6?d7N4NZ-QkJi&';
            
            if(this.password != '' && this.login != '') {
                return true;
            } else {
                return false;
            }

        } finally {

        }
    }
    
    async relacaoEntrePecas(peca) {
        
        switch(peca) {
            case "br":
                return "r";
            case "bb":
                return "b";
            case "bq":
                return "q";
            case "bn":
                return "n";
            case "bp":
                return "p";
            case "bk":
                return "k";
            case "wr":
                return "R";
            case "wb":
                return "B";
            case "wq":
                return "Q";
            case "wn":
                return "N";
            case "wp":
                return "P";
            case "wk":
                return "K";
        }
    }

    async relacaoPecas(peca) {
        
        switch(peca) {
            case "r":
                return "br";
            case "b":
                return "bb";
            case "q":
                return "bq";
            case "n":
                return "bn";
            case "p":
                return "bp";
            case "k":
                return "bk";
            case "R":
                return "wr";
            case "B":
                return "wb";
            case "Q":
                return "wq";
            case "N":
                return "wn";
            case "P":
                return "wp";
            case "K":
                return "wk";
        }
    }

    async relacaoEntreCasas(casa) {
        
        var dePara = [];

        if(this.player == "White") {
            dePara = [
                18, 28, 38, 48, 58, 68, 78, 88,
                17, 27, 37, 47, 57, 67, 77, 87,
                16, 26, 36, 46, 56, 66, 76, 86,
                15, 25, 35, 45, 55, 65, 75, 85,
                14, 24, 34, 44, 54, 64, 74, 84,
                13, 23, 33, 43, 53, 63, 73, 83,
                12, 22, 32, 42, 52, 62, 72, 82,
                11, 21, 31, 41, 51, 61, 71, 81,
            ];

            return dePara.indexOf(casa);

        } else if(this.player == "Black") {
            dePara = [
                81, 71, 61, 51, 41, 31, 21, 11,
                82, 72, 62, 52, 42, 32, 22, 12,
                83, 73, 63, 53, 43, 33, 23, 13,
                84, 74, 64, 54, 44, 34, 24, 14,
                85, 75, 65, 55, 45, 35, 25, 15,
                86, 76, 66, 56, 46, 36, 26, 16,
                87, 77, 67, 57, 47, 37, 27, 17,
                88, 78, 68, 58, 48, 38, 28, 18,
            ];

            return dePara.indexOf(casa);
        }
    }

    async updateBoard(boardArray) {
        
        await this.clearBoard();
        
        for(let i = 0; i < boardArray.length; i++) {
            
            if(boardArray[i] != '') {
                var nome = await boardArray[i].split(" ");
                var posicao = await boardArray[i].split("-");
            
                var piece = await this.relacaoEntrePecas(nome[1]);
                var pos = await this.relacaoEntreCasas(parseInt(posicao[1]));

                this.board[pos] = piece;
            } else {
                var posicao = await boardArray[i].split("-");
                var pos = await this.relacaoEntreCasas(parseInt(posicao[1]));

                this.board[pos] = '';
            }
        }

        let count = 0;
        let boardView = '';

        for(let i = 0; i < 64; i++) {
            
            if(this.board[i] == '') {
                boardView = boardView + `[ ]`
            } else {
                boardView = boardView + `[${this.board[i]}]`
            }
            
            count++;
            if(count == 8) {
                boardView = boardView + '\n';
                count = 0;
            }
        }
        console.log('--------------')
        console.log(`\nBoard View:`);
        console.log(`\n${boardView}\n`);
    }

    async getBoardState() {

        const id = await this.driver.findElement(By.tagName('chess-board')).getAttribute('id');

        let boardArray = [];

        for(let i = 4; i <= 64; i++) {
            try {
                boardArray.push(await this.driver.findElement(By.xpath(`//*[@id="${id}"]/div[${i}]`)).getAttribute("class"));
            } catch(NoSuchElementError) {
                continue;
            }
        }

        await this.updateBoard(boardArray);
    }

    async initialize() {
        
        const chrome = require("selenium-webdriver/chrome");
        const chromeOptions = new chrome.Options();

        chromeOptions.addArguments("ignore-certificate-errors");
        chromeOptions.addArguments("--no-sandbox");
        chromeOptions.addArguments("--disable-blink-features=AutomationControlled");

        this.driver = new Builder().withCapabilities(chromeOptions).build();
    }

    async makeLogin() {

        if(await this.getLogin()) {
                try {

                    await this.driver.get('https://www.chess.com/')
                    await this.driver.findElement(By.className('button auth login ui_v5-button-component ui_v5-button-primary')).click();
                    await this.driver.sleep(1000);
                    await this.driver.findElement(By.id('username')).sendKeys(this.login);
                    await this.driver.findElement(By.id('password')).sendKeys(this.password);
                    await this.driver.findElement(By.id('login')).click();

                    while(true) {
                        try {
                            await this.driver.findElement(By.className('home-username'))
                            console.log('Login efetuado com sucesso.');
                            return true;
                        } catch(error) {

                        }
                    }

                } catch(NoSuchElementError) {
                    
                }
        }
    }

    async startMatch() {

        try {

            await this.driver.get('https://www.chess.com/play/online');
            await this.driver.sleep(1000);
            await this.driver.findElement(By.xpath('//*[@id="board-layout-sidebar"]/div/div[2]/div/div/div[1]/div[1]/div/div/button')).click();
            await this.driver.findElement(By.xpath('//*[@id="board-layout-sidebar"]/div/div[2]/div/div/div[1]/div[1]/div/div/div/div[3]/div/button[1]')).click();
            await this.driver.findElement(By.xpath('//*[@id="board-layout-sidebar"]/div/div[2]/div/div/div[1]/div[1]/div/button')).click();

        } finally {

        }

        return true;
    }

    async noLogin() {

        try {
            await this.driver.get('https://www.chess.com');
            await this.driver.findElement(By.className('nav-link-component nav-link-main-link nav-link-top-level sprite play-top')).click();
            await this.driver.findElement(By.xpath('//*[@id="board-layout-sidebar"]/div/div[2]/div/a[1]')).click();
            await this.driver.sleep(2000);
            await this.driver.findElement(By.xpath('//*[@id="board-layout-sidebar"]/div/div[2]/div/div/div[1]/div[1]/div/div/button')).click();
            await this.driver.findElement(By.xpath('//*[@id="board-layout-sidebar"]/div/div[2]/div/div/div[1]/div[1]/div/div/div/div[3]/div/button[1]')).click();
            await this.driver.findElement(By.xpath('//*[@id="board-layout-sidebar"]/div/div[2]/div/div/div[1]/div[1]/div/button')).click();
            await this.driver.findElement(By.xpath('/html/body/div[22]/div/div/div[1]/div/label[4]')).click();
            await this.driver.findElement(By.id('guest-button')).click();
            await this.driver.sleep(2000);
            await this.driver.findElement(By.xpath('//*[@id="board-layout-sidebar"]/div/div[2]/div/div/div[1]/div[1]/div/div/button')).click();
            await this.driver.findElement(By.xpath('//*[@id="board-layout-sidebar"]/div/div[2]/div/div/div[1]/div[1]/div/div/div/div[3]/div/button[1]')).click();
            await this.driver.findElement(By.xpath('//*[@id="board-layout-sidebar"]/div/div[2]/div/div/div[1]/div[1]/div/button')).click();

            await this.driver.wait(until.elementIsVisible(By.className('user-tagline-rating user-tagline-dark')));
                
        } catch(NoSuchElementError) {
            
        } 
    }

    async turnHintsOn() {
        await this.driver.findElement(By.id('board-controls-settings')).click();
        await this.driver.sleep(1500);
        await this.driver.findElement(By.xpath('/html/body/div[8]/div[2]/div[2]/div/div[11]/div[1]/label/div')).click();
        await this.driver.findElement(By.className('ui_v5-button-component ui_v5-button-primary settings-modal-container-button')).click();
    }

    async personalizeBoard(piece, board) {
        await this.driver.findElement(By.id('board-controls-settings')).click();
        await this.driver.sleep(1500);
        await this.driver.findElement(By.xpath('/html/body/div[8]/div[2]/div[2]/div/div[2]/select')).click();
        await this.driver.findElement(By.xpath(`/html/body/div[8]/div[2]/div[2]/div/div[2]/select/option[${piece}]`)).click();
        await this.driver.findElement(By.xpath('/html/body/div[8]/div[2]/div[2]/div/div[3]/select')).click();
        await this.driver.findElement(By.xpath(`/html/body/div[8]/div[2]/div[2]/div/div[3]/select/option[${board}]`)).click();
        await this.driver.findElement(By.className('ui_v5-button-component ui_v5-button-primary settings-modal-container-button')).click();
    }

    async screenShot() {

        let id = await this.driver.findElement(By.tagName('chess-board')).getAttribute('id');
        let board = await this.driver.findElement(By.id(id));
        
        while(true) {
            try {
                let image = await board.takeScreenshot();
                await writeFile('board.png', image, 'base64');
                break;
            } catch(error) {
                continue;
            }
        }
    }

    async inicia() {
        
        // await this.turnHintsOn();
        // await this.personalizeBoard(8, 4);

        while(true) {
            await this.restart();
            await this.getPlayerColor();
            await this.getPlayerTurn();
            await this.getBoardState();
            await this.boardToFen();
            await this.move();
        }
    }

    async numberConvert(letter) {

        if(this.player == "White") {

            switch(letter) {
                case "h":
                    return 8;
                case "g":
                    return 7;
                case "f":
                    return 6;
                case "e":
                    return 5;
                case "d":
                    return 4;
                case "c":
                    return 3;
                case "b":
                    return 2;
                case "a":
                    return 1;
            }
        } else if(this.player == "Black") {
            switch(letter) {
                case "h":
                    return 8;
                case "g":
                    return 7;
                case "f":
                    return 6;
                case "e":
                    return 5;
                case "d":
                    return 4;
                case "c":
                    return 3;
                case "b":
                    return 2;
                case "a":
                    return 1;
            }
        }


    }

    async piece(pos) {
        
        var index = await this.relacaoEntreCasas(pos);

        return await this.relacaoPecas(this.board[index]);
    }

    async negras(number) {

        switch(number) {
            case "1":
                return '8';
            case "2":
                return '7';
            case "3":
                return '6';
            case "4":
                return '5';
            case "5":
                return '4';
            case "6":
                return '3';
            case "7":
                return '2';
            case "8":
                return '1';
        }
    }

    async move() {
        
        await this.restart();

        try {
            if(this.player == "White") {
                var splitMove = this.playMove.split('');
                var square = await this.numberConvert(splitMove[0]);
                var piecePos = square + splitMove[1];
                var piecePos = parseInt(piecePos);
                var piece = await this.piece(piecePos);
                await this.driver.findElement(By.className(`piece ${piece} square-${piecePos}`)).click();

                var squareHint = await this.numberConvert(splitMove[2]);
                var piecePosHint = squareHint + splitMove[3];
                var piecePosHint = parseInt(piecePosHint);

            } else if(this.player == "Black") {
                var splitMove = this.playMove.split('');
                var square = await this.numberConvert(splitMove[0]);
                var piecePos = square + splitMove[1];
                var piecePos = parseInt(piecePos);
                var piece = await this.piece(piecePos);

                await this.driver.findElement(By.className(`piece ${piece} square-${piecePos}`)).click();

                var squareHint = await this.numberConvert(splitMove[2]);
                var piecePosHint = squareHint + splitMove[3];
                var piecePosHint = parseInt(piecePosHint);

            }

            try {
                var element = await this.driver.findElement(By.className(`hint square-${piecePosHint}`));
            } catch(error) {
                try {
                    var element = await this.driver.findElement(By.className(`capture-hint square-${piecePosHint}`));
                    this.notEatandMove = 0;
                }catch(error) {

                }
            }
            
            await this.driver.actions({bridge: true}).move({x: 0, y: 0, origin: element}).press().perform();
            
            await this.driver.sleep(1000);

            if(await this.getPlayerTurn()) {
                console.log('\nSeu Turno!');
                this.moves++;
                this.hintsOn = true;
            }
        } catch(error) {
            try {
                if(this.hintsOn == false) {
                    await this.turnHintsOn();
                }
            } catch(error) {
                console.log(error);
            }
        }
    }

    async restart() {

        try {
            if(await this.driver.findElement(By.xpath('//*[@id="board-layout-sidebar"]/div/div[2]/div[2]/div[1]/button[2]'))) {
                await this.driver.findElement(By.xpath('//*[@id="board-layout-sidebar"]/div/div[2]/div[2]/div[1]/button[2]')).click();
                this.moves = 0;
            }
        } catch(error) {
            
        }
    }

    async main() {

        try {
            this.initialize();

            await this.driver.manage().window().maximize();
            
            // await this.noLogin();
            // await this.inicia();
            if(await this.makeLogin()) {
                await this.startMatch();
                await this.inicia();
            } else {
                console.log('Houve um erro ao efetuar login. Verifique as credenciais.');
            }
            
        } catch(error) {

        }
    }

    async getUrl() {

        return await this.driver.getCurrentUrl();
    }

    async getPlayerTurn() {

        this.turn = false;

        if(this.player == "White") {

            while(true) {

                await this.restart();

                try{
                    if(await this.driver.findElement(By.className('clock-component clock-white clock-bottom clock-live clock-running player-clock clock-player-turn'))) {
                        
                        this.turn = true;
                        return true;
                    }
                } catch(NoSuchElementError) {
                    try {
                        if(await this.driver.findElement(By.className('clock-component clock-black clock-bottom clock-live clock-running player-clock clock-player-turn'))) {
                        
                            this.turn = true;
                            return true;
                        }
                    } catch(error) {

                    }
                }
            }
        } else if(this.player == "Black") {

            while(true) {

                await this.restart();
                
                try {
                    if(await this.driver.findElement(By.className('clock-component clock-black clock-bottom clock-live clock-running player-clock clock-player-turn'))) {
                        
                        this.turn = true;
                        return true;
                    }
                } catch(NoSuchElementError) {
                    try {
                        if(await this.driver.findElement(By.className('clock-component clock-white clock-bottom clock-live clock-running player-clock clock-player-turn'))) {
                        
                            this.turn = true;
                            return true;
                        }
                    } catch(error) {
                        
                    } 
                }
            }
        }
    }

    async clearBoard() {

        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = '';
        }
    }

    async boardToFen() {

        while(true) {

            await this.restart();

            try {
                if(this.turn) {

                    await this.screenShot();
                    
                    const fenRegex = /FEN:([\w\W]{0,})F/gm;
                    const accuracyRegex = /(Final Certainty: [\d\.\%]{0,})/gm;

                    let result = require('child_process').execSync("python tensorflow_chessbot.py --filepath board.png").toString();
                    let fen = fenRegex.exec(result);
                    let fenString = fen[1].replace(/(?:\\[rn]|[\r\n]+)+/g, "");
                    fenString = fenString.replace('0 1', `0 ${this.moves}`);
                    if(this.player == "Black")
                        fenString = fenString.replace('w', 'b');
                    let accuracy = accuracyRegex.exec(result);
                    
                    console.log('--------------')
                    console.log(`\nFEN: ${fenString}`);
                    console.log(accuracy[1]);

                    let object = await this.calculateMove(fenString);
                    // let bestMove = object.body.toString();
                    console.log('--------------')
                    console.log(`\nBest Move: ${object}`)
                    this.playMove = object;

                    if(this.playMove)
                        break;
                }
            } catch(error) {
                console.log(error)
            }
        }
    }

    async calculateMove(fen) {
        
        try {
            
            const regex = /Best Move: ([\w\W]{4})/gm;
            const regexMate = /(Mate em: [\w\W]{0,})/gm;
            let result;

            if(this.player == "White") {
                result = require('child_process').execSync(`python calculateMove.py -f "${fen}"`).toString();
            } else if(this.player == "Black") {
                result = require('child_process').execSync(`python calculateMove.py -f "${fen}" -b`).toString();
            }
            let move = regex.exec(result);
            let bestMove = move[1].replace(/(?:\\[rn]|[\r\n]+)+/g, "");
            let mate = regexMate.exec(result);
            let m = mate[1].replace(/(?:\\[rn]|[\r\n]+)+/g, "");

            console.log('--------------')
            console.log(`\n${m}`);

            return bestMove
            
            let response = await request('POST', `https://chess.apurn.com/nextmove`, {
                body: `${fen}`,
                headers: {
                    'Content-Type': 'text/plain'
                  }
            });

            return response;
        } catch(error) {
            console.log(error);
        }
    }

    async getPlayerColor() {

        while (true) {

            await this.restart();

            try {
                if(await this.driver.findElement(By.className('clock-component clock-black clock-bottom clock-live clock-running player-clock clock-player-turn')) || await this.driver.findElement(By.className('clock-component clock-black clock-bottom clock-live player-clock'))) {
                    this.player = 'Black';
                    this.oponent = 'White';
                    break;
                }
            } catch(NoSuchElementError) {
                try {
                    if(await this.driver.findElement(By.className('clock-component clock-white clock-bottom clock-live clock-running player-clock clock-player-turn')) || await this.driver.findElement(By.className('clock-component clock-white clock-bottom clock-live player-clock'))) {
                        this.player = 'White';
                        this.oponent = 'Black';
                        break;
                    }
                } catch(NoSuchElementError) {
                    continue;
                }
            }
        }

        // console.log(`Player: ${this.player}`);
        // console.log(`Oponent: ${this.oponent}`);
    }

}

const browser = new Browser();
browser.run();