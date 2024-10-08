import { NexusButton } from '@/components/NexusButton';
import { useNavigate } from 'react-router-dom';
import User from '@/interfaces/User';
import { useState } from 'react';
import { ConnectApi } from '@/utils/request';

export default function Verify() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);

  async function verifyAccount() {
    const { ok } = await ConnectApi.postNoBody<User>(
      'http://127.0.0.1:8000/verify?token=' + token
    );

    if (ok) {
      setVerified(() => true);
    }
  }

  if (verified) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Account verified!</h1>
        <NexusButton onClick={() => navigate('/login')} className="mt-10">
          Go to login
        </NexusButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold">
        Check your email for a verification code. Copy and paste it here to
        verify your account.
      </h1>
      <div className="space-x-2">
        <input
          type="text"
          onChange={(e) => setToken(e.currentTarget.value)}
          className="bg-gray-700 outline-none rounded-md mt-10 text-lg px-4 py-2"
        />
        <NexusButton onClick={verifyAccount}>Verify</NexusButton>
      </div>
    </div>
  );
}
