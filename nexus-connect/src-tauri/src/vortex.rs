extern crate dirs;

const VORTEX_BACK_RELATIVE_PATH: &str = "\\Vortex\\temp\\state_backups_full\\startup.json";

#[tauri::command]
pub fn get_vortex_backup_path() -> Result<String, String> {
    let app_data_path_buf = dirs::config_dir();

    let vortex_backup_path = app_data_path_buf.map(|app_data| {
        format!(
            "{}{}",
            app_data.display().to_string(),
            VORTEX_BACK_RELATIVE_PATH
        )
    });

    vortex_backup_path.ok_or("App Data path not found".to_string())
}
