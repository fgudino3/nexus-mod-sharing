import { NexusButton } from '@/components/NexusButton';
import { useUserState } from '@/states/userState';
import { useState } from 'react';

export default function Login() {
  const saveNexusApiKey = useUserState((state) => state.saveNexusApiKey);
  const apiKey = useUserState((state) => state.nexusApiKey);
  const [nexusApiKey, setNexusApiKey] = useState('');

  if (apiKey) {
    return (
      <div>
        <p>Key found! {apiKey}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold">Please provide your nexus API key</h1>
      <div className="space-x-2">
        <input
          type="text"
          onChange={(e) => setNexusApiKey(e.currentTarget.value)}
          className="bg-gray-700 outline-none rounded-md mt-10 text-lg px-4 py-2"
        />
        <NexusButton onClick={() => saveNexusApiKey(nexusApiKey)}>
          Save
        </NexusButton>
      </div>
    </div>
  );
}
