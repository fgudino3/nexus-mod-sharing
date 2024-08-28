use serde::{Deserialize, Serialize};

use super::NcMod;

#[derive(Clone, Serialize, Deserialize)]
pub struct ListenPayload {
    pub apikey: String,
    #[serde(rename(deserialize = "nexusModUrls"))]
    pub nexus_mod_urls: Vec<String>,
    #[serde(rename(deserialize = "nexusMods"))]
    pub nexus_mods: Vec<NcMod>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct EmitPayload {
    #[serde(rename(serialize = "mods"))]
    pub nc_mods: Vec<NcMod>,
}
