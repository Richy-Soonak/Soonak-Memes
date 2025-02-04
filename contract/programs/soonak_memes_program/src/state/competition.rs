use anchor_lang::prelude::*;

use crate::state::prize_pool_data::*;
use crate::state::spam_filter_fee_payer::*;

#[account]
pub struct Competition {
    pub create_time: i64,
    pub donation_end_time: i64,
    pub start_time: i64,
    pub end_time: i64,
    pub is_finished: bool,
    pub prize_pool_data: PrizePoolData,
    pub spam_filter_fee_payer: SpamFilterFeePayer,
    pub meme_vote_weights : Vec<i64>
}
