import { CreateTrack } from "@athena/web-shared/components";
import { requireAuth, } from '@athena/web-shared/utils';

const CreateTrackPage = (props) => {


    return (
        <>

            <CreateTrack />
        </>
    )
}

export default requireAuth(CreateTrackPage);

