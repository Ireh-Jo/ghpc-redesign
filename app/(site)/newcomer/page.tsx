import type { Metadata } from 'next';
import { SubPage } from '@/components/layout/sub-page';
import { NewcomerForm } from '@/components/interactive/newcomer-form';

export const metadata: Metadata = { title: '새가족' };

export default function NewcomerPage() {
  return (
    <SubPage
      sectionKey="newfamily"
      overrides={{
        register: <NewcomerForm />,
      }}
    />
  );
}
