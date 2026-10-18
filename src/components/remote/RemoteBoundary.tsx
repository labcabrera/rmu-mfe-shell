import React, { ReactNode, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary, LoadingState } from '@labcabrera-rmu/rmu-react-shared-lib';
import RemoteUnavailable from './RemoteUnavailable';

// Isolates one remote: a render error inside it shows RemoteUnavailable for that route only (the
// header, footer and the other remotes keep working), and it resets when the user navigates.
const RemoteBoundary = ({ name, children }: { name: string; children: ReactNode }) => {
  const location = useLocation();
  return (
    <ErrorBoundary resetKey={location.pathname} fallback={() => <RemoteUnavailable name={name} />}>
      <Suspense fallback={<LoadingState />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default RemoteBoundary;
