import { CreateChapter } from '@athena/web-shared/components';
import { requireAuth, useParams } from '@athena/web-shared/utils';

function CreateChapterPage(props) {

  return (
      <CreateChapter />
  );
}

export default requireAuth(CreateChapterPage);
