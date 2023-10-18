import { AuthSection } from '@athena/web-shared/components';
import { requireAuth, useRouter } from '@athena/web-shared/utils';

function AuthPage(props) {
  const router = useRouter();
  return (
      <AuthSection
        bg="transparent"
        textColor="dark"
        size="md"
        bgImage=""
        bgImageOpacity={1}
        type={router.query.type}
        // providers={["google", "microsoft"]}
        // providers={['microsoft']}
        afterAuthPath={router.query.next || '/app/dashboard'}
      />
  );
}

export default AuthPage;
