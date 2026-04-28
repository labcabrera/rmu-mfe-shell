import React, { useEffect, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import { Button, Menu, MenuItem } from '@mui/material';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const label = i18n.language === 'es' ? 'Es' : 'En';

  const LANGUAGES: { code: string; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
  ];

  const handleOpen = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const change = async (lng: string) => {
    console.log('LanguageSelector.change', lng);
    try {
      await i18n.changeLanguage(lng);
      try {
        localStorage.setItem('locale', lng);
      } catch (ignore) {
        console.log('Error updating language', ignore);
      }
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('rmu:languageChanged', { detail: lng }));
        }
      } catch (e) {
        // ignore
      }
      try {
        // @ts-ignore
        i18n.emit?.('languageChanged', lng);
      } catch (e) {
        // ignore
      }
    } catch (e) {
      console.error('changeLanguage failed', e);
    }
    handleClose();
  };

  useEffect(() => {
    try {
      console.log('LanguageSelector.useEffect', i18n);
      const stored = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
      if (stored && stored !== i18n.language) {
        i18n.changeLanguage(stored).catch((e) => console.error('i18n init changeLanguage failed', e));
      }
    } catch (ignore) {
      console.error('Error loading stored language', ignore);
    }
  }, [i18n]);

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
        {LANGUAGES.map((lng) => (
          <MenuItem
            key={lng.code}
            selected={i18n.language === lng.code}
            onClick={() => {
              change(lng.code);
            }}
          >
            {lng.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
