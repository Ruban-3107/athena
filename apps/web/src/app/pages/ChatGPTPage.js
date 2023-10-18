
import { ChatGPT } from '@athena/web-shared/components';
import { requireAuth } from '@athena/web-shared/utils';


export function ChatGpt(props) {
  return (
    <>
      <ChatGPT />
    </>
  );
}

export default requireAuth(ChatGpt);
