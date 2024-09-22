import { useUserState } from '@/states/userState';
import { fetch, Body } from '@tauri-apps/api/http';
import { NavLink, useNavigate } from 'react-router-dom';
import User, { UserDTO } from '@/interfaces/User';
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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
// TODO: use on register page
// .refine((data) => data.password === data.passwordConfirm, {
//   message: 'Passwords do not match',
//   path: ['passwordConfirm'],
// });

export default function Login() {
  const navigate = useNavigate();
  const saveUser = useUserState((state) => state.saveUser);
  const saveJwt = useUserState((state) => state.saveJwt);
  const setUserConnections = useUserState((state) => state.setUserConnections);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    login(values.email, values.password);
  }

  async function login(email: string, password: string) {
    const { data, headers } = await fetch<UserDTO>(
      'http://127.0.0.1:8000/login',
      {
        method: 'POST',
        body: Body.json({
          email,
          password,
        }),
      }
    );

    const [user, following, followers] = extractFromUserDTO(data);

    saveUser(user);
    setUserConnections(following, followers);

    const jwt = headers.authorization.split(' ')[1];

    saveJwt(jwt);

    navigate('/');
  }

  return (
    <>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <NavLink to="/register" className="text-blue underline text-center mt-16">
        Create an account
      </NavLink>
    </>
  );

  // return (
  //   <div className="flex flex-col items-center justify-center h-full">
  //     <h1 className="text-2xl font-bold">Login</h1>
  //     <div className="flex flex-col space-y-5">
  //       <input
  //         type="text"
  //         onChange={(e) => setEmail(e.currentTarget.value)}
  //         placeholder="Email"
  //         className="bg-gray-700 outline-none rounded-md mt-10 text-lg px-4 py-2"
  //       />
  //       <input
  //         type="password"
  //         onChange={(e) => setPassword(e.currentTarget.value)}
  //         placeholder="Password"
  //         className="bg-gray-700 outline-none rounded-md mt-10 text-lg px-4 py-2"
  //       />
  //       <NexusButton onClick={login}>Login</NexusButton>
  //     </div>
  //     <NavLink to="/register" className="text-blue underline text-center mt-16">
  //       Create an account
  //     </NavLink>
  //   </div>
  // );
}
