use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NcMod {
    pub id: u32,
    pub name: String,
    pub order: String,
    #[serde(rename = "pageUrl")]
    pub page_url: String,
    pub version: String,
    pub installed: bool,
    pub available: bool,
    pub author: Option<String>,
    #[serde(rename = "imageUrl")]
    pub image_url: Option<String>,
    pub description: Option<String>,
    #[serde(rename = "fileSizeBytes")]
    pub file_size_bytes: Option<u32>,
    #[serde(rename = "isPatched")]
    pub is_patched: Option<bool>,
}
