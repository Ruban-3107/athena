import { ManageTracks } from '@athena/web-shared/components';
import { HeaderComponent } from '@athena/web-shared/ui';
import { requireAuth } from '@athena/web-shared/utils';

function ManageTrack(props) {

  return (
    <>
      <HeaderComponent
        title="Manage Track"
        hidebreadcumb
        isButtonVisible
        btnname="+ Create Track"
        routeTo="createtrack"
      />
      <ManageTracks />
    </>
  );
}

export default requireAuth(ManageTrack);
