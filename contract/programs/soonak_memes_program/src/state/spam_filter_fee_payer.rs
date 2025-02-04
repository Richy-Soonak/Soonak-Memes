use anchor_lang::prelude::*;

#[account]
pub struct SpamFilterFeePayer {
    pub token : Pubkey,
    pub payer : Pubkey,
    pub paid_time: i64,
    pub paid : bool,
}