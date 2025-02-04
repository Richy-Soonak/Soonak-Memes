use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint};
use crate::state::competition::*;
use crate::state::donator::*;
use crate::errors::*;
use crate::constants::{USDC_ADDRESS};
/**
 * Donate USDC to prize_pool
 */
pub fn donate_usdc(ctx: Context<DonateUSDC>, amount: u64) -> Result<()> {
    msg!("Greetings from: {:?}", ctx.program_id);
    let competition: &mut Account<'_, Competition> = &mut ctx.accounts.competition;
    let now = Clock::get()?.unix_timestamp;

    let from_token_account = &ctx.accounts.from_token_account;
    let to_token_account = &ctx.accounts.to_token_account;

    // check if user has enough USDC
    require!(from_token_account.amount >= amount, CustomError::InsufficientUsdc);

    // Check if donation period is still active
    require!(now <= competition.donation_end_time, CustomError::DonationPeriodEnded);
    require!(competition.start_time == 0, CustomError::CompetitionAlreadyStarted);

    let cpi_accounts: anchor_spl::token::Transfer<'_> = anchor_spl::token::Transfer {
        from: from_token_account.to_account_info(),
        to: to_token_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };

    let cpi_program: AccountInfo<'_> = ctx.accounts.token_program.to_account_info();
    let cpi_ctx: CpiContext<'_, '_, '_, '_, anchor_spl::token::Transfer<'_>> = CpiContext::new(
        cpi_program,
        cpi_accounts
    );
    anchor_spl::token::transfer(cpi_ctx, amount)?;

    // increase total usdc amount
    competition.prize_pool_data.total_usdc_amount += amount;
    // push donation info
    let donator: Donator = Donator {
        donator: from_token_account.owner,
        sol_amount: 0,
        usdc_amount: amount,
        donation_time: now,
    };
    competition.prize_pool_data.donators.push(donator);

    // If prize pool value exceeds $100, start the competition
    if competition.prize_pool_data.total_usdc_amount >= 100_000_000 {
        // Assuming 1 token = $1 and using smallest units
        competition.donation_end_time = now;
        competition.start_time = now;
        competition.end_time = now + 10; // 10 second for test
        // comp.end_time = now + 30 * 24 * 60 * 60;
    }
    Ok(())
}

#[derive(Accounts)]
/// Accounts for the DonateUSDC instruction.
///
/// This struct defines the accounts required for the DonateUSDC instruction, which allows users to donate USDC tokens to a competition's prize pool.
///
/// - `competition`: The competition account that the USDC tokens will be donated to.
/// - `from_token_account`: The user's token account that the USDC tokens will be transferred from.
/// - `to_token_account`: The token account that the USDC tokens will be transferred to, which is the competition's prize pool.
/// - `token_program`: The Token program account.
/// - `user`: The signer account of the user making the donation.
/// - `prize_pool`: The prize pool account that the USDC tokens will be deposited into.
/// - `token_mint`: The address of the USDC token mint.
pub struct DonateUSDC<'info> {
    #[account(mut)]
    pub competition: Account<'info, Competition>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = from_token_account.owner == user.key(),
        constraint = from_token_account.mint == USDC_ADDRESS,
    )]
    pub from_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = to_token_account.owner == prize_pool.key(),
        constraint = to_token_account.mint == USDC_ADDRESS
    )]
    pub to_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,

    #[account(
        mut,
        seeds = [b"prize_pool", token_address.key().as_ref()],
        bump
    )]
    pub prize_pool: SystemAccount<'info>,

    /// CHECK: safe address. no need to validate.
    pub token_address: AccountInfo<'info>,
    /// CHECK: safe address. no need to validate.
    #[account(mut, constraint = token_mint.key() == USDC_ADDRESS)]
    pub token_mint: Account<'info, Mint>,
}
