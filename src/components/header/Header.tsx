import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Popper,
  Paper,
  ClickAwayListener,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { imageBaseUrl } from '../../services/config';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';

const pages = [
  {
    label: 'core',
    href: '/core',
    links: [
      { label: 'core', href: '/core' },
      { label: 'realms', href: '/core/realms' },
      { label: 'races', href: '/core/races' },
      { label: 'professions', href: '/core/professions' },
      { label: 'skill-categories', href: '/core/skills' },
      { label: 'skills', href: '/core/skills' },
      { label: 'traits', href: '/core/traits' },
    ],
  },
  {
    label: 'Strategic',
    href: '/strategic',
    links: [
      { label: 'strategic', href: '/strategic' },
      { label: 'strategic-games', href: '/strategic' },
    ],
  },
  {
    label: 'tactical',
    href: '/tactical',
    links: [
      { label: 'tactical', href: '/tactical' },
      { label: 'tactical-games', href: '/tactical' },
    ],
  },
  { label: 'npcs', href: '/npcs', links: [{ label: 'npcs', href: '/npcs' }] },
  { label: 'items', href: '/items', links: [{ label: 'items', href: '/items' }] },
  {
    label: 'spells',
    href: '/spells',
    links: [
      { label: 'spells', href: '/spells' },
      { label: 'spell-lists', href: '/spells/spell-lists' },
    ],
  },
];

const Header = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [popperAnchor, setPopperAnchor] = React.useState<null | HTMLElement>(null);
  const [openSection, setOpenSection] = React.useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const [, setTick] = React.useState(0);

  useEffect(() => {
    const onLang = () => setTick((v) => v + 1);
    i18n.on?.('languageChanged', onLang);
    window.addEventListener('rmu:languageChanged', onLang as EventListener);
    return () => {
      i18n.off?.('languageChanged', onLang);
      window.removeEventListener('rmu:languageChanged', onLang as EventListener);
    };
  }, [i18n]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenSection = (event: React.MouseEvent<HTMLElement>, label: string) => {
    setPopperAnchor(event.currentTarget);
    setOpenSection(label);
  };

  const handleCloseSection = () => {
    setPopperAnchor(null);
    setOpenSection(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 60, md: 80 },
            alignItems: 'center',
            py: { xs: 1, md: 1 },
            position: 'relative',
          }}
        >
          <FilterVintageIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: { xs: 22, md: 32 }, alignSelf: 'center' }} />
          <Typography
            color="primary"
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              order: { md: -1 },
              textDecoration: 'none',
              py: 0,
              alignItems: 'center',
            }}
          >
            RMU-Engine
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page, index) => (
                <MenuItem key={index} onClick={handleCloseNavMenu} component={RouterLink} to={page.href}>
                  {t(page.label)}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <FilterVintageIcon sx={{ display: { xs: 'none', md: 'none' }, mr: 1, fontSize: { xs: 20, md: 32 } }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 800,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              lineHeight: 1,
              py: 0,
              alignItems: 'center',
            }}
          >
            RMU-E
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', width: '100%', alignItems: 'center' }}>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                gap: 2,
                alignItems: 'center',
                flexWrap: 'nowrap',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                order: { md: 0 },
                minWidth: 0,
              }}
            >
              {pages.map((page) => (
                <Box key={page.label} sx={{ display: 'inline-block', position: 'relative' }}>
                  <Button
                    variant="text"
                    color="primary"
                    sx={{
                      my: 2,
                      display: 'inline-flex',
                      whiteSpace: 'nowrap',
                      mx: 1.5,
                      px: 1.5,
                      minWidth: 96,
                      alignItems: 'center',
                      '& .MuiButton-endIcon': { ml: 0.5, display: 'inline-flex', alignItems: 'center' },
                    }}
                    onClick={(e) => {
                      if (openSection === page.label) handleCloseSection();
                      else handleOpenSection(e, page.label);
                    }}
                    aria-haspopup="true"
                    aria-expanded={openSection === page.label}
                    endIcon={
                      isMdUp ? openSection === page.label ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" /> : undefined
                    }
                  >
                    {t(page.label)}
                  </Button>
                  <Popper
                    open={openSection === page.label}
                    anchorEl={popperAnchor}
                    placement="bottom-start"
                    disablePortal={false}
                    style={{ zIndex: 1400 }}
                  >
                    {openSection === page.label && (
                      <ClickAwayListener onClickAway={handleCloseSection}>
                        <Paper onMouseEnter={() => {}} onMouseLeave={() => handleCloseSection()} sx={{ mt: 1, p: 2, minWidth: 240 }} elevation={6}>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 12 }}>
                              <List disablePadding>
                                {page.links?.map((l) => (
                                  <ListItemButton key={l.label} component={RouterLink} to={l.href} onClick={handleCloseSection}>
                                    <ListItemText primary={t(l.label)} />
                                  </ListItemButton>
                                ))}
                              </List>
                            </Grid>
                          </Grid>
                        </Paper>
                      </ClickAwayListener>
                    )}
                  </Popper>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'flex-end',
                ml: 2,
                pr: { xs: 1, md: 2 },
                minWidth: 0,
                gap: 3,
              }}
            >
              <LanguageSelector />
              <UserMenu avatarUrl={`${imageBaseUrl}images/generic/races.png`} />
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
