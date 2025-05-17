import { ChallengeStatus } from '../enums/ChallengeStatus';
import { ChallengeType } from '../enums/ChallengeType';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  prize: string;
  status: ChallengeStatus;
  type: ChallengeType;
  start_date: string | null;
  end_date: string | null;
  image_url: string;
  winner_id: string | null;
  created_at: string;
  challenge_video_id: string;
  category: string;
  tags: string[] | null;
  rules: string[] | null;
}
