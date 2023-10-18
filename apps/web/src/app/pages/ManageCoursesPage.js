import { ManageCourses } from '@athena/web-shared/components';
import { HeaderComponent,Box } from '@athena/web-shared/ui';
import { requireAuth } from '@athena/web-shared/utils';


function ManageCoursesPage(props) {
    return (
      <Box className="pl-2 pr-4">
        <HeaderComponent
          title="Manage Courses"
          hidebreadcumb
          isButtonVisible
          btnname="+ Create Course"
          routeTo="createcourse"
        />
        <ManageCourses />
      </Box>
    );
  }
  
  export default requireAuth(ManageCoursesPage);