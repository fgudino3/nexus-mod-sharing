import Mod from '@/interfaces/Mod';
import MoMod from '@/interfaces/MoMod';
import User, { UserBase, UserDTO } from '@/interfaces/User';

export function extractFromUserDTO(
  userDTO: UserDTO
): [user: User, following: UserBase[], followers: UserBase[]] {
  const user: User = {
    id: userDTO.id,
    email: userDTO.email,
    nexusUsername: userDTO.nexusUsername,
    nexusProfileUrl: userDTO.nexusProfileUrl,
    createdAt: new Date(userDTO.createdAt),
    updatedAt: new Date(userDTO.updatedAt),
  };

  return [user, userDTO.following, userDTO.followers];
}

export function mapMoModsToMods(moMods: MoMod[]): Mod[] {
  const modList: Mod[] = [];

  for (const moMod of moMods) {
    const sameMod = modList.find((mod) => mod.id === moMod.id);

    if (sameMod) {
      sameMod.isPatched = true;
      continue;
    }

    modList.push({
      id: moMod.id,
      name: moMod.name,
      pageUrl: moMod.pageUrl,
      version: moMod.version,
      installed: moMod.status === '+',
      order: moMod.order,
      isPatched: false,
      available: true,
    });
  }

  return modList;
}
