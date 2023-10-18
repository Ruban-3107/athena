import { ManageCorporate } from '@athena/web-shared/components';
import { requireAuth } from '@athena/web-shared/utils';
import { HeaderComponent } from '@athena/web-shared/ui';

export function ManageCorporatePage(props) {
  return (
    <>
      <HeaderComponent
        title="Manage Corporate Group"
        btnname="+ Create Corporate Group"
        routeTo="createcorporate"
        isButtonVisible
        className="Manage-title"
      />
      <ManageCorporate />
    </>
  );
}
export default requireAuth(ManageCorporatePage);
