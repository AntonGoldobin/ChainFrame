use std::cell::RefCell;
use std::vec::Vec;

use candid::{CandidType, Deserialize};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query, update};
use ic_stable_memory::{
    derive::{CandidAsDynSizeBytes, StableType},
    retrieve_custom_data, stable_memory_init, stable_memory_post_upgrade,
    stable_memory_pre_upgrade, store_custom_data, SBox,
};
// Структура для представления кадров
#[derive(CandidType, Deserialize, StableType, CandidAsDynSizeBytes, Debug, Clone)]
struct Frame {
    id: u32,
    // Добавьте другие поля, если необходимо
}

// Структура для состояния
#[derive(CandidType, Deserialize, StableType, CandidAsDynSizeBytes, Debug, Clone)]
struct State {
    counter: u32,
    frames: Vec<u8>, // Новое поле frames
}

impl Default for State {
    fn default() -> Self {
        State { counter: 0, frames: Vec::new() }
    }
}

thread_local! {
    static STATE: RefCell<Option<State>> = RefCell::default();
}

#[init]
fn init() {
    stable_memory_init();

    STATE.with(|s| {
        *s.borrow_mut() = Some(State::default());
    });
}

#[pre_upgrade]
fn pre_upgrade() {
    let state = STATE.with(|s| s.borrow_mut().take().unwrap());
    let boxed_state = SBox::new(state).expect("Out of memory");

    store_custom_data::<State>(0, boxed_state);
    stable_memory_pre_upgrade().expect("Out of memory");
}

#[post_upgrade]
fn post_upgrade() {
    stable_memory_post_upgrade();

    let state = retrieve_custom_data::<State>(0).unwrap().into_inner();
    STATE.with(|s: &RefCell<Option<State>>| {
        *s.borrow_mut() = Some(state);
    });
}

#[query]
fn get() -> u32 {
    STATE.with(|s: &RefCell<Option<State>>| s.borrow().as_ref().unwrap().counter)
}

#[update]
fn inc() {
    STATE.with(|s: &RefCell<Option<State>>| s.borrow_mut().as_mut().unwrap().counter += 1)
}

#[update]
fn set(value: u32) {
    STATE.with(|s: &RefCell<Option<State>>| s.borrow_mut().as_mut().unwrap().counter = value)
}

//// Функция запроса для получения списка всех кадров
//#[query]
//fn get_all_frames() -> Vec<Frame> {
//    STATE.with(|s: &RefCell<Option<State>>| {
//        s.borrow().as_ref().unwrap().frames.clone()
//    })
//}

//// Функция запроса для получения кадра по идентификатору
//#[query]
//fn get_frame_by_id(id: u32) -> Option<Frame> {
//    STATE.with(|s: &RefCell<Option<State>>| {
//        s.borrow()
//            .as_ref()
//            .and_then(|state| state.frames.iter().find(|frame| frame.id == id).cloned())
//    })
//}

//// Функция обновления для обновления кадра по идентификатору
//#[update]
//fn update_frame(id: u32, new_frame: Frame) {
//    STATE.with(|s: &RefCell<Option<State>>| {
//        if let Some(state) = s.borrow_mut().as_mut() {
//            if let Some(frame) = state.frames.iter_mut().find(|frame| frame.id == id) {
//                *frame = new_frame;
//            }
//        }
//    })
//}