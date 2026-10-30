import { ElementType } from 'react';
import { sections } from '../../components/navigation/sections';
import { imageBaseUrl } from '../../services/config';

/** A module of the app as the landing shows it: the navigation section with its illustration and description. */
export type LandingModule = { id: string; href: string; icon: ElementType; img: string; desc: string };

const DESCRIPTIONS: Record<string, string> = {
  core: 'shell.home.module-core-desc',
  strategic: 'shell.home.module-strategic-desc',
  tactical: 'shell.home.module-tactical-desc',
  npcs: 'shell.home.module-npcs-desc',
  items: 'landing-module-items-desc',
  spells: 'shell.home.module-spells-desc',
};

export const LANDING_MODULES: LandingModule[] = sections.map((section) => ({
  id: section.label,
  href: section.href,
  icon: section.icon,
  img: `${imageBaseUrl}images/generic/${section.label}.png`,
  desc: DESCRIPTIONS[section.label],
}));

/** The same misty landscape with a different action each: the hero changes the figure, not the place. */
export const HERO_IMAGES = [
  'action-melee-all.png',
  'action-maneuver-all.png',
  'action-initiative-all.png',
  'action-ranged-full.png',
  'action-movement-screen.png',
].map((file) => `${imageBaseUrl}images/actions/${file}`);

const VISITS_KEY = 'rmuLandingVisits';

/** A different hero image on each visit (a fresh browser starts with the first one). */
export const heroImageOfVisit = (): number => {
  try {
    const visits = Number(localStorage.getItem(VISITS_KEY) ?? 0) || 0;
    localStorage.setItem(VISITS_KEY, String(visits + 1));
    return visits % HERO_IMAGES.length;
  } catch {
    return 0;
  }
};
