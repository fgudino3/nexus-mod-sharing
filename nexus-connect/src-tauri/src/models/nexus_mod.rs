use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct NexusMod {
    #[serde(rename(deserialize = "mod_id"))]
    pub id: u32,
    #[serde(rename(deserialize = "summary"))]
    pub description: Option<String>,
    #[serde(rename(serialize = "imageUrl"))]
    pub picture_url: Option<String>,
    pub author: Option<String>,
    pub available: bool,
}
