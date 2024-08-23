import MdiCheckboxMarkedCircle from '~icons/mdi/checkbox-marked-circle';
import MdiArrowLeft from '~icons/mdi/arrow-left';
import { useNavigate } from 'react-router-dom';
import { fs, invoke } from '@tauri-apps/api';
import { useState, useEffect } from 'react';
import MdiError from '~icons/mdi/error';
import { NexusButton } from '@/components/NexusButton';
import { useModState } from '@/states/vortexState';

const DEFAULT_VORTEX_BACKUP_PATH =
  'C:\\Users\\{user}\\AppData\\Roaming\\Vortex\\temp\\state_backups_full\\startup.json';

export default function VortexModListReader() {
  const [appData, setAppData] = useState<string>(DEFAULT_VORTEX_BACKUP_PATH);
  const [backupFileExists, setBackupFileExists] = useState<boolean>(false);
  const [gameNames, setGameNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const modState = useModState();

  useEffect(() => {
    if (modState.moddedGames.size > 0) {
      setGameNames(() => [...modState.moddedGames.keys()]);
      setBackupFileExists(() => true);
      setLoading(() => false);
    } else {
      getVortexBackupPath().then((path) => {
        readVortexBackup(path);
      });
    }
  }, []);

  async function getVortexBackupPath() {
    const backupPath = await invoke<string>('get_vortex_backup_path');
    setAppData(() => backupPath);

    return backupPath;
  }

  async function readVortexBackup(path: string) {
    setLoading(() => true);

    try {
      const jsonString = await fs.readTextFile(path);

      setBackupFileExists(() => true);

      const vortexDataObj = JSON.parse(jsonString);

      console.log(vortexDataObj.persistent.mods.fallout4);

      modState.parseVortexBackup(vortexDataObj.persistent.mods);

      setGameNames(() => Object.keys(vortexDataObj.persistent.mods));
    } catch (error) {
      setBackupFileExists(() => false);
      console.error(error);
    } finally {
      setLoading(() => false);
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
        <img src="/vortex-logo.png" className="logo" alt="Vortex logo" />
        <div className="flex items-center space-x-2">
          <p className="py-2 px-3 font-mono bg-gray-800 rounded-md">
            {appData}
          </p>
          <StatusIcon exists={backupFileExists} loading={loading} />
        </div>
        <GameSelectionList
          loading={loading}
          exists={backupFileExists}
          gameNames={gameNames}
          readVortexBackup={() => readVortexBackup(appData)}
        />
      </div>
    </>
  );
}

function StatusIcon({
  exists,
  loading,
}: {
  exists: boolean;
  loading: boolean;
}) {
  if (loading) {
    return <></>;
  } else if (exists) {
    return <MdiCheckboxMarkedCircle className="text-emerald-500 h-7 w-7" />;
  } else {
    return <MdiError className="text-red-500 h-7 w-7" />;
  }
}

function GameSelectionList({
  exists,
  loading,
  gameNames,
  readVortexBackup,
}: VortexProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <>
        <p className="mt-5">Getting startup.json...</p>
      </>
    );
  } else if (exists) {
    return (
      <>
        <h3 className="text-2xl font-bold my-5">Select a game</h3>
        <div className="grid grid-cols-3 gap-6">
          {gameNames.map((gameName) => (
            <NexusButton
              onClick={async () => {
                navigate('/vortex/' + gameName);
              }}
              className="px-3 py-2 rounded-md bg-amber-600"
              key={gameName}
            >
              {gameName}
            </NexusButton>
          ))}
        </div>
      </>
    );
  } else {
    return (
      <>
        <p className="mt-10 text-xl text-red-500">
          The startup.json file could not be found.
        </p>
        <p>Try starting up Vortex and then try again.</p>
        <NexusButton onClick={readVortexBackup} className="mt-10">
          Search again
        </NexusButton>
      </>
    );
  }
}

type VortexProps = {
  exists: boolean;
  loading: boolean;
  gameNames: string[];
  readVortexBackup: () => Promise<void>;
};
