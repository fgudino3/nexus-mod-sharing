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
import { BASE_URL } from '@/utils/constants';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email(),
});

export default function forgotPassword() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    sendResetPasswordEmail(values.email);
  }

  async function sendResetPasswordEmail(email: string) {
    const { ok } = await ConnectApi.post<{ email: string }, null>(
      `${BASE_URL}/users/forgot-password`,
      {
        email,
      }
    );

    if (ok) {
      navigate('/reset-password', { replace: true });
    } else {
      toast.error('No account found with this email.');
    }
  }

  return (
    <CenteredContent>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password?</CardTitle>
          <CardDescription>
            Enter your email for your account so we can send you a link to reset
            your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@test.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="!bg-primary w-full">
                Send Email
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CenteredContent>
  );
}
