import { NexusButton } from '@/components/NexusButton';
import { fetch, Body } from '@tauri-apps/api/http';
import { useNavigate } from 'react-router-dom';
import { useUserState } from '@/states/userState';
import User from '@/interfaces/User';
import { useState } from 'react';

export default function Register() {
  const navigate = useNavigate();

  const apiKey = useUserState((state) => state.nexusApiKey);
  const [email, setEmail] = useState('');
  const [nexusUsername, setNexusUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');

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
        <input
          type="text"
          onChange={(e) => setNexusUsername(e.currentTarget.value)}
          placeholder="Nexus Username"
          className="bg-gray-700 outline-none rounded-md mt-10 text-lg px-4 py-2"
        />
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
