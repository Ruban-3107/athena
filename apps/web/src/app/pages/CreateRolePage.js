import { CreateRole } from "@athena/web-shared/components";
import { HeaderComponent } from "@athena/web-shared/ui";
import { Col, Row } from 'react-bootstrap';
import { apiRequest, useParams, useRouter } from '@athena/web-shared/utils';
import { requireAuth } from '@athena/web-shared/utils';

function CreateRolePage(props) {
    const params=useParams();
    console.log("Paramsssssssssssss",params);
    // const{id}=params;
    const router = useRouter();
    return (
        <>
            <HeaderComponent title={params?.type === "create" ? "Create Role" : "Update Role"} hidebreadcumb/>
            <CreateRole type={router.query.type} />
        </>
    )
}

export default requireAuth(CreateRolePage);

