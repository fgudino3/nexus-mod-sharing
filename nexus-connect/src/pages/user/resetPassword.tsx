import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CenteredContent from '@/components/layouts/centered-content';
import { ConnectApi } from '@/utils/request';
import { BASE_URL, PASSWORD_REGEX } from '@/utils/constants';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z
  .object({
    token: z.string(),
    newPassword: z.string().min(7).regex(PASSWORD_REGEX, {
      message:
        'Password must contain at least 1 uppercase, lowercase, number and special character',
    }),
    newPasswordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

export default function resetPassword() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    resetPassword(values.token, values.newPassword);
  }

  async function resetPassword(token: string, password: string) {
    const { ok } = await ConnectApi.post<
      { token: string; password: string },
      null
    >(`${BASE_URL}/users/reset-password`, {
      token,
      password,
    });

    if (ok) {
      toast.success('Password has been reset');
      navigate('/login', { replace: true });
    } else {
      // TODO: add feat to resend another token if error
      toast.error('Invalid token.');
    }
  }

  return (
    <CenteredContent>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Rest Password</CardTitle>
          <CardDescription>
            Copy and paste the token sent to your email. Create a new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Token" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPasswordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="confirm new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="!bg-primary w-full">
                Reset Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CenteredContent>
  );
}
