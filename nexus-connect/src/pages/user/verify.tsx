import CenteredContent from '@/components/layouts/centered-content';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ConnectApi } from '@/utils/request';
import User from '@/interfaces/User';
import { useState } from 'react';
import { BASE_URL } from '@/utils/constants';

export default function Verify() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);

  async function verifyAccount() {
    const { ok } = await ConnectApi.postNoBody<User>(
      `${BASE_URL}/verify?token=${token}`
    );

    if (ok) {
      setVerified(() => true);
    }
  }

  if (verified) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Account verified!</h1>
        <Button onClick={() => navigate('/login')} className="mt-10">
          Go to login
        </Button>
      </div>
    );
  }

  return (
    <CenteredContent>
      <h1 className="text-xl font-bold">
        Check your email for a verification code. Copy and paste it here to
        verify your account.
      </h1>
      <div className="mt-15 min-w-md space-y-5">
        <Textarea
          placeholder="Token"
          onChange={(e) => setToken(e.currentTarget.value)}
        />
        <div className="flex justify-end">
          <Button onClick={verifyAccount}>Verify account</Button>
        </div>
      </div>
    </CenteredContent>
  );
}
