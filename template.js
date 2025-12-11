export function renderPage(lang, page) {
  const header = createHeader(lang);
  const nav = createNav(lang, page);
  const footer = createFooter();
  
  return { header, nav, footer };
}
