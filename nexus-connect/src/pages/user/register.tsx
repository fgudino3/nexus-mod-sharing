import { useUserState } from '@/states/userState';
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
import LoadingDialog from '@/components/dialogs/LoadingDialog';
import useNexusApi from '@/hooks/useNexusApi';
import { toast } from 'sonner';
import useUserApi from '@/hooks/useUserApi';
import { NexusProfile } from '@/interfaces/User';

// Minimum 7 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{7,}$/
);

const formSchema = z
  .object({
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
  const { getNexusProfileAsync } = useNexusApi();
  const { register } = useUserApi();
  const stepper = useStepper();

  const savedApiKey = useUserState((state) => state.nexusApiKey);
  const saveNexusApiKey = useUserState((state) => state.saveNexusApiKey);
  const [currentStep, setCurrentStep] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [nexusProfile, setNexusProfile] = useState<NexusProfile>();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    setLoading(() => true);

    const profile = await getNexusProfileAsync(key ?? apiKey);

    if (!profile) {
      toast.error('Invalid API key');
      setApiKey(() => '');
      setLoading(() => false);
      return;
    }

    setNexusProfile(profile);
    saveNexusApiKey(apiKey);

    stepper.next();
    setCurrentStep((step) => step + 1);
    setLoading(() => false);
  }

  return (
    <CenteredContent>
      {loading && <LoadingDialog text="Verifying Nexus Api Key..." />}
      <div className="mb-5 flex flex-col justify-center items-center space-y-5">
        <h1 className="text-3xl">Create An Account</h1>
        <Stepper steps={stepper.all} currentStep={currentStep} />
      </div>
      <Card className="mx-auto max-w-xl !border-none">
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
                  value={apiKey}
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
                className="space-y-5 w-sm"
              >
                {nexusProfile && (
                  <div className="space-y-2">
                    <Label>Nexus Account</Label>
                    <div className="flex items-center space-x-2 self-center">
                      <Avatar>
                        <AvatarImage src={nexusProfile.profile_url} />
                        <AvatarFallback>TODO</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{nexusProfile.name}</p>
                        <p className="text-sm opacity-50">
                          {nexusProfile.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                <div className="flex justify-end">
                  <Button type="submit" className="!bg-primary">
                    Register
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        ))}
      </Card>
    </CenteredContent>
  );
}
