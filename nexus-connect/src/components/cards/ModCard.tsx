import { shell } from '@tauri-apps/api';
import Mod, { ManualModUpsert } from '@/interfaces/Mod';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '../ui/textarea';
import { useState } from 'react';

interface ModCardProps {
  mod: Mod;
  editMod?: (order: string, updatedMod: ManualModUpsert) => void;
}

const formSchema = z.object({
  name: z.string().optional(),
  author: z.string().optional(),
  version: z.string().optional(),
  description: z.string().optional(),
  pageUrl: z.string().optional(),
});

export default function ModCard({ mod, editMod }: ModCardProps) {
  const [isOpen, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: mod.name,
      author: mod.author,
      version: mod.version,
      description: mod.description,
      pageUrl: mod.pageUrl,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    editMod?.(mod.order!, values);
    setOpen(false);
  }

  return (
    <div className="w-full h-full">
      <img
        className="rounded-lg ring-1 ring-accent object-cover w-full"
        style={{ aspectRatio: 16 / 9 }}
        src={mod.imageUrl ?? '/missing-photo.webp'}
        alt="Mod Image"
      />
      <div className="text-left p-2 h-44">
        <p className="font-semibold text-base text-gray-700 line-clamp-2 dark:text-gray-50">
          {mod.name}
        </p>
        <div className="text-xs h-32">
          {mod.author ? (
            <p className="truncate">
              <span className="opacity-50">Author:</span>{' '}
              <span className="text-gray-700 font-medium dark:text-gray-50">
                {mod.author}
              </span>
            </p>
          ) : (
            <></>
          )}
          <p className="line-clamp-5 mt-2">{mod.description}</p>
        </div>
      </div>

      {mod.available ? (
        editMod ? (
          <>
            <Button
              className="!bg-primary w-full"
              onClick={() => setOpen(true)}
            >
              Edit
            </Button>
            <Dialog open={isOpen} onOpenChange={(open) => setOpen(open)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mod Info</DialogTitle>
                  <DialogDescription>
                    Add metadata to your manually installed mod. (Optional)
                  </DialogDescription>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-5 w-full"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mod Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Mod name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                              <Input placeholder="Author name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="version"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Version</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Version e.g. 1.0.2"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Page Url</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Page url where downloaded"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <Button type="submit" className="!bg-primary">
                          Save
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <Button
            onClick={() => shell.open(mod.pageUrl)}
            className="flex w-full space-x-2"
          >
            <span>Visit Nexus Page</span>
            <ExternalLink className="h-5 w-5" />
          </Button>
        )
      ) : (
        <div className="text-center">
          <p className="italic">Mod has been removed</p>
        </div>
      )}
    </div>
  );
}
