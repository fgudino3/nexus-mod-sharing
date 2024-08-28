export default interface Mod {
  id: number;
  name: string;
  pageUrl: string;
  version: string;
  installed: boolean;
  order?: string;
  author?: string;
  imageUrl?: string;
  description?: string;
  fileSizeBytes?: number;
  isPatched?: boolean;
}
