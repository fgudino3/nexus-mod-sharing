export default interface Mod {
  id: string; // modData.id
  name: string; // modData.attributes.modName
  author: string; // modData.attributes.author
  pageUrl: string; // modData.attributes.homepage
  imageUrl: string; // modData.attributes.pictureUrl
  description: string; // modData.attributes.shortDescription
  installed: boolean; // modData.state (string)
}
