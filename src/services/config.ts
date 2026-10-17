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

// Stored images (entity imageUrl, media url/storageKey) are paths relative to the root of rmu-mfe-assets,
// e.g. `images/races/elf.png`. Same rules as resolveAssetUrl in rmu-react-shared-lib, which the shell does
// not depend on: absolute URLs (http:, https:, data:, blob:...) and root-relative paths are returned unchanged.
const NOT_ASSET_PATH = /^(?:[a-z][a-z0-9+.-]*:|\/)/i;

export function resolveAssetUrl(path: string): string;
export function resolveAssetUrl(path: string | null | undefined): string | undefined;
export function resolveAssetUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (NOT_ASSET_PATH.test(path)) return path;
  const separator = assetsBaseUrl.endsWith('/') ? '' : '/';
  return `${assetsBaseUrl}${separator}${path.replace(/^\.\//, '')}`;
}
export const oidcUrl = getRequiredEnv('RMU_IAM_URI', process.env.RMU_IAM_URI);
export const oidcRealm = getRequiredEnv('RMU_IAM_REALM', process.env.RMU_IAM_REALM);
export const oidcClientId = getRequiredEnv('RMU_IAM_CLIENT_ID', process.env.RMU_IAM_CLIENT_ID);
export const i18nBase = process.env.RMU_MFE_I18N_URI ? withTrailingSlash(process.env.RMU_MFE_I18N_URI) : undefined;
