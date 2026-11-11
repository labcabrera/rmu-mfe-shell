import { showStartupFailure } from './startup-failure';

import('./Bootstrap').catch(showStartupFailure);
export {};
