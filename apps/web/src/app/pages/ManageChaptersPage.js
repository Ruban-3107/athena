import { HeaderComponent } from '@athena/web-shared/ui';
import { ManageChapters } from '@athena/web-shared/components';
import { requireAuth } from '@athena/web-shared/utils';

export function ManageChaptersPage(props) {
    return (
      <>
        <HeaderComponent
          title="Manage Chapters"
          btnname="+ Create Chapters"
          routeTo="createchapter"
          hidebreadcrumb
          isButtonVisible
        />
  
        <ManageChapters />
      </>
    );
  }
  
  export default requireAuth(ManageChaptersPage);
  