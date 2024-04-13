use std::str::FromStr;

use serde::{Deserialize, Serialize};

pub type Bytes = [u8; 16];

const HEX_TABLE: [u8; 256] = {
    let mut hex = [0; 256];
    let mut index: u8 = 0;

    loop {
        hex[index as usize] = match index {
            b'0'..=b'9' => index - b'0',
            b'a'..=b'f' => index - b'a' + 10,
            b'A'..=b'F' => index - b'A' + 10,
            _ => 0xff,
        };

        if index == 255 {
            break hex;
        }

        index += 1
    }
};

const SHL4_TABLE: [u8; 256] = {
    let mut shl4 = [0; 256];
    let mut index: u8 = 0;

    loop {
        shl4[index as usize] = index.wrapping_shl(4);

        if index == 255 {
            break shl4;
        }

        index += 1;
    }
};

const LOWER: [u8; 16] = [
    b'0', b'1', b'2', b'3', b'4', b'5', b'6', b'7', b'8', b'9', b'a', b'b', b'c', b'd', b'e', b'f',
];

#[derive(Debug)]
pub enum Error {
    InvalidUUID,
}

const RANDOM: u8 = 4;

/// RFC4122 UUID v4, RANDOM version
#[derive(Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord, Clone, Copy)]
pub struct Uuid(Bytes);

impl Uuid {
    pub fn new() -> Self {
        let mut bytes: Bytes = rand::random();
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        bytes[6] = (bytes[6] & 0x0f) | ((RANDOM as u8) << 4);
        Self(bytes)
    }
}

impl std::fmt::Display for Uuid {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let src = self.0;
        let mut dst = [0u8; 32];
        for index in 0..16usize {
            let element = src[index];
            dst[index.wrapping_mul(2)] = LOWER[(element >> 4) as usize];
            dst[index.wrapping_mul(2).wrapping_add(1)] = LOWER[(element & 0x0f) as usize]
        }
        write!(f, "{}", dst.map(char::from).into_iter().collect::<String>())
    }
}

impl FromStr for Uuid {
    type Err = Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let bytes = s.as_bytes();

        if bytes.len() != 36 {
            return Err(Error::InvalidUUID);
        }
        match [bytes[8], bytes[13], bytes[18], bytes[23]] {
            [b'-', b'-', b'-', b'-'] => (),
            _ => return Err(Error::InvalidUUID),
        }
    
        const POSITIONS: [u8; 8] = [0, 4, 9, 14, 19, 24, 28, 32];
        let mut buffer: [u8; 16] = [0; 16];

        for iter in 0..8 {
            let index = POSITIONS[iter];

            let h1 = HEX_TABLE[bytes[index as usize] as usize];
            let h2 = HEX_TABLE[bytes[(index + 1) as usize] as usize];
            let h3 = HEX_TABLE[bytes[(index + 2) as usize] as usize];
            let h4 = HEX_TABLE[bytes[(index + 3) as usize] as usize];
    
            if h1 | h2 | h3 | h4 == 0xff {
                return Err(Error::InvalidUUID);
            }
    
            buffer[iter * 2] = SHL4_TABLE[h1 as usize] | h2;
            buffer[iter * 2 + 1] = SHL4_TABLE[h3 as usize] | h4;
        }
    
        Ok(Self(buffer))
    }
}