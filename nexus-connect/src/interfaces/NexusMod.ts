export default interface NexusMod {
  name: string;
  summary: string;
  description: string;
  picture_url: string;
  mod_downloads: number;
  mod_unique_downloads: number;
  uid: number;
  mod_id: number;
  game_id: number;
  allow_rating: boolean;
  domain_name: string;
  category_id: number;
  version: string;
  endorsement_count: number;
  created_timestamp: number;
  created_time: Date;
  updated_timestamp: number;
  updated_time: Date;
  author: string;
  uploaded_by: string;
  uploaded_users_profile_url: string;
  contains_adult_content: false;
  status: string;
  available: true;
  user: {
    member_id: number;
    member_group_id: number;
    name: string;
  };
  endorsement: {
    endorse_status: string;
    timestamp: string | null;
    version: string | null;
  };
}

export interface NexusGame {
  id: number;
  name: string;
  forum_url: string;
  nexusmods_url: string;
  genre: string;
  file_count: number;
  downloads: number;
  domain_name: string;
  approved_date: number;
  file_views: number;
  authors: number;
  file_endorsements: number;
  mods: number;
  categories: {
    category_id: number;
    name: string;
    parent_category: boolean;
  }[];
}
