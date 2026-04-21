import React, { useState } from 'react';
import { Button, Container, TextField, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { imageBaseUrl } from '../services/config';

export default function ContactPage(): JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'mailto'>('idle');

  const apiUrl = process.env.REACT_APP_CONTACT_API || '';
  const contactEmail = process.env.REACT_APP_CONTACT_EMAIL || 'lab.cabrera@gmail.com';

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
          <Typography variant="h2" fontWeight={700} gutterBottom>
            Contact
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }}>
            If you’d like to get in touch with me or have any questions or suggestions about the app, please use the form below.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                type="email"
              />
            </Grid>

            <Grid size={12}>
              <TextField label="Message" fullWidth multiline minRows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
            </Grid>

            <Grid size={12}>
              <Button type="submit" variant="contained" color="primary">
                Send
              </Button>
              {apiUrl ? (
                <Typography variant="caption" sx={{ ml: 2 }}>
                  Sending to configured API
                </Typography>
              ) : (
                <Typography variant="caption" sx={{ ml: 2 }}>
                  Will open your mail client (mailto: {contactEmail})
                </Typography>
              )}
            </Grid>

            <Grid size={12}>
              {status === 'success' && <Alert severity="success">Message sent.</Alert>}
              {status === 'error' && <Alert severity="error">Failed to send. Check your email or try again later.</Alert>}
              {status === 'sending' && <Alert severity="info">Sending…</Alert>}
              {status === 'mailto' && <Alert severity="info">Opened mail client.</Alert>}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
