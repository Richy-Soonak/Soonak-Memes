use anchor_lang::prelude::*;

use crate::state::competition::*;
use crate::errors::*;
// use crate::state::meme::Meme;

/**
 * Create competition
 */
pub fn create_competition(ctx: Context<CreateCompetition>) -> Result<()> {
    msg!("Greetings from Create Competition: {:?}", ctx.program_id);
    let competition: &mut Account<'_, Competition> = &mut ctx.accounts.competition;
    let spam_filter_fee_payer = &competition.spam_filter_fee_payer;
    let now = Clock::get()?.unix_timestamp;
    // Check if a competition already exists for the token
    require!(competition.create_time == 0, CustomError::CompetitionAlreadyExists);
    require!(spam_filter_fee_payer.paid == true, CustomError::SpamFilterFeeNotPaid);
    require!(
        spam_filter_fee_payer.payer == ctx.accounts.user.key(),
        CustomError::InvalidSpamFilterFeePayer
    );
    // let round: Round = chainlink::latest_round_data(
    //     ctx.accounts.chainlink_program.to_account_info(),
    //     ctx.accounts.chainlink_feed.to_account_info(),
    // )?;

    // let description: String = chainlink::description(
    //     ctx.accounts.chainlink_program.to_account_info(),
    //     ctx.accounts.chainlink_feed.to_account_info(),
    // )?;

    // let decimals: u8 = chainlink::decimals(
    //     ctx.accounts.chainlink_program.to_account_info(),
    //     ctx.accounts.chainlink_feed.to_account_info())?;

    // let decimal: &mut Account<Decimal> = &mut ctx.accounts.decimal;
    // decimal.value = round.answer;
    // decimal.decimals = u32::from(decimals);

    // let decimal_print: Decimal = Decimal::new(round.answer, u32::from(decimals));
    // msg!("{} price is {}", description, decimal_print);
    competition.create_time = now;
    competition.donation_end_time = now + 30 * 24 * 60 * 60; // 30 days donation period
    competition.start_time = 0;
    competition.end_time = 0;
    competition.is_finished = false;
    Ok(())
}


#[derive(Accounts)]
pub struct CreateCompetition<'info> {
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 3249,
        seeds = [b"comp", token_address.key().as_ref()],
        bump
    )]
    pub competition: Box<Account<'info, Competition>>,

    // #[account(
    //     init_if_needed,
    //     seeds = [b"meme", token_address.key().as_ref()],
    //     bump,
    //     space = 8 + std::mem::size_of::<Meme>() * 100,
    //     payer = user,
    // )]
    // pub meme: Box<Account<'info, Meme>>,

    #[account(
        mut,
        seeds = [b"prize_pool", token_address.key().as_ref()],
        bump
    )]
    pub prize_pool: SystemAccount<'info>,

    // /// CHECK: safe address. no need to validate.
    // #[account(mut, constraint = token_mint.key() == USDC_ADDRESS)]
    // pub token_mint: AccountInfo<'info>,

    #[account(mut)]
    pub user: Signer<'info>,

    // #[account(
    //     init,
    //     payer = user,
    //     space = 100,
    // )]
    // pub decimal: Account<'info, Decimal>,

    // /// CHECK: We're reading data from this specified chainlink feed
    // pub chainlink_feed: AccountInfo<'info>,
    // /// CHECK: This is the Chainlink program library on Devnet
    // pub chainlink_program: AccountInfo<'info>,
    /// CHECK: This is the devnet system program
    pub system_program: Program<'info, System>,
    /// CHECK: safe address. no need to validate.
    pub token_address: AccountInfo<'info>,
}