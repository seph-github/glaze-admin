export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  profile_image_url: string | null;
  bio: string | null;
  total_glazes: number | null;
  total_uploads: number | null;
  badges: Record<string, any> | null;
  created_at: Date | null;
  provider: string | null;
  total_followers: number | null;
  total_following: number | null;
  username_id: string | null;
  role: string;
  phone_number: string | null;
  is_onboarding_completed: boolean | null;
  full_name: string | null;
  interests: string[] | null;
  is_completed_profile: boolean;
  updated_at: Date | null;
}
