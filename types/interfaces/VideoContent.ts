export interface VideoContent {
  id: string;
  title: string;
  user_id: string;
  video_url: string;
  thumbnail_url: string;
  caption: string;
  category: string;
  challenge_id: string | null;
  glazes_count: number;
  status: string;
  created_at: string;
  publish_as: string | null;
}
