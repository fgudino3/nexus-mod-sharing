use serde::{Deserialize, Serialize};
use std::{fs::File, path::PathBuf};
use tauri::api::dialog::blocking::FileDialogBuilder;

extern crate csv;

#[derive(Serialize, Deserialize)]
pub struct MoMod {
    #[serde(rename(serialize = "priority", deserialize = "#Mod_Priority"))]
    mod_priority: String,
    #[serde(rename(serialize = "status", deserialize = "#Mod_Status"))]
    mod_status: String,
    #[serde(rename(serialize = "name", deserialize = "#Mod_Name"))]
    mod_name: String,
}

#[tauri::command]
pub async fn select_mo_csv_file() -> Result<Option<Vec<MoMod>>, String> {
    let file_path = FileDialogBuilder::new()
        .add_filter("CSV", &["csv"])
        .pick_file();

    match file_path {
        Some(path) => get_mods_from_csv(path),
        _ => Ok(None),
    }
}

fn get_mods_from_csv(path: PathBuf) -> Result<Option<Vec<MoMod>>, String> {
    match File::open(path) {
        Ok(file) => parse_mods_from_csv(file),
        _ => Err("Selected file does not exist".into()),
    }
}

fn parse_mods_from_csv(file: File) -> Result<Option<Vec<MoMod>>, String> {
    let mut csv_reader = csv::Reader::from_reader(file);
    let mut mo_mods: Vec<MoMod> = Vec::new();

    for result in csv_reader.deserialize::<MoMod>() {
        match result {
            Ok(mo_mod) => {
                mo_mods.push(mo_mod);
            }
            _ => return Err("The file did not have the correct structure".into()),
        }
    }

    Ok(Some(mo_mods))
}
