import { fetch, Body } from '@tauri-apps/api/http';
import { useNavigate } from 'react-router-dom';
import { useUserState } from '@/states/userState';
import User from '@/interfaces/User';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import CenteredContent from '@/components/layouts/centered-content';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { defineStepper } from '@stepperize/react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Minimum 7 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{7,}$/
);

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(7).regex(passwordValidation, {
      message:
        'Password must contain at least 1 uppercase, lowercase, number and special character',
    }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

const { useStepper } = defineStepper(
  {
    id: 'apikey',
    title: 'Nexus Api Key',
    description: 'TODO',
  },
  {
    id: 'register',
    title: 'Register',
    description: 'Enter your email and create a password below',
  }
);

export default function Register() {
  const navigate = useNavigate();
  const stepper = useStepper();

  const savedApiKey = useUserState((state) => state.nexusApiKey);
  const saveNexusApiKey = useUserState((state) => state.saveNexusApiKey);
  const [apiKey, setApiKey] = useState('');
  const [nexusUsername, setNexusUsername] = useState('');
  const [nexusProfileUrl, setNexusProfileUrl] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // register(values.email, values.password);
  }

  useEffect(() => {
    if (savedApiKey) {
      verifyApiKey(savedApiKey);
    }
  }, []);

  async function verifyApiKey(key?: string) {
    if (!apiKey && !key) {
      return;
    }

    const { data, ok } = await fetch<{ name: string; profile_url: string }>(
      'https://api.nexusmods.com/v1/users/validate.json',
      {
        method: 'GET',
        headers: {
          apikey: key ?? apiKey,
        },
      }
    );

    if (ok) {
      setNexusUsername(() => data.name);
      setNexusProfileUrl(() => data.profile_url);
      saveNexusApiKey(apiKey);
    }

    stepper.next();
  }

  async function register(email: string, password: string) {
    const { ok } = await fetch<User>('http://127.0.0.1:8000/register', {
      method: 'POST',
      body: Body.json({
        email,
        password,
        nexusUsername,
        nexusProfileUrl,
      }),
    });

    if (ok) {
      navigate('/verify');
    }
  }

  return (
    <CenteredContent>
      {stepper.when('apikey', (step) => (
        <Card className="mx-auto w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{step.title}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="apikey">Nexus Api Key</Label>
            <Textarea
              onChange={(e) => setApiKey(e.currentTarget.value)}
              className="mt-1"
              placeholder="Paste your Nexus API Key here."
              id="apikey"
            />
            <Button className="mt-5 w-full" onClick={() => verifyApiKey()}>
              Verify API Key
            </Button>
          </CardContent>
        </Card>
      ))}
      {stepper.when('register', (step) => (
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{step.title}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-2 mb-5">
              <Avatar>
                <AvatarImage src={nexusProfileUrl} />
                <AvatarFallback>TODO</AvatarFallback>
              </Avatar>
              <span>{nexusUsername}</span>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
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
                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="confirm password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="!bg-primary w-full">
                  Register
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ))}
    </CenteredContent>
  );
}
