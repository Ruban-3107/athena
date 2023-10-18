export interface NeedAttention {
  title: string;
  createdAt?: any;
  needAttentionSubtitle: string;
}
export interface RecentActivities {
  title: string;
  batchName?: string;
  createdAt?: any;
  recentActivitySubtitle: string;
}
export interface CourseChart {
  graphLabel?: string | Date;
  type?: string;
  count?: string | number;
}
