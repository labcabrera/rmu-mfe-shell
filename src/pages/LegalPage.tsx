import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { ArticleInfoPage } from './info/InfoPage';

const SECTIONS = [
  'legal-affiliation',
  'legal-copyright',
  'legal-purpose',
  'legal-user-content',
  'legal-privacy',
  'legal-monetization',
  'legal-license',
  'legal-liability',
  'legal-contact',
];

export default function LegalPage(): JSX.Element {
  const { t } = useTranslation();
  return <ArticleInfoPage title={t('footer-legal')} subtitle={t('legal-intro')} image={1} updated="2026-10-30" keys={SECTIONS} />;
}
