// Tao 1 form Login
// Login nhieu se bi dinh captcha
// Khi dinh captcha, get url https://header.vtcgame.vn/home/commonv2, tim den $("#key").val()
// Lay key xong axios dang nhap cung voi key vua get
// Kiem tra key bi het han hoac nhap nhieu lan, doi key khac nhu buoc 3

const cheerio = require('cheerio')
const axios = require('axios')

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
            data: 'conten=' + new Buffer(user).toString("base64") + '&value=' + new Buffer(pass).toString("base64") +'&capt=&hidverify=&isRemember=false&key='+key+'&otp=&otpType=1&returnURL=http%3A%2F%2Flocalhost%3A3955%2F:'
        })
        console.log(login.data)
    } catch (error) {
        console.log(error)
    }
}

(async () => {
    try {
        let getKeyandHeaders =  await getKey()
        var cookieSession = new RegExp('[; ]ASP.NET_SessionId=([^\\s;]*)');
            cookieSession = (' ' + getKeyandHeaders.headers["set-cookie"][0]).match(cookieSession);
            cookieSession = unescape(cookieSession[1]);
        await doLogin('systesm4', 'taolavip', cookieSession, getKeyandHeaders.key)
    } catch (error) {
        console.log(error)
    }
})()