export interface ContinueLearning {
  category?: string;
  lastTouchedAt?: Date;
  totalChapters: number;
  totalTopics: number;
  completedTopics?: number;
  completedPercentage: number;
}

export interface Schedulee {
  id: number;
  start_at: Date;
  end_at: Date;
  description?: string;
  topic_id: number;
  trainer_id: number;
  batch_id: number;
  learner_track_id: number;
  learner_id: number;
  track_id: number;
  chapter_id: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  accepted_by?: number;
  accepted_at?: Date;
  declined_by?: number;
  declined_at?: Date;
  cancelled_by?: number;
  cancelled_at?: Date;
  rescheduled_by?: number;
  rescheduled_at?: Date;
  created_by?: number;
  deleted_at?: Date;
  deleted_by?: number;
  reason_for_cancellation?: string;
}
