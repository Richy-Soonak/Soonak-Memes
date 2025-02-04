use anchor_lang::prelude::*;

#[account]
pub struct Donator {
    pub donator: Pubkey,
    pub usdc_amount: u64,
    pub sol_amount: u64,
    pub donation_time: i64
}