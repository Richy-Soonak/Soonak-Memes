use anchor_lang::prelude::*;
use crate::state::meme::*;
use crate::state::competition::*;
use anchor_spl::token::Mint;

/**
 * Submit a meme to the competition
 */
pub fn submit_meme(
    ctx: Context<SubmitMeme>,
    meme_id: u64,
    url: String,
) -> Result<()> {
    msg!("Greetings from: {:?}", ctx.program_id);
    let competition: &mut Account<'_, Competition> = &mut ctx.accounts.competition;
    let _submitter: &AccountInfo<'_> = &ctx.accounts.user.to_account_info();
    let meme = &mut ctx.accounts.meme;
    meme.url = url;
    meme.meme_id = meme_id;
    meme.submitter = _submitter.key();
    competition.meme_vote_weights.push(0);
    msg!("Meme list: {:?}", competition.meme_vote_weights);
    Ok(())
}

#[derive(Accounts)]
#[instruction(meme_id: u64)]
pub struct SubmitMeme<'info> {
    #[account(
        mut,
        seeds = [b"comp".as_ref(), token_address.key().as_ref()],
        bump
    )]
    pub competition: Account<'info, Competition>,
    #[account(
        init_if_needed,
        space = 1024 + 8,
        payer = user,
        seeds = [b"meme".as_ref(), token_address.key().as_ref(), meme_id.to_le_bytes().as_ref()],
        bump
    )]
    pub meme: Box<Account<'info, Meme>>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub token_address: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}
