use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};
use crate::state::voter::*;
use crate::Meme;
use crate::Competition;
use crate::errors::*;

/**
 * Vote for a specific meme of competition
 */
pub fn vote_meme(ctx: Context<VoteMeme>, meme_id: u64, power: i64) -> Result<()> {
    msg!("Greetings from: {:?}", ctx.program_id);
    let competition: &mut Account<'_, Competition> = &mut ctx.accounts.competition;
    let voter: &Signer<'_> = &ctx.accounts.user;
    let token_account: &Account<'_, TokenAccount> = &ctx.accounts.voter_token_account;
    let meme = &mut ctx.accounts.meme;

    // Check if competition is active
    let current_time: i64 = Clock::get()?.unix_timestamp;
    require!(current_time >= competition.start_time, CustomError::CompetitionNotStarted);
    require!(current_time <= competition.end_time, CustomError::CompetitionEnded);

    
    // Check if meme index is valid
    require!(meme_id < competition.meme_vote_weights.len() as u64, CustomError::InvalidMemeIndex);

    let voter_key: Pubkey = voter.key();

    require!(!meme.voters.iter().any(|v| v.voter == voter_key), CustomError::AlreadyVoted);

    let voter = Voter {
        voter: voter_key,
        token_holdings: token_account.amount,
        power,
        vote_date: current_time,
    };
    meme.voters.push(voter);
    let vote_weight = token_account.amount as i64 * power / 100;
    competition.meme_vote_weights[meme_id as usize] += vote_weight;

    Ok(())
}

#[derive(Accounts)]
#[instruction(meme_id: u64)]
pub struct VoteMeme<'info> {
    #[account(
        mut,
        seeds = [b"comp", token_address.key().as_ref()],
        bump
    )]
    pub competition: Account<'info, Competition>,
    #[account(
        mut,
        seeds = [b"meme", token_address.key().as_ref(), meme_id.to_le_bytes().as_ref()],
        bump
    )]
    pub meme: Account<'info, Meme>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub voter_token_account: Account<'info, TokenAccount>,
    pub token_address: Account<'info, Mint>,
}
