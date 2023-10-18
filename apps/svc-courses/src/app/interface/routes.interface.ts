import { Router } from 'express';
import { Request } from 'express';
export interface Routes {
  path?: string;
  router: Router;
}

export interface User {
  id: number;
  handle: string;
  first_name: string;
  provider?: string;
  uid?: string;
  email: string;
  encrypted_password?: string;
  reset_password_token?: string;
  reset_password_sent_at?: Date;
  remember_created_at?: Date;
  confirmation_token?: string;
  confirmed_at?: Date;
  confirmation_sent_at?: Date;
  unconfirmed_email?: string;
  accepted_privacy_policy_at?: Date;
  accepted_terms_at?: Date;
  became_mentor_at?: Date;
  deleted_at?: Date;
  joined_research_at?: Date;
  github_username?: string;
  reputation: number;
  bio?: string;
  avatar_url?: string;
  location?: string;
  pronouns?: string;
  num_solutions_mentored: number;
  mentor_satisfaction_percentage?: number;
  stripe_customer_id?: string;
  total_donated_in_cents?: number;
  active_donation_subscription?: boolean;
  created_at: Date;
  updated_at: Date;
  show_on_supporters_page: boolean;
  client_id?: number;
  phone_number?: string;
  personal_email?: string;
  // is_active: boolean;
  users_type: string;
  alternative_phonenumber?: string;
  email_confirmed?: string;
  last_name?: string;
  work_email?: string;
  created_by?: number;
  resetpassword?: string;
  is_password_changed: boolean;
  password_updated_at?: Date;
  updated_by?: number;
  name?: string;
  is_active: string;
  approved_by?: number;
}
export interface RequestWithUser extends Request {
  user: User
  isNewUser?: boolean
  token?: string
  supabaseUser?: object
}