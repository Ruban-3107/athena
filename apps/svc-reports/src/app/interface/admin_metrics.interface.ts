export interface AdminMetricsData {
  count: string;
  type: string;
}

export interface NeedAttention {
  title: string;
  createdAt?: any;
  needAttentionSubtitle: string;
  error?: string;
}
export interface RecentActivities {
  title: string;
  batchName?: string;
  createdAt?: any;
  recentActivitySubtitle: string;
}
export interface PerformanceChart {
  graphLabel?: string | Date;
  type?: string;
  count?: string | number;
}
