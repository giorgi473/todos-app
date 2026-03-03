import { Suspense } from 'react';
import { Loading } from '@/components/shared/Loading';
import Wrapper from '@/components/shared/Wrapper';
import SettingsList from '@/features/settings/components/settings-list';

function SettingsPageView() {
  return (
    <section className="w-full min-h-screen">
      <Wrapper className="mx-auto w-full max-w-4xl px-4 md:px-6">
        <Suspense fallback={<Loading />}>
          <SettingsList />
        </Suspense>
      </Wrapper>
    </section>
  );
}

export default SettingsPageView;
