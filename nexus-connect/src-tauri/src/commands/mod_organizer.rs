use crate::models::MoMod;
use std::{fs::File, path::PathBuf};
use tauri::api::dialog::blocking::FileDialogBuilder;

extern crate csv;

#[tauri::command]
pub async fn select_mo_csv_file() -> Result<Option<Vec<MoMod>>, String> {
    let file_path = FileDialogBuilder::new()
        .add_filter("CSV", &["csv", "txt"])
        .pick_file();

    match file_path {
        Some(path) => get_mods_from_csv(path),
        _ => Ok(None),
    }
}

fn get_mods_from_csv(path: PathBuf) -> Result<Option<Vec<MoMod>>, String> {
    let file = File::open(path).map_err(|_| "Selected file does not exist")?;

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
