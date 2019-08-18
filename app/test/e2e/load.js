const puppeteer = require('puppeteer')

const config = require('./lib/config')

const loadUrl = require('./lib/helpers').loadUrl
const click = require('./lib/helpers').click
const typeText = require('./lib/helpers').typeText
const waitForText = require('./lib/helpers').waitForText
const shouldExist = require('./lib/helpers').shouldExist
const shouldTextNotBeEmpty = require('./lib/helpers').shouldTextNotBeEmpty
const shouldValueNotBeEmpty = require('./lib/helpers').shouldValueNotBeEmpty

describe('Loads application', () => {
  let browser
  let page

  before(async function() {
    browser = await puppeteer.launch({
      headless: config.isHeadless,
      slowMo: config.slowMo,
      devtools: config.isDevTools,
      timeout: config.launchTimeout,
      ignoreHTTPSErrors: config.ignoreHTTPSErrors
    })

    page = await browser.newPage()
    await page.setDefaultTimeout(config.waitingTimeout)
    await page.setViewport({
      width: config.viewportWidth,
      height: config.viewportHeight
    })
  })

  after(async function() {
    await browser.close()
  })

  it('Should Login User', async () => {
    await loadUrl(page, config.baseUrl)

    // Used for getting the newly opened window
    const pageTarget = page.target()

    // Get the loginPage
    await click(page, '#loginBtn')
    const loginPageTarget = await browser.waitForTarget(target => target.opener() === pageTarget)
    const loginPage = await loginPageTarget.page()

    // Login user
    await typeText(loginPage, 'toruspuppeteer@gmail.com', '#identifierId')
    await click(loginPage, '#identifierNext')
    await typeText(loginPage, 'toruse2e', 'input[type="password"]')
    await click(loginPage, '#passwordNext')

    await waitForText(page, '.wallet-home .headline', 'My Wallet')
  })

  it('Should change network to rinkeby', async () => {
    await click(page, '#settings-link')
    await shouldExist(page, '.wallet-settings')
    await click(page, '#expansion-network')

    await click(page, '#select-network')
    await page.waitFor(2000)
    await page.evaluate(() => {
      let options = [...document.querySelectorAll('.v-list-item__title')]
      options.forEach(function(option) {
        if (option.innerText == 'Rinkeby Test Network') option.click()
      })
    })

    await waitForText(page, '.v-select__selection.v-select__selection--comma', 'Rinkeby Test Network')
  })

  it('Should go to wallet transfer page', async () => {
    await click(page, '#transfer-link')
    await shouldExist(page, '.wallet-transfer')
    await page.waitFor(5000)
  })
})