use std::fs::File;

use serde::{Deserialize, Serialize};
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
pub async fn select_mo_csv_file() -> Result<Vec<MoMod>, String> {
    let file_path = FileDialogBuilder::new()
        .add_filter("CSV", &["csv"])
        .pick_file();
    let mut mo_mods: Vec<MoMod> = Vec::new();

    if let Some(path) = file_path {
        let file = File::open(path);

        return match file {
            Ok(f) => {
                let mut csv_reader = csv::Reader::from_reader(f);

                for line in csv_reader.deserialize::<MoMod>() {
                    match line {
                        Ok(mo_mod) => {
                            mo_mods.push(mo_mod);
                        }
                        Err(e) => return Err(e.to_string()),
                    }
                }

                Ok(mo_mods)
            }
            _ => Err("Selected file does not exist".to_string()),
        };
    }

    Ok(mo_mods)
}
