const LoginPage = require('../../pages/loginpage');
const FavouritesPage = require('../../pages/favouritespage');
const { BASE_URL } = require('../constants');

async function loginAndOpenFavourites(page) {
  await page.goto(BASE_URL);
  if (/microsoftonline|login|signin/i.test(page.url())) {
    const loginPage = new LoginPage(page);
    await loginPage.loginToApplication();
  }

  const favouritesPage = new FavouritesPage(page);
  const isVisible = await favouritesPage.heading.isVisible().catch(() => false);
  if (!isVisible) {
    await favouritesPage.openFromTopNav();
  }

  return favouritesPage;
}

function normalizeText(value) {
  return `${value || ''}`.trim().toLowerCase().replace(/\s+/g, ' ');
}

function pickAddableProjectOption(options, existingProjectNames = []) {
  const existing = existingProjectNames.map(normalizeText).filter(Boolean);

  const validOptions = options.filter((option) => {
    const normalized = normalizeText(option);
    if (!normalized) return false;
    if (normalized.includes('select')) return false;
    if (normalized.includes('choose')) return false;
    if (normalized.includes('please')) return false;
    return true;
  });

  const nonDuplicate = validOptions.find((option) => {
    const normalizedOption = normalizeText(option);
    return !existing.some(
      (projectName) => normalizedOption.includes(projectName) || projectName.includes(normalizedOption)
    );
  });

  return nonDuplicate || validOptions[0];
}

module.exports = {
  loginAndOpenFavourites,
  pickAddableProjectOption,
};
