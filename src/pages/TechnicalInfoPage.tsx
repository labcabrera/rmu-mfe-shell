import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Box, Link, Typography } from '@mui/material';
import InfoPage, { InfoSection } from './info/InfoPage';

const external = (href: string) => <Link href={href} target="_blank" rel="noopener noreferrer" />;

const TOOLS: { key: string; href: string }[] = [
  { key: 'technical-tool-mongodb', href: 'https://www.mongodb.com/' },
  { key: 'technical-tool-kafka', href: 'https://kafka.apache.org/' },
  { key: 'technical-tool-keycloak', href: 'https://www.keycloak.org/' },
  { key: 'technical-tool-caddy', href: 'https://caddyserver.com/' },
  { key: 'technical-tool-otel', href: 'https://opentelemetry.io/' },
];
const SECTIONS = ['technical-general', 'technical-tools', 'technical-cloning', 'technical-running'];
const PLATFORM_URL = 'https://github.com/labcabrera/rmu-platform';

export default function TechnicalInfoPage() {
  const { t } = useTranslation();
  return (
    <InfoPage title={t('technical-title')} subtitle={t('technical-intro')} image={1} index={SECTIONS.map((id) => ({ id, title: t(`${id}-title`) }))}>
      <InfoSection id="technical-general" number={1} title={t('technical-general-title')}>
        <Typography variant="body1">{t('technical-prerequisites')}</Typography>
        <Typography variant="body1">
          <Trans
            i18nKey="technical-architecture"
            components={{
              nestjs: external('https://nestjs.com/'),
              react: external('https://react.dev/'),
              mui: external('https://mui.com/material-ui/getting-started/'),
            }}
          />
        </Typography>
      </InfoSection>
      <InfoSection id="technical-tools" number={2} title={t('technical-tools-title')}>
        <Typography variant="body1">{t('technical-external-tools')}</Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, '& li': { mb: 1 } }}>
          {TOOLS.map((tool) => (
            <Typography key={tool.key} component="li" variant="body1">
              <Trans i18nKey={tool.key} components={{ link: external(tool.href) }} />
            </Typography>
          ))}
        </Box>
      </InfoSection>
      <InfoSection id="technical-cloning" number={3} title={t('technical-cloning-title')}>
        <Typography variant="body1">
          <Trans i18nKey="technical-cloning-text-1" components={{ link: external(PLATFORM_URL) }} />
        </Typography>
        <Typography variant="body1">{t('technical-cloning-text-2')}</Typography>
      </InfoSection>
      <InfoSection id="technical-running" number={4} title={t('technical-running-title')}>
        <Typography variant="body1">
          <Trans i18nKey="technical-running-text" components={{ link: external(PLATFORM_URL), code: <code /> }} />
        </Typography>
      </InfoSection>
    </InfoPage>
  );
}
