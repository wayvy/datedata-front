import { Text } from '@gravity-ui/uikit';
import { useRouteError } from 'react-router';

const RouterErrorPage: React.FC = () => {
  const error = useRouteError() as { status: number };

  const isNotFound = error.status === 404;

  return (
    <>
      <Text variant="header-1">{isNotFound ? 'Not Found' : 'Error'}</Text>
    </>
  );
};

export default RouterErrorPage;
