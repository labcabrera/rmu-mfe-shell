// Silent sign-in / renew callback (silent_redirect_uri), loaded by silent-check-sso.html.
// Posts the same message as oidc-client-ts IFrameWindow.notifyParent() (signinSilentCallback):
// { source: 'oidc-client', url, keepOpen: false }, only to this origin. The parent's
// IFrameWindow ignores messages with another origin or source.
(function () {
  if (window.parent === window) return;
  window.parent.postMessage({ source: 'oidc-client', url: window.location.href, keepOpen: false }, window.location.origin);
})();
