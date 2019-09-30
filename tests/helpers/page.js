const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');
const puppeteer = require('puppeteer');

class CustomPage  {
    static async build() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function(target, property) {
                return customPage[property] || browser[property] || page[property];
            }
        });
    }

    constructor(page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        await this.page.setCookie({ name: 'session' , value: session });
        await this.page.setCookie({ name: 'session.sig' , value: sig });
        // Refresh the page 
        await this.page.goto('http://localhost:3000');

        await this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(selector) {
        return this.page.$eval( selector, el => el.innerHTML);
    }

    execRequests(actions){
        // Array of Promises => Will wait to resolve
        return Promise.all(
            actions.map(({ method, path, data}) => {
                return this[method](path , data);
            })
        );
    }

    // Fetch GET Requests
    get(path) {
        return this.page.evaluate((_path) => {
            /** Chromium Fetch API | To Test Temporary fetch() - create a new blog 
             * Open Chrome Console => Network => XHR
             * paste in Console tab:
            */
            return fetch(_path, {
                        method: 'GET',
                        credentials:'same-origin',
                        headers: {
                            'Content-Type':'application/json'
                        }   
                    })
                    .then(res => res.json());
            }, path );
    }

    post(path, data) {
        return this.page.evaluate((_path, _data) => {
            /** Chromium Fetch API | To Test Temporary fetch() - create a new blog 
             * Open Chrome Console => Network => XHR
             * paste in Console tab:
            */
            return fetch( _path, _data, {
                        method: 'POST',
                        credentials:'same-origin',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        // see route:'app.post('/api/blogs',...)'  const { title, content } = req.body;
                        body: JSON.stringify(_data)        
                    })
                    .then( res => res.json());
            }, 
            path, 
            data
        );
    }
}

module.exports = CustomPage;

/* Alternative Implementation with Override / Extend Page *//////////////////////////////////////////////////////////////////////////////////////////
// const Page = require('puppetter/lib/Page');

// Page.prototype.login = async function() {
//     const user = await userFactory();
//     const { session, sig } = sessionFactory(user);

//     await this.setCookie({ name: 'session' , value: session });
//     await this.setCookie({ name: 'session.sig' , value: sig });
//     // Refresh the page 
//     await this.goto('localhost:3000');

//     await this.waitFor('a[href="/auth/logout"]');
// };
