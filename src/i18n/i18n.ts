import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { assetsBaseUrl, i18nBase } from '../services/config';

export const i18n = i18next.createInstance();

export async function initI18n(locale?: string) {
  const base = i18nBase || assetsBaseUrl || '';
  await i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      debug: true,
      lng: locale,
      fallbackLng: 'en',
      ns: ['common', 'items'],
      defaultNS: 'common',
      fallbackNS: 'items',
      backend: {
        loadPath: `${base}locales/{{ns}}_{{lng}}.json`,
        crossDomain: true,
      },
      returnNull: false,
      interpolation: {
        escapeValue: false,
      },
    });
  return i18n;
}
