use std::{cell::RefCell, collections::BTreeMap};

use candid::CandidType;
use serde::{Deserialize, Serialize};

type FrameStore = BTreeMap<usize, Frame>;

thread_local! {
    pub static STATE: RefCell<FrameStore> = RefCell::default();
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct Frame {
    id: usize,
    image_url: String,
    top: usize,
    left: usize,
    width: usize,
    height: usize,
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

#[ic_cdk::update]
pub fn insert_frame(frame: Frame) -> usize {
    let id = STATE.with(|state| state.borrow().len()).wrapping_add(1);
    STATE.with(|state| state.borrow_mut().insert(id, frame));
    id
}

#[ic_cdk::query]
pub fn get_frame_by_id(id: usize) -> Option<Frame> {
    STATE.with(|state| state.borrow().get(&id).cloned())
}

#[derive(CandidType, Deserialize)]
pub struct FrameWithOptionalFields {
    image_url: Option<String>,
    top: Option<usize>,
    left: Option<usize>,
    width: Option<usize>,
    height: Option<usize>,
    children_ids: Option<Vec<usize>>,
}

#[ic_cdk::update]
pub fn update_fields_in_frame_by_id(id: usize, frame_with_optional_fields: FrameWithOptionalFields) {
    STATE.with(|state| {
        state.borrow_mut().entry(id).and_modify(|frame| {
            if let Some(image_url) = frame_with_optional_fields.image_url {
                frame.image_url = image_url
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
pub fn delete_frame_by_id(id: usize) {
    STATE.with(|state| {
        state.borrow_mut().remove(&id);
    })
}
