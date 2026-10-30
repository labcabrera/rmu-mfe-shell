import React, { JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import SendIcon from '@mui/icons-material/Send';
import { Alert, Box, Button, Card, Grid, Link, Stack, TextField, Typography } from '@mui/material';
import InfoPage from './info/InfoPage';

const ISSUES_URL = 'https://github.com/labcabrera/rmu-platform/issues';

export default function ContactPage(): JSX.Element {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'mailto'>('idle');
  const apiUrl = process.env.RMU_SHELL_CONTACT_URI || '';
  const contactEmail = process.env.RMU_SHELL_CONTACT_EMAIL || 'lab.cabrera@gmail.com';

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!email || !validateEmail(email)) {
      setStatus('error');
      return;
    }
    if (apiUrl) {
      setStatus('sending');
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });
        if (res.ok) {
          setStatus('success');
          setName('');
          setEmail('');
          setMessage('');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    } else {
      // Without a contact service the message goes through the user's mail client.
      const subject = encodeURIComponent('Contact from RMU site');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
      setStatus('mailto');
    }
  };

  return (
    <InfoPage title={t('footer-contact')} subtitle={t('contact-intro')} image={3}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField label={t('name')} fullWidth value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                <TextField
                  label={t('email')}
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  type="email"
                />
                <TextField label={t('message')} fullWidth multiline minRows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
                {!apiUrl && (
                  <Typography variant="body2" color="text.secondary">
                    {t('contact-mailto-hint', { email: contactEmail })}
                  </Typography>
                )}
                <Box>
                  <Button type="submit" variant="contained" startIcon={apiUrl ? <SendIcon /> : <MailOutlineIcon />} disabled={status === 'sending'}>
                    {t(apiUrl ? 'send' : 'contact-open-mail')}
                  </Button>
                </Box>
                {status === 'success' && <Alert severity="success">{t('contact-message-sent')}</Alert>}
                {status === 'error' && <Alert severity="error">{t('contact-send-failed')}</Alert>}
                {status === 'sending' && <Alert severity="info">{t('contact-sending')}</Alert>}
                {status === 'mailto' && <Alert severity="info">{t('contact-mail-client-opened')}</Alert>}
              </Stack>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" component="h2" sx={{ fontFamily: (theme) => theme.fonts.display, mb: 2 }}>
              {t('contact-other-channels')}
            </Typography>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1.5}>
                <BugReportOutlinedIcon color="primary" />
                <Box>
                  <Link href={ISSUES_URL} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 600 }}>
                    {t('contact-issues')}
                  </Link>
                  <Typography variant="body2" color="text.secondary">
                    {t('contact-issues-text')}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.5}>
                <MailOutlineIcon color="primary" />
                <Box sx={{ minWidth: 0 }}>
                  <Link href={`mailto:${contactEmail}`} sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
                    {contactEmail}
                  </Link>
                  <Typography variant="body2" color="text.secondary">
                    {t('contact-email-text')}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </InfoPage>
  );
}
