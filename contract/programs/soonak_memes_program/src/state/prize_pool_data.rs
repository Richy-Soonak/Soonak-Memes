use anchor_lang::prelude::*;
use crate::donator::*;

#[account]
pub struct PrizePoolData {
    pub total_usdc_amount: u64,
    pub total_sol_amount: u64,
    pub donators: Vec<Donator>
}
