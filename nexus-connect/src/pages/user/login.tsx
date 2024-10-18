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
import { BASE_URL } from '@/utils/constants';

const formSchema = z.object({
  nexusUsername: z.string().max(128),
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
      nexusUsername: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    login(values.nexusUsername, values.password);
  }

  async function login(nexusUsername: string, password: string) {
    const { data, jwt } = await ConnectApi.post<LoginSchema, UserDTO>(
      `${BASE_URL}/login`,
      {
        nexus_username: nexusUsername,
        password,
      }
    );

    const [user, following, followers] = extractFromUserDTO(data);

    await saveUser(user);
    setUserConnections(following, followers);

    if (jwt) {
      await saveJwt(jwt);
    }

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
                name="nexusUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nexus Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username from your Nexus account"
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
              <div className="mt-2 text-center text-sm">
                Forgot your{' '}
                <NavLink to="/forgot-password" className="underline">
                  password
                </NavLink>
                ?
              </div>
              <Button type="submit" className="!bg-primary w-full">
                Log In
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
