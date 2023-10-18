import { CreateTopic } from "@athena/web-shared/components";
import { requireAuth } from '@athena/web-shared/utils';

function CreateTopicPage(props) {
    return (
        <CreateTopic  />
    )
}

export default requireAuth(CreateTopicPage);

