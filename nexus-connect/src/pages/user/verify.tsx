import CenteredContent from '@/components/layouts/centered-content';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ConnectApi } from '@/utils/request';
import User from '@/interfaces/User';
import { useState } from 'react';
import { BASE_URL } from '@/utils/constants';
import { toast } from 'sonner';

export default function Verify() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');

  async function verifyAccount() {
    const { ok } = await ConnectApi.postNoBody<User>(
      `${BASE_URL}/verify?token=${token}`
    );

    if (ok) {
      navigate('/login');
      toast.success('Account verified. You can now log in.');
    }
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
