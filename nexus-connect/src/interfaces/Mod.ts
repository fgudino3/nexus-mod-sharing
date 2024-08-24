export default interface Mod {
  id: number;
  name: string;
  author: string;
  pageUrl: string;
  imageUrl: string;
  description: string;
  version: string;
  installed: boolean;
  fileSizeBytes: number;
  isPatched: boolean;
}
