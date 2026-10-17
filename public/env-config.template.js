// Runtime configuration, read through window.__RMU_CONFIG__ (see webpack.config.ts).
// The Docker image renders this file into env-config.js with envsubst (docker/40-env-config.sh);
// the webpack dev server serves the same keys from .env. Only public values belong here.
// The remotes mounted by the shell read this same object, so it also carries the URLs they use.
window.__RMU_CONFIG__ = {
  // Keycloak, public PKCE client.
  RMU_IAM_URI: '${RMU_IAM_URI}',
  RMU_IAM_REALM: '${RMU_IAM_REALM}',
  RMU_IAM_CLIENT_ID: '${RMU_IAM_CLIENT_ID}',
  // Static assets and locales.
  RMU_MFE_ASSETS_URI: '${RMU_MFE_ASSETS_URI}',
  RMU_MFE_I18N_URI: '${RMU_MFE_I18N_URI}',
  // Remote micro-frontends (trailing slash).
  RMU_MFE_CORE_PUBLIC_PATH: '${RMU_MFE_CORE_PUBLIC_PATH}',
  RMU_MFE_STRATEGIC_PUBLIC_PATH: '${RMU_MFE_STRATEGIC_PUBLIC_PATH}',
  RMU_MFE_TACTICAL_PUBLIC_PATH: '${RMU_MFE_TACTICAL_PUBLIC_PATH}',
  RMU_MFE_NPCS_PUBLIC_PATH: '${RMU_MFE_NPCS_PUBLIC_PATH}',
  RMU_MFE_ITEMS_PUBLIC_PATH: '${RMU_MFE_ITEMS_PUBLIC_PATH}',
  RMU_MFE_SPELLS_PUBLIC_PATH: '${RMU_MFE_SPELLS_PUBLIC_PATH}',
  // APIs (read by the shell and by the remotes).
  RMU_API_CORE_URI: '${RMU_API_CORE_URI}',
  RMU_API_STRATEGIC_URI: '${RMU_API_STRATEGIC_URI}',
  RMU_API_TACTICAL_URI: '${RMU_API_TACTICAL_URI}',
  RMU_API_ATTACK_TABLES_URI: '${RMU_API_ATTACK_TABLES_URI}',
  RMU_API_ITEMS_URI: '${RMU_API_ITEMS_URI}',
  RMU_API_NPC_NAMES_URI: '${RMU_API_NPC_NAMES_URI}',
  RMU_API_NPCS_URI: '${RMU_API_NPCS_URI}',
  RMU_API_SPELLS_URI: '${RMU_API_SPELLS_URI}',
  RMU_API_USERS_URI: '${RMU_API_USERS_URI}',
  RMU_API_MEDIA_URI: '${RMU_API_MEDIA_URI}',
  // Contact page (optional).
  RMU_SHELL_CONTACT_URI: '${RMU_SHELL_CONTACT_URI}',
  RMU_SHELL_CONTACT_EMAIL: '${RMU_SHELL_CONTACT_EMAIL}',
};
