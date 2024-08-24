// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod mo;
mod vortex;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            mo::select_mo_csv_file,
            vortex::get_vortex_backup_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
