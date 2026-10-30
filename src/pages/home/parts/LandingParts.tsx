import React, { FC, ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Link as RouterLink } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Link,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { enterSx } from '@labcabrera-rmu/rmu-react-shared-lib';
import { LandingData } from '../useLandingData';

/** Product name, not translated. */
const PRODUCT_NAME = 'Rolemaster Unified Companion';

/** The product name in the display font of the theme. */
export const LandingTitle: FC<{ size?: 'large' | 'medium' }> = ({ size = 'large' }) => (
  <Typography
    component="h1"
    sx={{
      fontFamily: (theme) => theme.fonts.display,
      fontWeight: 600,
      lineHeight: 1.05,
      fontSize: size === 'large' ? { xs: '2.25rem', sm: '3rem', md: '4rem' } : { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
      textShadow: '0 2px 12px rgba(0,0,0,0.5)',
    }}
  >
    {PRODUCT_NAME}
  </Typography>
);

/** A thin ornament under a title: a line, a diamond and a line, in the primary color. */
export const Ornament: FC = () => (
  <Stack direction="row" spacing={1} aria-hidden sx={{ alignItems: 'center', color: 'primary.light', my: 1.5 }}>
    <Box sx={{ width: 48, height: '1px', bgcolor: 'currentColor', opacity: 0.7 }} />
    <Box sx={{ width: 8, height: 8, border: '1px solid currentColor', transform: 'rotate(45deg)' }} />
    <Box sx={{ width: 48, height: '1px', bgcolor: 'currentColor', opacity: 0.7 }} />
  </Stack>
);

/** The main actions of the hero: sign in when signed out, else start a campaign; the guide in both. */
export const HeroActions: FC<{ signedIn: boolean }> = ({ signedIn }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  return (
    <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
      {signedIn ? (
        <Button variant="contained" size="large" component={RouterLink} to="/strategic/games/create">
          {t('shell.home.start-campaign')}
        </Button>
      ) : (
        <Button variant="contained" size="large" startIcon={<LoginIcon />} onClick={() => void auth.signinRedirect()}>
          {t('landing-sign-in')}
        </Button>
      )}
      <Button variant="outlined" size="large" component={RouterLink} to="/docs" sx={{ color: 'common.white', borderColor: 'rgba(255,255,255,0.6)' }}>
        {t('shell.home.get-started')}
      </Button>
    </Stack>
  );
};

/** The non-affiliation note, small and in the colors of the theme. */
export const DisclaimerNote: FC<{ onDark?: boolean }> = ({ onDark }) => (
  <Typography
    variant="caption"
    component="p"
    sx={{ color: onDark ? 'rgba(255,255,255,0.7)' : 'text.secondary', maxWidth: 760, '& a': { color: 'inherit' } }}
  >
    <Trans i18nKey="home-disclaimer" components={{ link: <Link href="https://ironcrown.co.uk/" /> }} />
  </Typography>
);

/** A section heading of the landing. */
export const SectionTitle: FC<{ children: ReactNode; action?: ReactNode }> = ({ children, action }) => (
  <Stack direction="row" sx={{ alignItems: 'baseline', mb: 2 }}>
    <Typography variant="h5" component="h2" sx={{ fontFamily: (theme) => theme.fonts.display, fontWeight: 600 }}>
      {children}
    </Typography>
    {action && <Box sx={{ ml: 'auto' }}>{action}</Box>}
  </Stack>
);

/**
 * Where to go on: the first tactical game in progress and the first campaign. Signed out, an invitation to sign in.
 * It sits on the hero, so it is a translucent card.
 */
export const ContinuePanel: FC<{ data: LandingData }> = ({ data }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const game = data.tacticalGames[0];
  const campaign = data.strategicGames[0];
  const glass = {
    bgcolor: 'rgba(12,14,18,0.55)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.14)',
    color: 'common.white',
    p: 2,
  };

  if (!data.signedIn) {
    return (
      <Card sx={glass}>
        <Typography variant="overline" sx={{ opacity: 0.75 }}>
          {t('landing-continue')}
        </Typography>
        <Typography variant="body2" sx={{ my: 1, opacity: 0.9 }}>
          {t('landing-sign-in-help')}
        </Typography>
        <Button variant="contained" startIcon={<LoginIcon />} onClick={() => void auth.signinRedirect()}>
          {t('landing-sign-in')}
        </Button>
      </Card>
    );
  }
  return (
    <Card sx={glass}>
      <Typography variant="overline" sx={{ opacity: 0.75 }}>
        {t('landing-continue')}
      </Typography>
      {data.loading ? (
        <Skeleton variant="rounded" height={64} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      ) : game ? (
        <Stack spacing={1}>
          <Typography variant="h6" sx={{ fontFamily: (theme) => theme.fonts.display, lineHeight: 1.2 }}>
            {game.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {t('landing-game-progress', { round: game.round, actors: game.actors?.length ?? 0 })}
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            component={RouterLink}
            to={`/tactical/combat/${game.id}`}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('landing-resume-combat')}
          </Button>
        </Stack>
      ) : (
        <Typography variant="body2" sx={{ opacity: 0.85, my: 1 }}>
          {t('landing-no-game-in-progress')}
        </Typography>
      )}
      {campaign && !data.loading && (
        <>
          <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.14)' }} />
          <Link component={RouterLink} to={`/strategic/games/view/${campaign.id}`} underline="hover" sx={{ color: 'inherit', display: 'block' }}>
            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
              {t('landing-last-campaign')}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {`${campaign.name} · ${campaign.realmName}`}
            </Typography>
          </Link>
        </>
      )}
    </Card>
  );
};

