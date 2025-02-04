use anchor_lang::prelude::*;
use crate::errors::*;
use crate::state::competition::*;
use crate::state::meme::*;
use crate::state::donator::*;

/**
 * Donate SOL to prize_pool
 */
pub fn donate_sol(ctx: Context<DonateSol>, amount: u64) -> Result<()> {
    msg!("Greetings from: {:?}", ctx.program_id);
    let competition: &mut Account<'_, Competition> = &mut ctx.accounts.competition;
    let now = Clock::get()?.unix_timestamp;

    // Check if donation period is still active
    require!(now <= competition.donation_end_time, CustomError::DonationPeriodEnded);
    require!(competition.start_time == 0, CustomError::CompetitionAlreadyStarted);

    let from: &Signer<'_> = &ctx.accounts.user;
    let to: &AccountInfo<'_> = &ctx.accounts.to;

    msg!("Signer sol balance {:?}", from.lamports());
    require!(from.lamports() > amount, CustomError::InsufficientLamports);

    let cpi_accounts: anchor_lang::system_program::Transfer<'_> = anchor_lang::system_program::Transfer {
        from: from.to_account_info(),
        to: to.to_account_info(),
    };

    let cpi_program: AccountInfo<'_> = ctx.accounts.system_program.to_account_info();
    let cpi_ctx: CpiContext<'_, '_, '_, '_, anchor_lang::system_program::Transfer<'_>> = CpiContext::new(cpi_program, cpi_accounts);
    anchor_lang::system_program::transfer(cpi_ctx, amount)?;

    // increase total_sol_amount
    competition.prize_pool_data.total_sol_amount += amount;
    // push donation info
    let donator: Donator = Donator {
        donator: from.key(),
        sol_amount: amount,
        usdc_amount: 0,
        donation_time: now
    };
    competition.prize_pool_data.donators.push(donator);

    // If prize pool value exceeds $100, start the competition
    if competition.prize_pool_data.total_sol_amount >= 100_000_000 {
        // Assuming 1 SOL = $1 and using lamports
        competition.donation_end_time = now;
        competition.start_time = now;
        // comp.end_time = now + 30 * 24 * 60 * 60;
        competition.end_time = now + 10; // 10 second for test
    }

    Ok(())
}

#[derive(Accounts)]
pub struct DonateSol<'info> {
    #[account(
        mut,
        seeds = [b"comp", token_address.key().as_ref()],
        bump
    )]
    pub competition: Box<Account<'info, Competition>>,

    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK: checked account is safe. no need to validate.
    #[account(mut)]
    pub to: AccountInfo<'info>,

    pub system_program: Program<'info, System>,

    #[account(
        mut,
        seeds = [b"prize_pool", token_address.key().as_ref()],
        bump
    )]
    pub prize_pool: SystemAccount<'info>,
    /// CHECK: safe address. no need to validate.
    pub token_address: AccountInfo<'info>,
}
