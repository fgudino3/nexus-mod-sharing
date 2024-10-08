use crate::models::MoMod;
use std::fs::File;
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_fs::FilePath;

extern crate csv;

#[tauri::command]
pub async fn select_mo_csv_file(app: AppHandle) -> Result<Option<Vec<MoMod>>, String> {
    let file_path = app
        .dialog()
        .file()
        .add_filter("CSV", &["csv", "txt"])
        .blocking_pick_file();

    match file_path {
        Some(path) => get_mods_from_csv(path),
        _ => Ok(None),
    }
}

fn get_mods_from_csv(path: FilePath) -> Result<Option<Vec<MoMod>>, String> {
    let file = File::open(path.into_path().unwrap()).map_err(|_| "Selected file does not exist")?;

    parse_mods_from_csv(file)
}

fn parse_mods_from_csv(file: File) -> Result<Option<Vec<MoMod>>, String> {
    let mut csv_reader = csv::Reader::from_reader(file);
    let mut mo_mods: Vec<MoMod> = Vec::new();

    for result in csv_reader.deserialize::<MoMod>() {
        let mo_mod = result.map_err(|_: csv::Error| "The file is missing required columns")?;
        mo_mods.push(mo_mod);
    }

    Ok(Some(mo_mods))
}
