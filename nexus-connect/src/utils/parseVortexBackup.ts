export class Mod {
  public id: string; // gameKey.id
  public name: string; // gameKey.attributes.modName
  public author: string; // gameKey.attributes.author
  public pageUrl: string; // gameKey.attributes.homepage
  public imageUrl: string; // gameKey.attributes.pictureUrl
  public description: string; // gameKey.attributes.shortDescription
  public installed: boolean; // gameKey.state (string)

  constructor() {
    // TODO
  }
}

export function parseVortexBackup() {
  // TODO
}