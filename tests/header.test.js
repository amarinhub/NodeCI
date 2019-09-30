const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    page.close();
});

test('Application Header Text has correct text', async () => {
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toEqual('Blogster');
});

test('Clicking Login starts OAuth Flow', async () => {
    await page.click('.right a');

    const url = await page.url();

    /** https://jestjs.io/docs/en/expect#tomatchregexporstring */
    expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows Logout button', async () => {
    await page.login();
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual('Logout');
});
