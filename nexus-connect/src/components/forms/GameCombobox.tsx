import { Check, ChevronsUpDown } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Fuse from 'fuse.js';

interface GameComboboxProps {
  games: string[];
  form: UseFormReturn<
    {
      name: string;
      game: string;
      description?: string | undefined;
    },
    any,
    undefined
  >;
}

const GAME_LIST_SIZE = 5;

export function GameCombobox({ form, games }: GameComboboxProps) {
  const fuse = new Fuse(games);

  const [open, setOpen] = useState(false);
  const [filteredGames, setFilteredGames] = useState(
    fuse
      .search(form.getValues().game)
      .map((fuseResult) => fuseResult.item)
      .slice(0, GAME_LIST_SIZE)
  );

  function handleSearch(search: string) {
    setFilteredGames(
      fuse
        .search(search)
        .map((fuseResult) => fuseResult.item)
        .slice(0, GAME_LIST_SIZE)
    );
  }

  return (
    <FormField
      control={form.control}
      name="game"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Game</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'justify-between',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value
                    ? games.find((game) => game === field.value)
                    : 'Select game'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0 pointer-events-auto">
              <Command shouldFilter={false}>
                <CommandInput
                  onValueChange={handleSearch}
                  placeholder="Search game..."
                />
                <CommandList>
                  <CommandEmpty>No game found.</CommandEmpty>
                  <CommandGroup>
                    {filteredGames.map((game) => (
                      <CommandItem
                        value={game}
                        key={game}
                        onSelect={() => {
                          form.setValue('game', game);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            game === field.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {game}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
