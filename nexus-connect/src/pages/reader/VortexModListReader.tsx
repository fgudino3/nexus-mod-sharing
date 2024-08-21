import { path, fs } from '@tauri-apps/api';
import { useState, useEffect } from 'react';

export default function VortexModListReader() {
  const [appData, setAppData] = useState('');

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke('greet', { name: appData }));
  // }

  useEffect(() => {
    const getVortexBackupPath = async () => {
      const appDataPath = await path.appDataDir();

      setAppData(() => getVortexBackupJsonPath(appDataPath));
    }

    const checkIfVortexBackupExists = async () => {
      const backupExists = await fs.exists(appData);

      console.log('Does backup exist?', backupExists);
    };

    getVortexBackupPath();
    checkIfVortexBackupExists();
  });
  
  return (
    <>
      <div className="h-full flex flex-col items-center justify-center">
        <p>Vortex TODO</p>
        <p>{ appData }</p>
      </div>
    </>
  );
}

function getVortexBackupJsonPath(appDataPath: string): string {
  const dirs = appDataPath.split('\\');
      dirs.pop();
      dirs.pop();

  return dirs.join('\\').concat('\\Vortex\\temp\\state_backups_full');
}
