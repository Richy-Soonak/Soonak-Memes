use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::state::competition::*;
use crate::constants::*;
use crate::errors::*;

/**
 * Pay spam fitler fee of 10 usdc
 */

pub fn pay_spam_filter_fee(ctx: Context<PaySpamFilterFee>) -> Result<()> {
    msg!("Greetings from PaySpamFilterFee: {:?}", ctx.program_id);

    let spam_filter_fee_payer = &mut ctx.accounts.competition.spam_filter_fee_payer;

    require!(spam_filter_fee_payer.paid == false, CustomError::SpamFilterFeeAlreadyPaid);

    let now = Clock::get()?.unix_timestamp;

    let from: &mut Account<'_, TokenAccount> = &mut ctx.accounts.from_token_account;
    let to: &mut Account<'_, TokenAccount> = &mut ctx.accounts.to_token_account;

    require!(from.amount >= SPAM_FILTER_FEE_AMOUNT, CustomError::InsufficientUsdc);

    let cpi_accounts: anchor_spl::token::Transfer<'_> = anchor_spl::token::Transfer {
        from: from.to_account_info(),
        to: to.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };

    let cpi_program: AccountInfo<'_> = ctx.accounts.token_program.to_account_info();
    let cpi_ctx: CpiContext<'_, '_, '_, '_, anchor_spl::token::Transfer<'_>> = CpiContext::new(
        cpi_program,
        cpi_accounts
    );
    anchor_spl::token::transfer(cpi_ctx, SPAM_FILTER_FEE_AMOUNT)?;

    spam_filter_fee_payer.token = ctx.accounts.usdc_mint.key();
    spam_filter_fee_payer.paid_time = now;
    spam_filter_fee_payer.payer = ctx.accounts.user.key();
    spam_filter_fee_payer.paid = true;

    Ok(())
}

#[derive(Accounts)]
pub struct PaySpamFilterFee<'info> {
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 32 * 100 + 1,
        seeds = [b"comp", token_address.key().as_ref()],
        bump
    )]
    pub competition: Account<'info, Competition>,

    /// CHECK: safe address. no need to validate.
    pub token_address: AccountInfo<'info>,

    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        constraint = from_token_account.owner == user.key(),
        constraint = from_token_account.mint == USDC_ADDRESS,
    )]
    pub from_token_account : Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = to_token_account.owner == DAO_ADDRESS,
        constraint = to_token_account.mint == USDC_ADDRESS
    )]
    pub to_token_account : Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,

    #[account(mut, constraint = usdc_mint.key() == USDC_ADDRESS)]
    pub usdc_mint: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
}
