import { Button, Text } from '@gravity-ui/uikit';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { ROUTES } from '@/config/routes';

import s from './HomePage.module.scss';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const goToCalendar = useCallback(() => {
    navigate(ROUTES.calendar.path);
  }, [navigate]);

  return (
    <div className={s.root}>
      <Text variant="display-1">Welcome to DateData</Text>
      <Button size="l" variant="primary" onClick={goToCalendar}>
        Open Calendar
      </Button>
    </div>
  );
};

export default HomePage;
