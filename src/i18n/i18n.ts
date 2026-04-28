import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { assetsBaseUrl } from '../services/config';

export const i18n = i18next.createInstance();

export async function initI18n() {
  await i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      lng: 'en',
      fallbackLng: 'en',

      ns: ['common'],
      defaultNS: 'common',

      backend: {
        loadPath: `${assetsBaseUrl}locales/common_en.json`,
      },

      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
}
