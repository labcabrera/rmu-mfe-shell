import { ElementType } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BackpackIcon from '@mui/icons-material/Backpack';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PublicIcon from '@mui/icons-material/Public';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';

export type NavLink = { label: string; href: string };
export type NavSection = { label: string; href: string; icon: ElementType; links: NavLink[] };

// Every section of the app with its pages. The rail, the drawer and the bottom navigation read it.
export const sections: NavSection[] = [
  {
    label: 'core',
    href: '/core',
    icon: MenuBookIcon,
    links: [
      { label: 'realms', href: '/core/realms' },
      { label: 'races', href: '/core/races' },
      { label: 'cultures', href: '/core/cultures' },
      { label: 'professions', href: '/core/professions' },
      { label: 'skill-categories', href: '/core/skill-categories' },
      { label: 'skills', href: '/core/skills' },
      { label: 'traits', href: '/core/traits' },
      { label: 'effect-types', href: '/core/effect-types' },
      { label: 'catalogs', href: '/core/catalogs' },
      { label: 'fighting-styles', href: '/core/fighting-styles' },
      { label: 'maneuvers', href: '/core/maneuvers' },
      { label: 'resistance-rolls', href: '/core/resistance-rolls' },
      { label: 'attack-tables', href: '/core/attack-tables' },
    ],
  },
  {
    label: 'strategic',
    href: '/strategic',
    icon: PublicIcon,
    links: [
      { label: 'strategic-games', href: '/strategic/games' },
      { label: 'factions', href: '/strategic/factions' },
      { label: 'characters', href: '/strategic/characters' },
    ],
  },
  {
    label: 'tactical',
    href: '/tactical',
    icon: SportsKabaddiIcon,
    links: [{ label: 'tactical-games', href: '/tactical/games' }],
  },
  { label: 'npcs', href: '/npcs', icon: GroupsIcon, links: [] },
  { label: 'items', href: '/items', icon: BackpackIcon, links: [] },
  {
    label: 'spells',
    href: '/spells',
    icon: AutoFixHighIcon,
    links: [
      { label: 'spell-lists', href: '/spells/spell-lists' },
      { label: 'spells', href: '/spells/spells' },
    ],
  },
];

/** The administration (spec 053): listed after the rest, only for the `rmu-admin` group. */
export const adminSection: NavSection = {
  label: 'administration',
  href: '/admin',
  icon: AdminPanelSettingsIcon,
  links: [
    { label: 'admin-users', href: '/admin/users' },
    { label: 'admin-games', href: '/admin/games' },
    { label: 'admin-characters', href: '/admin/characters' },
    { label: 'admin-activation-codes', href: '/admin/activation-codes' },
  ],
};

/** Section that contains `pathname`, if any. */
export const activeSection = (pathname: string): NavSection | undefined =>
  [...sections, adminSection].find((section) => pathname === section.href || pathname.startsWith(`${section.href}/`));

/** Whether `href` is the current page or one of its children (view/edit pages of a list). */
export const isActiveLink = (pathname: string, href: string): boolean => pathname === href || pathname.startsWith(`${href}/`);

// Immersive pages need the whole width (the combat board): the side navigation starts as an icon rail there,
// whatever the screen and the stored preference, and the site footer is not shown (spec 017).
const IMMERSIVE_ROUTES = [/^\/tactical\/combat\//];

/** Whether `pathname` is an immersive page. */
export const isImmersiveRoute = (pathname: string): boolean => IMMERSIVE_ROUTES.some((route) => route.test(pathname));

/** A navigation entry as a pill inset from the edges of the menu, so the selected one never touches the header. */
export const navItemSx = { mx: 1, my: 0.25, borderRadius: 1 } as const;

/** The section of the current page when one of its pages is selected: accent text, no fill (that is the page's). */
export const activeParentSx = { color: 'primary.main', '& .MuiListItemIcon-root': { color: 'primary.main' } } as const;
