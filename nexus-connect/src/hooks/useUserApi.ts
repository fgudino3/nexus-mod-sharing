import { fetch, Body } from '@tauri-apps/api/http';
import User, { NexusProfile } from '@/interfaces/User';
import { useNavigate } from 'react-router-dom';

export default function useUserApi() {
  const navigate = useNavigate();

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

  return { login, register };
}
