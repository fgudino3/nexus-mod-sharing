import { NexusButton } from '@/components/NexusButton';
import { mapMoModsToMods } from '@/utils/mapping';
import MdiArrowLeft from '~icons/mdi/arrow-left';
import { useNavigate } from 'react-router-dom';
import Commands from '@/services/commands';
import Mod from '@/interfaces/Mod';
import { useState } from 'react';

export default function VortexModListReader() {
  const [moMods, setMoMods] = useState<Mod[]>([]);
  const navigate = useNavigate();

  async function selectMoCsvFile() {
    try {
      const mods = await Commands.readModOrganizerList();

      if (mods) {
        setMoMods(() => mapMoModsToMods(mods));
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {/* HEADER */}
      <div className="py-5">
        <button
          className="flex items-center space-x-2 text-xl"
          onClick={() => navigate(-1)}
        >
          <MdiArrowLeft />
          <span>back</span>
        </button>
      </div>
      {/* CONTENT */}
      <div className="flex flex-col items-center">
        <img src="/mo2-logo.png" className="logo" alt="react logo" />
        <div className="h-full flex flex-col items-center justify-center">
          <h1 className="text-xl">
            Export a csv file from MO2. Make sure to check all columns for
            export.
          </h1>
          <NexusButton onClick={selectMoCsvFile} className="mt-10">
            Open Mod List CSV File
          </NexusButton>
          <table>
            <tbody>
              {moMods.map((mod) => (
                <tr key={mod.id} className="flex space-x-10">
                  <td>{mod.name}</td>
                  <td>{mod.pageUrl}</td>
                  <td>{mod.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
