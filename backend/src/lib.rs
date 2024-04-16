use std::{cell::RefCell, collections::BTreeMap, str::FromStr};

use candid::CandidType;
use serde::{Deserialize, Serialize};

type FrameStore = BTreeMap<String, Frame>;

thread_local! {
    pub static STATE: RefCell<FrameStore> = RefCell::default();
}

pub fn generate_random_string() -> String {
    let bytes: [u8; 64] = rand::random();
    bytes.map(char::from).into_iter().collect()
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct Frame {
    uuid: String,
    image_url: Option<String>,
    top: u32,
    left: u32,
    width: u32,
    height: u32,
    children_ids: Option<Vec<String>>,
}

#[ic_cdk::pre_upgrade]
pub fn pre_upgrade() {
    let serialized_frame_store =
        serde_cbor::to_vec(&STATE.with(|state| state.borrow().clone())).unwrap_or_default();
    ic_cdk::storage::stable_save((serialized_frame_store,))
        .expect("Failed to save data to stable storage")
}

#[ic_cdk::post_upgrade]
pub fn post_upgrade() {
    let (serialized_frame_store,): (Vec<u8>,) =
        ic_cdk::storage::stable_restore().unwrap_or_default();
    let deserialized_frame_store: FrameStore =
        serde_cbor::from_slice(&serialized_frame_store).unwrap_or_default();
    STATE.with(|state| state.borrow_mut().extend(deserialized_frame_store))
}

#[derive(CandidType, Deserialize)]
pub struct InsertFrame {
    top: u32,
    left: u32,
    width: u32,
    height: u32,
}

#[ic_cdk::update]
pub fn insert_frame(frame: InsertFrame) -> String {
    let uuid = generate_random_string();
    STATE.with(|state| {
        state.borrow_mut().insert(
            uuid,
            Frame {
                uuid: uuid.clone(),
                image_url: None,
                top: frame.top,
                left: frame.left,
                width: frame.width,
                height: frame.height,
                children_ids: None,
            },
        )
    });
    uuid
}

#[ic_cdk::query]
pub fn get_frame_by_uuid(uuid: String) -> Option<Frame> {
    STATE.with(|state| state.borrow().get(&uuid).cloned())
}

#[derive(CandidType, Deserialize)]
pub struct FrameWithOptionalFields {
    image_url: Option<String>,
    top: Option<u32>,
    left: Option<u32>,
    width: Option<u32>,
    height: Option<u32>,
    children_ids: Option<Vec<String>>,
}

#[ic_cdk::update]
pub fn update_fields_in_frame_by_uuid(
    uuid: String,
    frame_with_optional_fields: FrameWithOptionalFields,
) {
    STATE.with(|state| {
        state.borrow_mut().entry(uuid).and_modify(|frame| {
            if let Some(image_url) = frame_with_optional_fields.image_url {
                frame.image_url = Some(image_url)
            }
            if let Some(top) = frame_with_optional_fields.top {
                frame.top = top
            }
            if let Some(left) = frame_with_optional_fields.left {
                frame.left = left
            }
            if let Some(width) = frame_with_optional_fields.width {
                frame.width = width
            }
            if let Some(height) = frame_with_optional_fields.height {
                frame.height = height
            }
            frame.children_ids = frame_with_optional_fields.children_ids
        });
    })
}

#[ic_cdk::update]
pub fn delete_frame_by_uuid(uuid: String) {
    STATE.with(|state| {
        state.borrow_mut().remove(&uuid);
    })
}
