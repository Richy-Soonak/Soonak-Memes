use anchor_lang::prelude::*;

use crate::state::voter::*;

#[account]
#[derive(Default)]
#[derive(Debug)]
pub struct Meme {
    pub meme_id: u64,
    pub url: String,
    pub submitter: Pubkey,
    pub voters: Vec<Voter>,
    pub votes: i64,
}