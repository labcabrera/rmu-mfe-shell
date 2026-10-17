const getRequiredEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`[config] Missing required environment variable: ${name}`);
  }
  return value;
};

const withTrailingSlash = (value: string): string => (value.endsWith('/') ? value : `${value}/`);

export const userApiBaseUrl = process.env.RMU_API_USERS_URI;
export const mediaApiBaseUrl = process.env.RMU_API_MEDIA_URI;

export const assetsBaseUrl = withTrailingSlash(getRequiredEnv('RMU_MFE_ASSETS_URI', process.env.RMU_MFE_ASSETS_URI));
export const imageBaseUrl = assetsBaseUrl;
export const oidcUrl = getRequiredEnv('RMU_IAM_URI', process.env.RMU_IAM_URI);
export const oidcRealm = getRequiredEnv('RMU_IAM_REALM', process.env.RMU_IAM_REALM);
export const oidcClientId = getRequiredEnv('RMU_IAM_CLIENT_ID', process.env.RMU_IAM_CLIENT_ID);
export const i18nBase = process.env.RMU_MFE_I18N_URI ? withTrailingSlash(process.env.RMU_MFE_I18N_URI) : undefined;
