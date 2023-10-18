// eslint-disable-next-line @nx/enforce-module-boundaries
import { ActivityLog } from '@athena/web-shared/components';
import { HeaderComponent } from "@athena/web-shared/ui";
import { requireAuth } from "@athena/web-shared/utils";

function ActivtyLogPage(props) {
    return (
            <ActivityLog/>
    )
}
export default requireAuth(ActivtyLogPage);