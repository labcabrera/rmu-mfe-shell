// Workspace spec 091, A8: what shows when the application cannot start. It uses no React or i18next, as they may be
// what failed.
const TEXTS = {
  en: { title: 'RMU Engine could not start', text: 'Check your connection and reload the page.', reload: 'Reload' },
  es: { title: 'RMU Engine no ha podido arrancar', text: 'Comprueba tu conexión y recarga la página.', reload: 'Recargar' },
};

export const showStartupFailure = (error) => {
  console.error('[shell] Startup failed', error);
  const language = (localStorage.getItem('locale') || navigator.language || 'en').slice(0, 2);
  const texts = TEXTS[language] || TEXTS.en;
  const root = document.getElementById('app');
  if (!root) return;
  const panel = document.createElement('div');
  panel.style.cssText = 'font-family:sans-serif;text-align:center;padding:64px 16px';
  const title = document.createElement('h1');
  title.textContent = texts.title;
  const text = document.createElement('p');
  text.textContent = texts.text;
  const reload = document.createElement('button');
  reload.textContent = texts.reload;
  reload.onclick = () => window.location.reload();
  panel.append(title, text, reload);
  root.replaceChildren(panel);
};
