use anchor_lang::prelude::*;
use chainlink_solana as chainlink;
use chainlink_solana::Round;

pub mod errors;
pub mod state;
pub mod instructions;
pub mod constants;

use state::*;
use instructions::*;

declare_id!("7EDBiqU3yaNHp2eUksMsmBk9zu2tYAZBo3KJna3teJr6");

#[account]
pub struct Decimal {
    pub value: i128,
    pub decimals: u32,
}

impl Decimal {
    pub fn new(value: i128, decimals: u32) -> Self {
        Decimal { value, decimals }
    }
}

impl std::fmt::Display for Decimal {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let mut scaled_val = self.value.to_string();
        if scaled_val.len() <= (self.decimals as usize) {
            scaled_val.insert_str(
                0,
                &vec!["0"; self.decimals as usize - scaled_val.len()].join("")
            );
            scaled_val.insert_str(0, "0.");
        } else {
            scaled_val.insert(scaled_val.len() - (self.decimals as usize), '.');
        }
        f.write_str(&scaled_val)
    }
}

#[program]
pub mod soonak_memes_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize::initialize(ctx)
    }

    pub fn pay_spam_filter_fee(ctx: Context<PaySpamFilterFee>) -> Result<()> {
        instructions::pay_spam_filter_fee::pay_spam_filter_fee(ctx)
    } 

    pub fn create_competition(ctx: Context<CreateCompetition>) -> Result<()> {
        instructions::create_competition::create_competition(ctx)
    }

    pub fn start_competition(ctx: Context<StartCompetition>) -> Result<()> {
        instructions::start_competition::start_competition(ctx)
    }

    pub fn donate_sol(ctx: Context<DonateSol>, amount: u64) -> Result<()> {
        instructions::donate_sol::donate_sol(ctx, amount)
    }

    pub fn donate_usdc(ctx: Context<DonateUSDC>, amount: u64) -> Result<()> {
        instructions::donate_usdc::donate_usdc(ctx, amount)
    }

    pub fn submit_meme(
        ctx: Context<SubmitMeme>,
        meme_id: u64,
        url: String,
    ) -> Result<()> {
        instructions::submit_meme::submit_meme(ctx, meme_id, url)
    }


    pub fn vote_meme(ctx: Context<VoteMeme>, meme_id: u64, power: i64) -> Result<()> {
        instructions::vote_meme::vote_meme(ctx, meme_id, power)
    }

    pub fn finish_competition<'info>(
        ctx: Context<'_, '_, 'info, 'info, FinishCompetition<'info>>
    ) -> Result<()> {
        instructions::finish_competition::finish_competition(ctx)
    }
}

