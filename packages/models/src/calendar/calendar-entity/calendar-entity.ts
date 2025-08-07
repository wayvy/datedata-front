import { ICalendar, CalendarApi } from '@repo/types';

export class Calendar implements ICalendar {
  id: string;
  summary: string;
  description: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  checked: boolean;

  constructor(data: CalendarApi) {
    this.id = data.id;
    this.summary = data.summary;
    this.description = data.description;
    this.color = data.color;
    this.userId = data.user_id;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.checked = data.checked;
  }
}
