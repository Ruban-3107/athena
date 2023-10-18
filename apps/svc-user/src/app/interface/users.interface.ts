import { usersAttributes } from '../database/models/users';
export type User = usersAttributes;

export interface DateData {
  today: Date;
  fromDate: Date;
  toDate: Date;
}


