import { fetch, Body } from '@tauri-apps/api/http';
import { useNavigate } from 'react-router-dom';
import { useUserState } from '@/states/userState';
import User from '@/interfaces/User';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import CenteredContent from '@/components/layouts/centered-content';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import Stepper from '@/components/ui/stepper';
import { shell } from '@tauri-apps/api';

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
  const [currentStep, setCurrentStep] = useState(0);
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
    setCurrentStep((step) => step + 1);
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
      <div className="mb-5">
        <Stepper steps={stepper.all} currentStep={currentStep} />
      </div>
      <Card className="mx-auto w-2xl !border-none">
        {stepper.when('apikey', () => (
          <CardContent>
            <p className="italic">
              BETA Privacy Notice: This method of signing in is for the test
              version of Nexus Connect. The API key will only be stored locally
              on your PC.
            </p>
            <ul className="space-y-3 list-disc mt-5">
              <li>
                Go to your Nexus settings{' '}
                <button
                  className="underline text-primary"
                  onClick={() =>
                    shell.open('https://next.nexusmods.com/settings/api-keys')
                  }
                >
                  API Keys page
                </button>
                .
              </li>
              <li>
                Scroll to the bottom of the page and generate a Personal API Key
              </li>
              <li>
                <Textarea
                  onChange={(e) => setApiKey(e.currentTarget.value)}
                  className="mt-1"
                  placeholder="Paste your Nexus API Key here."
                  id="apikey"
                />
              </li>
            </ul>
            <div className="flex justify-end">
              <Button
                className="mt-5"
                disabled={apiKey.length === 0}
                onClick={() => verifyApiKey()}
              >
                Verify API Key
              </Button>
            </div>
          </CardContent>
        ))}
        {stepper.when('register', () => (
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <Label>Nexus Account</Label>
                  <div className="flex items-center space-x-2 self-center">
                    <Avatar>
                      <AvatarImage src={nexusProfileUrl} />
                      <AvatarFallback>TODO</AvatarFallback>
                    </Avatar>
                    <span>{nexusUsername}</span>
                  </div>
                </div>
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
                <Button
                  type="submit"
                  className="!bg-primary col-span-2 justify-self-end"
                >
                  Register
                </Button>
              </form>
            </Form>
          </CardContent>
        ))}
      </Card>
    </CenteredContent>
  );
}
