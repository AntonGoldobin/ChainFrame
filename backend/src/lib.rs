use std::{cell::RefCell, collections::BTreeMap};

use candid::CandidType;
use serde::{Deserialize, Serialize};

type FrameStore = BTreeMap<usize, Frame>;

thread_local! {
    pub static STATE: RefCell<FrameStore> = {
        let mut map = FrameStore::new();
        map.insert(0, Frame {
            id: 0,
            image_url: Some("https://getwallpapers.com/wallpaper/full/9/f/6/1498888-free-download-china-desktop-wallpaper-1920x1200-for-ipad-2.jpg".into()),
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            children_ids: None,
        });
        RefCell::new(map)
    };
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct Frame {
    id: usize,
    image_url: Option<String>,
    top: u32,
    left: u32,
    width: u32,
    height: u32,
    children_ids: Option<Vec<usize>>,
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
pub fn insert_frame(frame: InsertFrame) -> usize {
    let id = STATE.with(|state| state.borrow().len().wrapping_add(1));
    STATE.with(|state| {
        state.borrow_mut().insert(
            id,
            Frame {
                id,
                image_url: None,
                top: frame.top,
                left: frame.left,
                width: frame.width,
                height: frame.height,
                children_ids: None,
            },
        )
    });
    id
}

#[ic_cdk::query]
pub fn get_frame_by_id(id: usize) -> Option<Frame> {
    STATE.with(|state| state.borrow().get(&id).cloned())
}

#[derive(CandidType, Deserialize)]
pub struct FrameWithOptionalFields {
    image_url: Option<String>,
    top: Option<u32>,
    left: Option<u32>,
    width: Option<u32>,
    height: Option<u32>,
    children_ids: Option<Vec<usize>>,
}

#[ic_cdk::update]
pub fn update_fields_in_frame_by_id(
    id: usize,
    frame_with_optional_fields: FrameWithOptionalFields,
) {
    STATE.with(|state| {
        state.borrow_mut().entry(id).and_modify(|frame| {
            frame.image_url = frame_with_optional_fields.image_url;
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
pub fn delete_frame_by_id(id: usize) {
    STATE.with(|state| {
        state.borrow_mut().remove(&id);
    })
}
