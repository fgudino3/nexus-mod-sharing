import { Body, fetch } from '@tauri-apps/api/http';
import OffsetPagination from '@/interfaces/OffsetPagination';
import { useUserState } from '@/states/userState';
import Profile from '@/interfaces/Profile';
import { useState } from 'react';
import { UserBase } from '@/interfaces/User';
import Mod from '@/interfaces/Mod';

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

    const { data, ok } = await fetch<OffsetPagination<Profile>>(
      'http://127.0.0.1:8000/profiles/me',
      {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + jwt,
        },
        query: {
          pageSize: pageSize.toString(),
          currentPage: currentPage.toString(),
        },
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

    const { data, ok } = await fetch<OffsetPagination<Profile>>(
      'http://127.0.0.1:8000/profiles',
      {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + jwt,
        },
        query: {
          user_id: userId,
          pageSize: pageSize.toString(),
          currentPage: currentPage.toString(),
        },
      }
    );

    if (ok) {
      updatePage(data);
      setUser({
        id: data.items[0].userId,
        ...data.items[0].user,
      });
    }
  }

  async function createProfile(
    modList: Mod[],
    name: string,
    description: string,
    game: string
  ) {
    await createMods(modList);

    await fetch<Profile>('http://127.0.0.1:8000/profiles', {
      method: 'POST',
      body: Body.json({
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
            isPatched: mod.isPatched,
          })),
        manualMods: modList
          .filter((mod) => mod.id === undefined)
          .map((mod) => ({
            modName: mod.name,
            order: mod.order,
          })),
      }),
      headers: {
        authorization: 'Bearer ' + jwt,
      },
    });
  }

  async function createMods(modList: Mod[]) {
    for (const mod of modList) {
      if (mod.id) {
        await fetch<Profile>('http://127.0.0.1:8000/mods', {
          method: 'POST',
          body: Body.json({
            id: mod.id,
            name: mod.name,
            description: mod.description,
            author: mod.author,
            pageUrl: mod.pageUrl,
            imageUrl: mod.imageUrl,
            available: mod.available,
          }),
          headers: {
            authorization: 'Bearer ' + jwt,
          },
        });
      } else {
        await fetch<Profile>('http://127.0.0.1:8000/mods/manual', {
          method: 'POST',
          body: Body.json({
            name: mod.name,
            description: mod.description,
            author: mod.author,
            pageUrl: mod.pageUrl,
          }),
          headers: {
            authorization: 'Bearer ' + jwt,
          },
        });
      }
    }
  }

  return { getMyProfiles, getProfiles, createProfile, profiles, user };
}
