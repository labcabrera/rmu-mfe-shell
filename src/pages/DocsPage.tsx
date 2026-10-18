import React, { JSX } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Container, Divider, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { imageBaseUrl } from '../services/config';

export default function DocsPage(): JSX.Element {
  const { t } = useTranslation();
  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={{
          minHeight: '25vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.2)), url(${imageBaseUrl}images/actions/action-melee-all.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
            {t('footer-get-started')}
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }}>
            {t('docs-intro')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          <Trans
            i18nKey="docs-official-content-text"
            components={{ link: <Link href="https://www.drivethrurpg.com/en/browse?keyword=rolemaster" target="_blank" /> }}
          />
        </Typography>
        <Box
          component="img"
          src={`${imageBaseUrl}images/doc/ice-books.png`}
          alt={t('docs-ice-books-alt')}
          sx={{
            width: { xs: '100%', sm: '80%', md: '40%' },
            display: 'block',
            mx: 'auto',
            objectFit: 'cover',
            borderRadius: 4,
            boxShadow: 4,
          }}
        />
        <Typography variant="body1" sx={{ mb: 3 }}>
          {t('docs-rulebooks-text')}
        </Typography>

        <Divider />

        <Typography variant="h6" sx={{ maxWidth: 600, mb: 2 }}>
          {t('docs-approach-title')}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('docs-approach-text')}
        </Typography>

        <Box component="ul" sx={{ pl: 2, mb: 3, '& li': { mb: 1.5 } }}>
          <li>
            <Typography component="span">
              <Trans i18nKey="docs-concept-realm" components={{ strong: <strong /> }} />
            </Typography>
          </li>

          <li>
            <Typography component="span">
              <Trans i18nKey="docs-concept-strategic-game" components={{ strong: <strong /> }} />
            </Typography>
          </li>

          <li>
            <Typography component="span">
              <Trans i18nKey="docs-concept-faction" components={{ strong: <strong /> }} />
            </Typography>
          </li>

          <li>
            <Typography component="span">
              <Trans i18nKey="docs-concept-character" components={{ strong: <strong /> }} />
            </Typography>
          </li>

          <li>
            <Typography component="span">
              <Trans i18nKey="docs-concept-npc" components={{ strong: <strong /> }} />
            </Typography>
          </li>

          <li>
            <Typography component="span">
              <Trans i18nKey="docs-concept-tactical-game" components={{ strong: <strong /> }} />
            </Typography>
          </li>
        </Box>

        <Box
          component="img"
          src={`${imageBaseUrl}images/doc/rmu-diagram.png`}
          alt={t('docs-diagram-alt')}
          sx={{
            width: { xs: '100%', sm: '90%', md: '60%' },
            display: 'block',
            mx: 'auto',
            objectFit: 'cover',
            borderRadius: 4,
            boxShadow: 4,
          }}
        />

        <Divider />

        <Typography variant="h6" sx={{ maxWidth: 600, mb: 2 }}>
          {t('docs-creating-game-title')}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('docs-creating-game-text-1')}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('docs-creating-game-text-2')}
        </Typography>
      </Container>
    </Box>
  );
}
