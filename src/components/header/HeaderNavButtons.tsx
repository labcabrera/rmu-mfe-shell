import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Popper, Paper, ClickAwayListener, Grid, List, ListItemButton, ListItemText } from '@mui/material';

type LinkItem = { label: string; href: string };
type Page = { label: string; href: string; links?: LinkItem[] };

const HeaderNavButtons: FC<{ pages: Page[] }> = ({ pages }) => {
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
        display: { xs: 'none', md: 'flex' },
        gap: { md: 0.5, lg: 1 },
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        minWidth: 0,
        width: '100%',
      }}
    >
      {pages.map((page) => (
        <Box key={page.label} sx={{ display: 'inline-block', position: 'relative' }}>
          <Button
            variant="text"
            color="inherit"
            sx={{
              my: 2,
              display: 'inline-flex',
              whiteSpace: 'nowrap',
              px: { md: 1, lg: 1.25 },
              minWidth: 'auto',
              alignItems: 'center',
              fontSize: { md: '0.78rem', lg: '0.875rem' },
              '& .MuiButton-endIcon': { ml: 0.5, display: 'inline-flex', alignItems: 'center' },
            }}
            onClick={(e) => {
              if (openSection === page.label) handleCloseSection();
              else handleOpenSection(e, page.label);
            }}
            aria-haspopup="true"
            aria-expanded={openSection === page.label}
            endIcon={openSection === page.label ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
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
