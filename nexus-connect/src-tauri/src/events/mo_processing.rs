use crate::models::{
    payloads::{EmitPayload, ListenPayload},
    NcMod, NexusMod,
};
use futures::{stream, StreamExt};
use reqwest;
use tauri::{async_runtime, AppHandle, Manager};

pub async fn handle_mo_mod_processing(
    handle: &AppHandle,
    payload: ListenPayload,
) -> Result<(), Box<(dyn std::error::Error + 'static)>> {
    println!("handle_mo_mod_processing");
    let app_handler = handle.clone();
    let mods_len = payload.nexus_mod_urls.len();
    let mut nc_mods = payload.nexus_mods;
    let req_client = reqwest::Client::new().clone();

    let buffers = stream::iter(payload.nexus_mod_urls)
        .map(|mod_url| {
            let client = req_client.clone();
            let apikey = payload.apikey.clone();

            async_runtime::spawn(async move {
                client
                    .get(mod_url)
                    .header("apikey", apikey)
                    .send()
                    .await?
                    .json::<NexusMod>()
                    .await
            })
        })
        .buffer_unordered(mods_len);

    let results = buffers
        .collect::<Vec<_>>()
        .await
        .iter()
        .map(|b| match b {
            Ok(buf_res) => match buf_res {
                Ok(nexus_mod) => {
                    let nc_mod = nc_mods.iter_mut().find(|nc_mod| nc_mod.id == nexus_mod.id);

                    match nc_mod {
                        Some(m) => {
                            m.author = Some(nexus_mod.author.clone());
                            m.image_url = Some(nexus_mod.picture_url.clone());
                            m.description = Some(nexus_mod.description.clone());

                            m.clone()
                        }
                        _ => panic!("Mod does not exist"),
                    }
                }
                Err(_) => panic!("Error getting mod"),
            },
            Err(_) => panic!("Error collecting buffers"),
        })
        .collect::<Vec<NcMod>>();

    let _result = app_handler.emit_to("main", "mods_processed", EmitPayload { nc_mods: results });

    Ok(())
}
