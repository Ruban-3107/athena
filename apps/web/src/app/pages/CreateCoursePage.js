import { CreateCourse } from '@athena/web-shared/components';
import { requireAuth } from '@athena/web-shared/utils';


const CreateCoursePage = (props) => {

  return (
    <>

      <CreateCourse />
    </>
  );
}

export default requireAuth(CreateCoursePage);
