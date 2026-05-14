import React from 'react';
import { useAuth } from 'react-oidc-context';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { ApiError, userApiClient } from '../../api/user-api-client';

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

const getActivationErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.status === 404) return 'Activation code not found.';
    if (error.status === 409) return 'Activation code has already been used.';
    if (error.status === 400) return 'Activation code is not valid.';
    return 'Activation code could not be activated.';
  }

  if (error instanceof Error) return error.message;
  return 'Activation code could not be activated.';
};

const ActivationCodeForm: React.FC = () => {
  const auth = useAuth();
  const [code, setCode] = React.useState('');
  const [submissionState, setSubmissionState] = React.useState<SubmissionState>('idle');
  const [message, setMessage] = React.useState<string>();

  const trimmedCode = code.trim();
  const isSubmitting = submissionState === 'submitting';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedCode) {
      setSubmissionState('error');
      setMessage('Enter an activation code.');
      return;
    }

    setSubmissionState('submitting');
    setMessage(undefined);

    try {
      await userApiClient.activateCode(auth, trimmedCode);
      const refreshedUser = await auth.signinSilent();

      if (!refreshedUser) {
        throw new Error('Activation succeeded, but the security context could not be refreshed.');
      }

      setCode('');
      setSubmissionState('success');
      setMessage('Activation code activated.');
    } catch (error) {
      setSubmissionState('error');
      setMessage(getActivationErrorMessage(error));
    }
  };

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <Typography variant="h6">Activation code</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          fullWidth
          size="small"
          label="Code"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            if (submissionState !== 'submitting') {
              setSubmissionState('idle');
              setMessage(undefined);
            }
          }}
          disabled={isSubmitting}
          required
          autoComplete="one-time-code"
        />
        <Button type="submit" variant="contained" disabled={isSubmitting || !trimmedCode} sx={{ minWidth: { sm: 120 } }}>
          {isSubmitting ? 'Sending...' : 'Send'}
        </Button>
      </Stack>
      {message && <Alert severity={submissionState === 'success' ? 'success' : 'error'}>{message}</Alert>}
    </Stack>
  );
};

export default ActivationCodeForm;
