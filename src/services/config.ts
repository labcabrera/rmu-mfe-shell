const getRequiredEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`[config] Missing required environment variable: ${name}`);
  }
  return value;
};

const withTrailingSlash = (value: string): string => (value.endsWith('/') ? value : `${value}/`);

export const userApiBaseUrl = process.env.RMU_API_USERS_URL;
export const mediaApiBaseUrl = process.env.RMU_API_MEDIA_URL;

export const assetsBaseUrl = withTrailingSlash(getRequiredEnv('RMU_MFE_ASSETS', process.env.RMU_MFE_ASSETS));
export const imageBaseUrl = assetsBaseUrl;
export const oidcUrl = getRequiredEnv('KC_URL', process.env.KC_URL);
export const oidcRealm = getRequiredEnv('KC_REALM', process.env.KC_REALM);
export const oidcClientId = getRequiredEnv('KC_CLIENT_ID', process.env.KC_CLIENT_ID);
export const i18nBase = process.env.RMU_MFE_I18N_BASE_URL ? withTrailingSlash(process.env.RMU_MFE_I18N_BASE_URL) : undefined;
