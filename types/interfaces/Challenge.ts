import { ChallengeStatus } from '../enums/ChallengeStatus';
import { ChallengeType } from '../enums/ChallengeType';

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  prize: string;
  status: ChallengeStatus;
  start_date: string | null;
  end_date: string | null;
  image_url: string;
  challenge_video_id: string;
  category: string;
  tags: string[] | null;
}
