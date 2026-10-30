import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { ArticleInfoPage } from './info/InfoPage';

const SECTIONS = [
  'privacy-controller',
  'privacy-data-collection',
  'privacy-purpose',
  'privacy-cookies',
  'privacy-third-party-services',
  'privacy-data-storage',
  'privacy-user-rights',
  'privacy-security',
  'privacy-changes',
  'privacy-contact',
];

export default function PrivacyPolicyPage(): JSX.Element {
  const { t } = useTranslation();
  return (
    <ArticleInfoPage
      title={t('footer-privacy-policy')}
      subtitle={t('privacy-introduction-description')}
      image={2}
      updated="2026-10-30"
      keys={SECTIONS}
    />
  );
}
