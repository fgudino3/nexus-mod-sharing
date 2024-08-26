import MoMod from '@/interfaces/MoMod';
import { invoke } from '@tauri-apps/api';

export default class Commands {
  public static async readModOrganizerList(): Promise<MoMod[] | null> {
    const mods = await invoke<MoMod[] | null>('select_mo_csv_file');

    return mods;
  }

  public static async getVortexBackupPath(): Promise<string> {
    const backupPath = await invoke<string>('get_vortex_backup_path');

    return backupPath;
  }
}
