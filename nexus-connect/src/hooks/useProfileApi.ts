import Mod, { ManualModUpsert, ModUpsert } from '@/interfaces/Mod';
import Profile, { ProfileCreate } from '@/interfaces/Profile';
import OffsetPagination from '@/interfaces/OffsetPagination';
import { useUserState } from '@/states/userState';
import { UserBase } from '@/interfaces/User';
import { ConnectApi } from '@/utils/request';
import { useState } from 'react';

export default function useProfileApi() {
  const jwt = useUserState((state) => state.userJwt);
  const [user, setUser] = useState<UserBase>();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [canPage, setCanPage] = useState(true);
  const pageSize = 20;

  function updatePage(data: OffsetPagination<Profile>) {
    setProfiles((profiles) => profiles.concat(data.items));
    setCurrentPage((page) => page + 1);
    setCanPage(() => data.offset + data.limit < data.total);
  }

  async function getMyProfiles() {
    if (!canPage || !jwt) {
      return;
    }

    const { data, ok } = await ConnectApi.get<OffsetPagination<Profile>>(
      'http://127.0.0.1:8000/profiles/me',
      jwt,
      {
        pageSize: pageSize.toString(),
        currentPage: currentPage.toString(),
      }
    );

    if (ok) {
      updatePage(data);
    }
  }

  async function getProfiles(userId?: string) {
    if (!canPage || !jwt) {
      return;
    }

    const { data, ok } = await ConnectApi.get<OffsetPagination<Profile>>(
      'http://127.0.0.1:8000/profiles',
      jwt,
      {
        user_id: userId,
        pageSize: pageSize.toString(),
        currentPage: currentPage.toString(),
      }
    );

    if (ok) {
      updatePage(data);

      if (data.items.length > 0) {
        setUser({
          id: data.items[0].userId,
          createdAt: new Date(data.items[0].user.createdAt),
          updatedAt: new Date(data.items[0].user.updatedAt),
          nexusUsername: data.items[0].user.nexusUsername,
          nexusProfileUrl: data.items[0].user.nexusProfileUrl,
        });
      }
    }
  }

  async function getProfile(id: string) {
    const { data, ok } = await ConnectApi.get<Profile>(
      `http://127.0.0.1:8000/profiles/${id}`,
      jwt
    );

    if (ok) {
      return data;
    }
  }

  async function createProfile(
    modList: Mod[],
    name: string,
    description: string,
    game: string
  ) {
    await createMods(modList);

    await ConnectApi.post<ProfileCreate, Profile>(
      'http://127.0.0.1:8000/profiles',
      {
        name,
        game,
        description,
        mods: modList
          .filter((mod) => mod.id !== undefined)
          .map((mod) => ({
            modId: mod.id,
            version: mod.version,
            order: mod.order,
            installed: mod.installed,
            isPatched: mod.isPatched ?? false,
          })),
        manualMods: modList
          .filter((mod) => mod.id === undefined)
          .map((mod) => ({
            modName: mod.name,
            order: mod.order,
          })),
      },
      jwt
    );
  }

  async function createMods(modList: Mod[]) {
    for (const mod of modList) {
      if (mod.id) {
        await ConnectApi.post<ModUpsert, Profile>(
          'http://127.0.0.1:8000/mods',
          {
            id: mod.id,
            name: mod.name,
            description: mod.description,
            author: mod.author,
            pageUrl: mod.pageUrl,
            imageUrl: mod.imageUrl,
            available: mod.available,
          },
          jwt
        );
      } else {
        await ConnectApi.post<ManualModUpsert, Profile>(
          'http://127.0.0.1:8000/mods/manual',
          {
            name: mod.name,
            description: mod.description,
            author: mod.author,
            pageUrl: mod.pageUrl,
          },
          jwt
        );
      }
    }
  }

  return {
    getMyProfiles,
    getProfiles,
    getProfile,
    createProfile,
    profiles,
    user,
  };
}
