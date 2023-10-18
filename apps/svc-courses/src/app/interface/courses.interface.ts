export interface DateData {
  today: Date;
  fromDate: Date;
  toDate: Date;
}

export interface CourseChart {
  graphLabel?: string | Date;
  type?: string;
  count?: string | number;
}
