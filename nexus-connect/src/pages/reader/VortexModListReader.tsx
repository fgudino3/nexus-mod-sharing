import MdiCheckboxMarkedCircle from '~icons/mdi/checkbox-marked-circle';
import MdiArrowLeft from '~icons/mdi/arrow-left';
import { useNavigate } from 'react-router-dom';
import { path, fs } from '@tauri-apps/api';
import { useState, useEffect } from 'react';

const DEFAULT_VORTEX_BACKUP_PATH =
  'C:\\Users\\{user}\\AppData\\Roaming\\Vortex\\temp\\state_backups_full\\startup.json';

export default function VortexModListReader() {
  const [appData, setAppData] = useState<string>(DEFAULT_VORTEX_BACKUP_PATH);
  const [vortexData, setVortexData] = useState<string[]>([]);
  const navigate = useNavigate();

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke('greet', { name: appData }));
  // }

  useEffect(() => {
    const getVortexBackupPath = async () => {
      const appDataPath = await path.appDataDir();

      setAppData(() => getVortexBackupJsonPath(appDataPath));
    };

    const readVortexBackup = async () => {
      const jsonString = await fs.readTextFile(appData);

      const vortexDataObj = JSON.parse(jsonString);

      setVortexData(() => Object.keys(vortexDataObj.persistent.mods));
    };

    getVortexBackupPath();
    readVortexBackup();
  });

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
          <MdiCheckboxMarkedCircle className="text-emerald-500 h-7 w-7" />
        </div>
        <h3 className="text-2xl font-bold my-5">Select a game</h3>
        <div className="grid grid-cols-3 gap-6">
          {vortexData.map((key) => (
            <button
              className="px-3 py-2 rounded-md bg-amber-600 vortex"
              key={key}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function getVortexBackupJsonPath(appDataPath: string): string {
  const dirs = appDataPath.split('\\');
  dirs.pop();
  dirs.pop();

  return dirs
    .join('\\')
    .concat('\\Vortex\\temp\\state_backups_full\\startup.json');
}
