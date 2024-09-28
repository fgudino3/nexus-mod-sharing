import { fetch } from '@tauri-apps/api/http';
import OffsetPagination from '@/interfaces/OffsetPagination';
import { useUserState } from '@/states/userState';
import Profile from '@/interfaces/Profile';
import { useState } from 'react';
import { UserBase } from '@/interfaces/User';

export default function useProfileApi() {
  const jwt = useUserState((state) => state.userJwt);
  const [user, setUser] = useState<UserBase>();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [canPage, setCanPage] = useState(true);
  const pageSize = 20;

  function updatePage(data: OffsetPagination<Profile>) {
    console.log(data);
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

  return { getMyProfiles, getProfiles, profiles, user };
}