type TableEntry = { id: string; href: string; title: string; subtitle: string; image?: string; chip?: string };

/** A short list of the user's things (games, campaigns, characters), each a link. */
const TableList: FC<{ title: string; entries: TableEntry[]; empty: string; more: string; index: number }> = ({
  title,
  entries,
  empty,
  more,
  index,
}) => {
  const { t } = useTranslation();
  return (
    <Card variant="outlined" sx={[{ p: 2 }, enterSx(index)]}>
      <Stack direction="row" sx={{ alignItems: 'baseline' }}>
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
        <Link component={RouterLink} to={more} variant="caption" underline="hover" sx={{ ml: 'auto' }}>
          {t('landing-see-all')}
        </Link>
      </Stack>
      {entries.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
          {empty}
        </Typography>
      ) : (
        <List dense disablePadding>
          {entries.map((entry) => (
            <ListItemButton key={entry.id} component={RouterLink} to={entry.href} sx={{ borderRadius: 1, px: 1, minHeight: 48 }}>
              <ListItemAvatar sx={{ minWidth: 48 }}>
                <Avatar variant="rounded" src={entry.image} alt="">
                  {entry.title.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={entry.title} secondary={entry.subtitle} slotProps={{ primary: { noWrap: true }, secondary: { noWrap: true } }} />
              {entry.chip && <Chip size="small" label={entry.chip} sx={{ ml: 1 }} />}
            </ListItemButton>
          ))}
        </List>
      )}
    </Card>
  );
};

/** The user's table: games in progress, campaigns and characters. */
export const UserTable: FC<{ data: LandingData }> = ({ data }) => {
  const { t } = useTranslation();
  if (data.loading) {
    return (
      <Stack spacing={2}>
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} variant="rounded" height={160} />
        ))}
      </Stack>
    );
  }
  return (
    <Stack spacing={2}>
      <TableList
        index={0}
        title={t('landing-games-in-progress')}
        more="/tactical/games"
        empty={t('landing-no-game-in-progress')}
        entries={data.tacticalGames.map((game) => ({
          id: game.id,
          href: `/tactical/combat/${game.id}`,
          title: game.name,
          subtitle: t('landing-game-progress', { round: game.round, actors: game.actors?.length ?? 0 }),
          image: game.imageUrl,
          chip: t(`tactical-game-status-${game.status}`),
        }))}
      />
      <TableList
        index={1}
        title={t('landing-campaigns')}
        more="/strategic/games"
        empty={t('landing-no-campaigns')}
        entries={data.strategicGames.map((campaign) => ({
          id: campaign.id,
          href: `/strategic/games/view/${campaign.id}`,
          title: campaign.name,
          subtitle: campaign.realmName,
          image: campaign.imageUrl,
          chip: t(campaign.status),
        }))}
      />
      <TableList
        index={2}
        title={t('landing-characters')}
        more="/strategic/characters"
        empty={t('landing-no-characters')}
        entries={data.characters.slice(0, 4).map((character) => ({
          id: character.id,
          href: `/strategic/characters/view/${character.id}`,
          title: character.name,
          subtitle: [character.info?.race?.name, t(character.info?.professionId ?? '')].filter(Boolean).join(' · '),
          image: character.imageUrl,
        }))}
      />
    </Stack>
  );
};
