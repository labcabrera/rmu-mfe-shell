import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import { Button, Menu, MenuItem } from '@mui/material';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
      if (stored && stored !== i18n.language) {
        i18n.changeLanguage(stored).catch((e) => console.error('i18n init changeLanguage failed', e));
      }
    } catch (e) {
      // ignore
    }
  }, [i18n]);

  const open = Boolean(anchorEl);
  const label = i18n.language === 'es' ? 'ES' : 'EN';

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const change = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      try {
        localStorage.setItem('locale', lng);
      } catch (e) {
        // ignore
      }
    } catch (e) {
      console.error('changeLanguage failed', e);
    }
    handleClose();
  };

  return (
    <>
      <Button
        variant="text"
        color="primary"
        onClick={handleOpen}
        startIcon={<LanguageIcon fontSize="small" />}
        sx={{ textTransform: 'none', minWidth: 48 }}
      >
        {label}
      </Button>
      <Menu
        id="locale-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            change('en');
          }}
        >
          English
        </MenuItem>
        <MenuItem
          onClick={() => {
            change('es');
          }}
        >
          Español
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSelector;
