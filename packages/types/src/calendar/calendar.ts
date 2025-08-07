export type CalendarApi = {
  id: string;
  summary: string;
  description: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  checked: boolean;
};

export interface ICalendar {
  id: string;
  summary: string;
  description: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  checked: boolean;
}
