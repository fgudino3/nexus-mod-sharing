import { useUserState } from '@/states/userState';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserDTO, LoginSchema } from '@/interfaces/User';
import { extractFromUserDTO } from '@/utils/mapping';
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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function Login() {
  const navigate = useNavigate();
  const saveUser = useUserState((state) => state.saveUser);
  const saveJwt = useUserState((state) => state.saveJwt);
  const setUserConnections = useUserState((state) => state.setUserConnections);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    login(values.email, values.password);
  }

  async function login(email: string, password: string) {
    const { data, headers } = await ConnectApi.post<LoginSchema, UserDTO>(
      'http://127.0.0.1:8000/login',
      {
        email,
        password,
      }
    );

    const [user, following, followers] = extractFromUserDTO(data);

    await saveUser(user);
    setUserConnections(following, followers);

    const jwt = (headers as any).authorization.split(' ')[1];

    await saveJwt(jwt);

    navigate('/');
  }

  return (
    <CenteredContent>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                      <Input
                        type="email"
                        placeholder="example@test.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="!bg-primary w-full">
                Submit
              </Button>
            </form>
          </Form>
          <div className="mt-10 text-center text-sm">
            Don't have an account?{' '}
            <NavLink to="/register" className="underline">
              Sign up
            </NavLink>
          </div>
        </CardContent>
      </Card>
    </CenteredContent>
  );
}
