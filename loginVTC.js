// Tao 1 form Login
// Login nhieu se bi dinh captcha
// Khi dinh captcha, get url https://header.vtcgame.vn/home/commonv2, tim den $("#key").val();
// Lay key xong fetch dang nhap cung voi key vua get
// Kiem tra key bi het han hoac nhap nhieu lan, doi key khac nhu buoc 3

const fetch = require("node-fetch");
const cheerio = require('cheerio');
const axios = require('axios');

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
        });
        const $ = cheerio.load(getUrl.data)
        return {
            key: $("#key").val(),
            headers: getUrl.headers
        }
    } catch (error) {
        console.log(error)
    }

}

(async () => {
    try {
       let test =  await getKey()
       console.log(test)
    } catch (error) {
        console.log(error)
    }
})()