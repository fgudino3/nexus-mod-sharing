import { NexusButton } from '@/components/NexusButton';
import { mapMoModsToMods } from '@/utils/mapping';
import { useNavigate } from 'react-router-dom';
import Commands from '@/services/commands';
import { useModState } from '@/states/modState';
import { toast } from 'sonner';

export default function ModOrganizerListReader() {
  const setMoModList = useModState((state) => state.setMoModList);
  const navigate = useNavigate();

  async function selectMoCsvFile() {
    const mods = await Commands.readModOrganizerList();

    if (mods) {
      setMoModList(mapMoModsToMods(mods));
      navigate('/mod-manager/mo2/starfield');
    } else {
      toast.error('Missing required columns or incorrect format');
    }
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <img src="/mo2-logo.png" className="logo h-36" alt="Mo2 logo" />
        <div className="h-full flex flex-col items-center justify-center">
          <h1 className="text-xl">
            Export a csv file from MO2. Make sure to check all columns for
            export.
          </h1>
          <NexusButton onClick={selectMoCsvFile} className="mt-10">
            Open Mod List CSV File
          </NexusButton>
        </div>
      </div>
    </>
  );
}
