use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct MoMod {
    #[serde(rename(deserialize = "#Nexus_ID"))]
    id: u32,
    #[serde(rename(deserialize = "#Mod_Name"))]
    name: String,
    #[serde(rename(deserialize = "#Mod_Status"))]
    status: String,
    #[serde(rename(deserialize = "#Mod_Version"))]
    version: String,
    #[serde(rename(serialize = "pageUrl", deserialize = "#Mod_Nexus_URL"))]
    page_url: String,
}
