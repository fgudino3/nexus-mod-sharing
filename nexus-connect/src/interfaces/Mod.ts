export default interface Mod {
  id: number;
  name: string;
  pageUrl: string;
  version: string;
  installed: boolean;
  available: boolean;
  order?: string;
  author?: string;
  imageUrl?: string;
  description?: string;
  fileSizeBytes?: number;
  isPatched?: boolean;
}

export interface ManualModUpsert {
  name?: string;
  version?: string;
  author?: string;
  description?: string;
  pageUrl?: string;
}
