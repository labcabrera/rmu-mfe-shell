import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Popper, Paper, ClickAwayListener, Grid, List, ListItemButton, ListItemText, useTheme, useMediaQuery } from '@mui/material';

type LinkItem = { label: string; href: string };
type Page = { label: string; href: string; links?: LinkItem[] };

const HeaderNavButtons: FC<{ pages: Page[] }> = ({ pages }) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [popperAnchor, setPopperAnchor] = React.useState<null | HTMLElement>(null);
  const [openSection, setOpenSection] = React.useState<string | null>(null);
  const { t } = useTranslation();

  const handleOpenSection = (event: React.MouseEvent<HTMLElement>, label: string) => {
    setPopperAnchor(event.currentTarget);
    setOpenSection(label);
  };

  const handleCloseSection = () => {
    setPopperAnchor(null);
    setOpenSection(null);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'flex' },
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
            endIcon={isMdUp ? openSection === page.label ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" /> : undefined}
          >
            {t(page.label)}
          </Button>
          <Popper open={openSection === page.label} anchorEl={popperAnchor} placement="bottom-start" disablePortal={false} style={{ zIndex: 1400 }}>
            {openSection === page.label && (
              <ClickAwayListener onClickAway={handleCloseSection}>
                <Paper onMouseEnter={() => {}} onMouseLeave={() => handleCloseSection()} sx={{ mt: 1, p: 2, minWidth: 240 }} elevation={6}>
                  <Grid container spacing={2}>
                    <Grid size={12}>
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
  );
};

export default HeaderNavButtons;
