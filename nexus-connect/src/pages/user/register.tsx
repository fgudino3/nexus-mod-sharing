import { NexusButton } from '@/components/NexusButton';
import { fetch, Body } from '@tauri-apps/api/http';
import { useNavigate } from 'react-router-dom';
import { useUserState } from '@/states/userState';
import User from '@/interfaces/User';
import { useEffect, useState } from 'react';

export default function Register() {
  const navigate = useNavigate();

  const savedApiKey = useUserState((state) => state.nexusApiKey);
  const saveNexusApiKey = useUserState((state) => state.saveNexusApiKey);
  const [apiKey, setApiKey] = useState('');
  const [email, setEmail] = useState('');
  const [nexusUsername, setNexusUsername] = useState('');
  const [nexusProfileUrl, setNexusProfileUrl] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');

  useEffect(() => {
    if (savedApiKey) {
      verifyApiKey(savedApiKey);
    }
  }, []);

  async function verifyApiKey(key?: string) {
    if (!apiKey && !key) {
      return;
    }

    const { data, ok } = await fetch<{ name: string; profile_url: string }>(
      'https://api.nexusmods.com/v1/users/validate.json',
      {
        method: 'GET',
        headers: {
          apikey: key ?? apiKey,
        },
      }
    );

    if (ok) {
      setNexusUsername(() => data.name);
      setNexusProfileUrl(() => data.profile_url);
      saveNexusApiKey(apiKey);
    }
  }

  async function register() {
    if (password !== passwordMatch) {
      // TODO: error message toast
      return;
    }

    const { ok } = await fetch<User>('http://127.0.0.1:8000/register', {
      method: 'POST',
      body: Body.json({
        email,
        password,
        nexusUsername,
        nexusProfileUrl,
      }),
    });

    if (ok) {
      navigate('/verify');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold">Register</h1>
      <div className="flex flex-col space-y-5">
        {nexusUsername ? (
          <div>
            <img
              src={nexusProfileUrl}
              alt="Avatar"
              className="w-9 h-9 object-cover rounded-full"
            />
            <p>Nexus username: {nexusUsername}</p>
          </div>
        ) : (
          <div>
            <input
              type="text"
              onChange={(e) => setApiKey(e.currentTarget.value)}
              placeholder="Nexus API Key"
              className="bg-gray-700 outline-none rounded-md mt-10 text-lg px-4 py-2"
            />
            <NexusButton onClick={verifyApiKey}>Verify</NexusButton>
          </div>
        )}
        <input
          type="text"
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="Email"
          className="bg-gray-700 outline-none rounded-md mt-10 text-lg px-4 py-2"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder="Password"
          className="bg-gray-700 outline-none rounded-md mt-10 text-lg px-4 py-2"
        />
        <input
          type="password"
          onChange={(e) => setPasswordMatch(e.currentTarget.value)}
          placeholder="Confirm Password"
          className="bg-gray-700 outline-none rounded-md mt-10 text-lg px-4 py-2"
        />
        <NexusButton onClick={register}>Register</NexusButton>
      </div>
    </div>
  );
}
