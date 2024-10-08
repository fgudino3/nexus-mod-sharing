// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod events;
mod models;

use commands::{get_vortex_backup_path, select_mo_csv_file};
use models::payloads::ListenPayload;
use tauri::{async_runtime, Listener};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            select_mo_csv_file,
            get_vortex_backup_path,
        ])
        .setup(|app| {
            let handler_clone = app.handle().clone();

            app.listen_any("process_mo_mods", move |event| {
                println!("process_mo_mods event started");
                let handler_clone = handler_clone.to_owned();
                let payload = event.payload();
                let parsed_payload: ListenPayload = serde_json::from_str(payload).expect("err");

                async_runtime::spawn(async move {
                    println!("spawned task 1");
                    let _result =
                        events::handle_mo_mod_processing(&handler_clone, parsed_payload).await;
                });
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
