use std::{cell::RefCell, collections::BTreeMap};

use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

type FrameStore = BTreeMap<usize, Frame>;

thread_local! {
    pub static STATE: RefCell<FrameStore> = {
        let mut map = FrameStore::new();
        map.insert(1, Frame {
            id: 1,
            image_url: Some("https://img.freepik.com/free-photo/anime-style-house-architecture_23-2151064885.jpg?t=st=1713813753~exp=1713817353~hmac=8af8b1b1c0cc7258d68e70ba6c281573e57a90f187a80b6811a299fc6666681f&w=1380".into()),
            top: 0,
            left: 0,
            width: 500,
            height: 500,
                        owner: Principal::from_text("lzs4l-u7x56-o6h6c-56uq2-ajxbo-hok4a-cuzzz-4rc7d-7roup-buzvz-eae").expect("Could not decode the principal."),
            children_ids: None,
                        name: String::from("MAIN")
        });
        RefCell::new(map)
    };
}

#[derive(CandidType, Serialize, Deserialize, Clone, PartialEq, Debug)]
pub struct Frame {
    id: usize,
    name: String,
    image_url: Option<String>,
    top: u32,
    left: u32,
    width: u32,
    height: u32,
    owner: Principal,
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

#[derive(CandidType, Deserialize, Clone)]
pub struct InsertFrame {
    name: String,
    image_url: String,
    owner: Principal,
    parent_id: usize,
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
                image_url: Some(frame.image_url),
                top: frame.top,
                left: frame.left,
                width: frame.width,
                height: frame.height,
                owner: frame.owner,
                children_ids: None,
                name: frame.name,
            },
        )
    });
    STATE.with(|state| {
        let mut borrowed = state.borrow_mut();
        borrowed.entry(frame.parent_id).and_modify(|frame| {
            if let Some(children_ids) = frame.children_ids.as_mut() {
                children_ids.push(id)
            }
        });
    });
    id
}

#[ic_cdk::query]
pub fn get_frame_by_id(id: usize) -> Option<Frame> {
    STATE.with(|state| state.borrow().get(&id).cloned())
}

#[ic_cdk::query]
pub fn get_frames_by_owner(principal: Principal) -> Vec<Frame> {
    STATE.with(|state| {
        state
            .borrow()
            .values()
            .filter(|frame| frame.owner == principal)
            .cloned()
            .collect()
    })
}

#[derive(CandidType, Deserialize)]
pub struct FrameWithOptionalFields {
    name: Option<String>,
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
            if let Some(name) = frame_with_optional_fields.name {
                frame.name = name
            }
            if let Some(children_ids) = frame_with_optional_fields.children_ids {
                frame.children_ids = Some(children_ids)
            }
        });
    })
}

#[derive(CandidType, Deserialize)]
pub struct FrameWithNameAndImageFields {
    name: String,
    image_url: Option<String>,
}

#[ic_cdk::update]
pub fn edit_frame_by_id(id: usize, frame_with_name_and_image_fields: FrameWithNameAndImageFields) {
    STATE.with(|state| {
        state.borrow_mut().entry(id).and_modify(|frame| {
            frame.name = frame_with_name_and_image_fields.name;
            if let Some(image_url) = frame_with_name_and_image_fields.image_url {
                frame.image_url = Some(image_url)
            }
        });
    })
}

#[ic_cdk::update]
pub fn delete_frame_by_id(id: usize) {
    STATE.with(|state| {
        state.borrow_mut().remove(&id);
    })
}

#[cfg(test)]
mod tests {
    use std::sync::OnceLock;

    use candid::Principal;

    use crate::{
        delete_frame_by_id, get_frame_by_id, get_frames_by_owner, insert_frame,
        update_fields_in_frame_by_id, Frame, FrameWithOptionalFields, InsertFrame,
    };

    static INSERT_FRAME: OnceLock<InsertFrame> = OnceLock::new();

    #[test]
    fn insert_and_delete_frame() {
        INSERT_FRAME.get_or_init(|| InsertFrame {
            name: "some_name".into(),
            parent_id: 1usize,
            owner: Principal::anonymous(),
            image_url: "ya.ru/images".into(),
            top: 0,
            left: 0,
            width: 0,
            height: 0,
        });
        let id = insert_frame(INSERT_FRAME.get().cloned().unwrap());
        delete_frame_by_id(id)
    }

    #[test]
    fn insert_and_get_frame() {
        let id = insert_frame(INSERT_FRAME.get().cloned().unwrap());
        let first_frame = get_frame_by_id(id).unwrap();
        let second_frame = Frame {
            id,
            name: "some_name".into(),
            image_url: Some("ya.ru/images".into()),
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            owner: Principal::anonymous(),
            children_ids: None,
        };
        assert_eq!(first_frame, second_frame)
    }
    #[test]
    fn insert_and_update_frame() {
        let id = insert_frame(INSERT_FRAME.get().cloned().unwrap());
        update_fields_in_frame_by_id(
            id,
            FrameWithOptionalFields {
                name: Some("some_name2".into()),
                top: Some(1),
                left: Some(1),
                width: None,
                height: None,
                image_url: None,
                children_ids: None,
            },
        );
        let first_frame = get_frame_by_id(id).unwrap();
        let second_frame = Frame {
            name: "some_name2".into(),
            id,
            image_url: Some("ya.ru/images".into()),
            top: 1,
            left: 1,
            width: 0,
            height: 0,
            owner: Principal::anonymous(),
            children_ids: None,
        };
        assert_eq!(first_frame, second_frame)
    }
    #[test]
    fn insert_many_frames_and_get_by_owner() {
        let first_id = insert_frame(INSERT_FRAME.get().cloned().unwrap());
        let second_id = insert_frame(INSERT_FRAME.get().cloned().unwrap());
        let first_frames = get_frames_by_owner(Principal::anonymous());
        let second_frames = vec![
            Frame {
                id: first_id,
                name: "some_name".into(),
                image_url: Some("ya.ru/images".into()),
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                owner: Principal::anonymous(),
                children_ids: None,
            },
            Frame {
                id: second_id,
                name: "some_name".into(),
                image_url: Some("ya.ru/images".into()),
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                owner: Principal::anonymous(),
                children_ids: None,
            },
        ];
        assert_eq!(first_frames, second_frames)
    }
}
