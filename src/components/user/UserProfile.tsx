import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Avatar, Box, Button, Chip, Container, IconButton, Stack, Typography } from '@mui/material';
import { assetCandidates, ChipRow, ImageSelectorDialog, Panel, Section } from '@labcabrera-rmu/rmu-react-shared-lib';
import { imageBaseUrl } from '../../services/config';
import { useApiUser } from '../../services/user/ApiUserProvider';
import ActivationCodeDialog from './ActivationCodeDialog';
import FriendPanel from './FriendPanel';
import UsernameField from './UsernameField';

const DEFAULT_IMAGE = `${imageBaseUrl}images/generic/races.png`;

export default function UserProfile() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [activationCodeDialogOpen, setActivationCodeDialogOpen] = useState<boolean>(false);
  const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false);
  const { apiUser, error: apiUserError, updateApiUser } = useApiUser();
  const groups: string[] = apiUser?.features || (user?.profile.groups as string[]) || [];

  const email = user?.profile.email || 'Not defined email';
  const displayName = apiUser?.name || user?.profile.name || user?.profile.preferred_username || 'Unknown';
  const avatarInitials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const identityProvider = apiUser?.identityProvider;
  const lastLoginAt = apiUser?.lastLoginAt ? new Date(apiUser.lastLoginAt) : undefined;

  const updateImage = (imageUrl: string) => {
    updateApiUser({ imageUrl }).catch((err) => console.error(err));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={2}>
        <Section>
          <Stack spacing={3}>
            {apiUserError && <Alert severity="warning">{apiUserError}</Alert>}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}>
              <IconButton aria-label={t('change-profile-image')} onClick={() => setImageDialogOpen(true)} sx={{ p: 0 }}>
                {/* eslint-disable-next-line no-restricted-syntax -- the account avatar of a user is a circle (spec 058) */}
                <Avatar sx={{ width: 80, height: 80 }} src={assetCandidates([apiUser?.imageUrl || DEFAULT_IMAGE], 512)[0]}>
                  {avatarInitials}
                </Avatar>
              </IconButton>
              <Box sx={{ minWidth: 0 }}>
                <UsernameField fallback={displayName} />
                {email && (
                  <Typography variant="body2" color="text.secondary">
                    {email}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Panel variant="outlined" title={t('enabled-features')}>
              <Stack spacing={2}>
                {groups.length === 0 ? (
                  <Alert severity="error">{t('user-has-no-groups')}</Alert>
                ) : (
                  <ChipRow>
                    {groups.map((feature, index) => (
                      <Chip key={index} label={t(feature)} variant="outlined" color="success" size="small" />
                    ))}
                  </ChipRow>
                )}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setActivationCodeDialogOpen(true)}
                  sx={{ alignSelf: 'flex-start', borderStyle: 'dashed' }}
                >
                  {t('add-activation-code')}
                </Button>
              </Stack>
            </Panel>
          </Stack>
        </Section>

        <FriendPanel />

        <Section title={t('profile-details')}>
          <Stack spacing={1}>
            <Typography variant="body2">
              <Box component="span" sx={{ color: 'text.secondary' }}>
                {t('email')}
              </Box>{' '}
              {email}
            </Typography>
            {identityProvider && (
              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  {t('identity-provider')}
                </Box>{' '}
                {t(`identity-provider-${identityProvider}`, { defaultValue: identityProvider })}
              </Typography>
            )}
            {lastLoginAt && !Number.isNaN(lastLoginAt.getTime()) && (
              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  {t('last-login')}
                </Box>{' '}
                {lastLoginAt.toLocaleString(i18n.language)}
              </Typography>
            )}
          </Stack>
        </Section>
      </Stack>
      <ActivationCodeDialog open={activationCodeDialogOpen} onClose={() => setActivationCodeDialogOpen(false)} />
      <ImageSelectorDialog
        value={apiUser?.imageUrl || DEFAULT_IMAGE}
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onSelect={(path) => updateImage(path)}
        onUpload={(path) => updateImage(path)}
      />
    </Container>
  );
}
