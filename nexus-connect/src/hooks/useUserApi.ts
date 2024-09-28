import { fetch, Body } from '@tauri-apps/api/http';
import User, { NexusProfile, UserDTO } from '@/interfaces/User';
import { useNavigate } from 'react-router-dom';
import { useUserState } from '@/states/userState';

export default function useUserApi() {
  const navigate = useNavigate();
  const setUserConnections = useUserState((state) => state.setUserConnections);
  const jwt = useUserState((state) => state.userJwt);

  async function login() {
    // TODO
  }

  async function register(profile: NexusProfile, password: string) {
    const { ok } = await fetch<User>('http://127.0.0.1:8000/register', {
      method: 'POST',
      body: Body.json({
        email: profile.email,
        nexusUsername: profile.name,
        nexusProfileUrl: profile.profile_url,
        password,
      }),
    });

    if (ok) {
      navigate('/verify');
    }
  }

  async function getConnections() {
    const { data: following } = await fetch<UserDTO[]>(
      'http://127.0.0.1:8000/users/following',
      {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + jwt,
        },
      }
    );

    const { data: followers } = await fetch<UserDTO[]>(
      'http://127.0.0.1:8000/users/following',
      {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + jwt,
        },
      }
    );

    setUserConnections(following, followers);
  }

  async function follow(userId: string) {
    const { data, ok } = await fetch<UserDTO>(
      'http://127.0.0.1:8000/users/follow/' + userId,
      {
        method: 'POST',
        headers: {
          authorization: 'Bearer ' + jwt,
        },
      }
    );

    if (ok) {
      setUserConnections(data.following, data.followers);
    }
  }

  async function unfollow(userId: string) {
    const { data, ok } = await fetch<UserDTO>(
      'http://127.0.0.1:8000/users/unfollow/' + userId,
      {
        method: 'POST',
        headers: {
          authorization: 'Bearer ' + jwt,
        },
      }
    );

    if (ok) {
      setUserConnections(data.following, data.followers);
    }
  }

  return { login, register, getConnections, follow, unfollow };
}
