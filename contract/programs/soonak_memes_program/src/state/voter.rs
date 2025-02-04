use anchor_lang::prelude::*;
use std::mem::size_of;

#[account]
#[derive(Debug, Default)]
pub struct Voter {
    pub voter: Pubkey,
    pub token_holdings: u64,
    pub power: i64,
    pub vote_date: i64,
}
