use anchor_lang::prelude::*;
// crates
use crate::state::competition::*;
use crate::errors::*;

/**
 * Start competition
 */
pub fn start_competition(ctx: Context<StartCompetition>) -> Result<()> {
    msg!("Greetings from Start Comp: {:?}", ctx.program_id);
    let competition: &mut Account<'_, Competition> = &mut ctx.accounts.competition;
    let now = Clock::get()?.unix_timestamp;

    // Check if donation period is still active
    require!(now <= competition.donation_end_time, CustomError::DonationPeriodEnded);

    competition.donation_end_time = now;
    competition.start_time = now;
    // competition.end_time = now + 30 * 24 * 60 * 60; // competition will go on for 30 days
    competition.end_time = now + 10; // competition will go on for 10 sec for test.
    Ok(())
}

#[derive(Accounts)]
pub struct StartCompetition<'info> {
    #[account(mut)]
    pub competition: Account<'info, Competition>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"prize_pool", token_address.key().as_ref()],
        bump
    )]
    pub prize_pool: SystemAccount<'info>,
    /// CHECK: safe address. no need to validate.
    pub token_address: AccountInfo<'info>,
}
