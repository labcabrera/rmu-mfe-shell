import React, { JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Container, TextField, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { imageBaseUrl } from '../services/config';

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
      // fallback to mailto
      const subject = encodeURIComponent('Contact from RMU site');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
      setStatus('mailto');
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={{
          minHeight: '40vh',
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
            {t('footer-contact')}
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }}>
            {t('contact-intro')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField label={t('name')} fullWidth value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </Grid>

            <Grid size={12}>
              <TextField
                label={t('email')}
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                type="email"
              />
            </Grid>

            <Grid size={12}>
              <TextField label={t('message')} fullWidth multiline minRows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
            </Grid>

            <Grid size={12}>
              <Button type="submit" variant="contained" color="primary">
                {t('send')}
              </Button>
              {apiUrl ? (
                <Typography variant="caption" sx={{ ml: 2 }}>
                  {t('contact-sending-to-api')}
                </Typography>
              ) : (
                <Typography variant="caption" sx={{ ml: 2 }}>
                  {t('contact-mailto-hint', { email: contactEmail })}
                </Typography>
              )}
            </Grid>

            <Grid size={12}>
              {status === 'success' && <Alert severity="success">{t('contact-message-sent')}</Alert>}
              {status === 'error' && <Alert severity="error">{t('contact-send-failed')}</Alert>}
              {status === 'sending' && <Alert severity="info">{t('contact-sending')}</Alert>}
              {status === 'mailto' && <Alert severity="info">{t('contact-mail-client-opened')}</Alert>}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
