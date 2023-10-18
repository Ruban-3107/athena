import { HeaderComponent } from '@athena/web-shared/ui';
import { CreateCorporate } from '@athena/web-shared/components';
import { requireAuth, useParams } from '@athena/web-shared/utils';


export function CreateCorporatePage(props) {
  const params = useParams();
  const {id} = params

  return (
    <>
      <HeaderComponent title= {id ? "Edit Corporate Group": "Create Corporate Group"} />
      <CreateCorporate/>
    </>
  );
}

export default requireAuth(CreateCorporatePage);
