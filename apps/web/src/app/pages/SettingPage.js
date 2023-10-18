import { HeaderComponent } from '@athena/web-shared/ui';
import { Settings } from '@athena/web-shared/components';
import { requireAuth } from '@athena/web-shared/utils';

export function SettingPage(props) {
  return (
    <>
      <HeaderComponent
        title="Settings"
        // btnname="+ Add User"
        // routeTo="adduser"
        // isButtonVisible
      />
      <Settings />
    </>
  );
}

export default requireAuth(SettingPage);