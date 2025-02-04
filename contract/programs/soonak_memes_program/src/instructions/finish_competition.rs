use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

use crate::errors::*;
use crate::Competition; 
/**
 * Finish competition
 */
pub fn finish_competition<'info>(
    ctx: Context<'_, '_, 'info, 'info, FinishCompetition<'info>>
) -> Result<()> {
    msg!("Greatings from Finish Comp: {:?}", ctx.program_id);
    let competition: &mut Account<'info, Competition> = &mut ctx.accounts.competition;
    let prize_pool: &SystemAccount<'info> = &ctx.accounts.prize_pool;
    let now = Clock::get()?.unix_timestamp;

    // Check if competition period has ended
    require!(now > competition.end_time, CustomError::CompetitionNotEnded);
    require!(!competition.is_finished, CustomError::CompetitionAlreadyFinished);

    // // Sort memes by votes in descending order
    // let mut memes: Vec<Meme> = competition.memes.clone();
    // for meme in &mut memes {
    //     meme.votes = meme.voters
    //         .iter()
    //         .map(|voter: &Voter| voter.power * (voter.token_holdings as i64))
    //         .sum();
    // }
    // memes.sort_by(|a: &Meme, b: &Meme| b.votes.cmp(&a.votes));

    // Calculate prize distribution
    let total_prize: u64 = competition.prize_pool_data.total_usdc_amount;
    let dao_share: u64 = ((total_prize as f64) * 0.1) as u64; // 10% for DAO
    let winners_share: u64 = total_prize - dao_share; // 90% for winners

    // SOL Share Logic
    let total_sol_prize: u64 = competition.prize_pool_data.total_sol_amount;
    let dao_sol_share: u64 = ((total_sol_prize as f64) * 0.1) as u64; // 10% for DAO
    let winners_sol_share: u64 = total_sol_prize - dao_sol_share; // 90% for winners

    // Create seeds for PDA signing
    let token_key: Pubkey = ctx.accounts.token_address.key();
    let seeds: &[&[u8]; 3] = &[b"prize_pool", token_key.as_ref(), &[ctx.bumps.prize_pool]];
    let signer: &[&[&[u8]]; 1] = &[&seeds[..]];

    

    // Transfer DAO share
    if total_prize != 0 {
        let prize_token_account_info: AccountInfo<'_> =
            ctx.accounts.prize_token_account.to_account_info(); // Store account info in a variable
        let cpi_accounts: anchor_spl::token::Transfer<'_> = anchor_spl::token::Transfer {
            from: prize_token_account_info.clone(),
            to: ctx.accounts.dao_token_account.to_account_info(),
            authority: prize_pool.to_account_info(), // Ensure this is accessed within its scope
        };
        let cpi_program: AccountInfo<'_> = ctx.accounts.token_program.to_account_info();
        let cpi_ctx: CpiContext<
            '_,
            '_,
            '_,
            '_,
            anchor_spl::token::Transfer<'_>
        > = CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts, signer);
        anchor_spl::token::transfer(cpi_ctx, dao_share)?;
    }

    if total_sol_prize != 0 {
        let prize_pool_info: AccountInfo<'_> = ctx.accounts.prize_pool.to_account_info(); // Store account info in a variable
        let cpi_accounts: anchor_lang::system_program::Transfer<'_> = anchor_lang::system_program::Transfer {
            from: prize_pool_info.clone(),
            to: ctx.accounts.dao_account.to_account_info(),
        };
        let cpi_program: AccountInfo<'_> = ctx.accounts.system_program.to_account_info();
        let cpi_ctx: CpiContext<
            '_,
            '_,
            '_,
            '_,
            anchor_lang::system_program::Transfer<'_>
        > = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        anchor_lang::system_program::transfer(cpi_ctx, dao_sol_share)?;
    }

    // Distribute prizes to winners using remaining_accounts
    let winner_count: usize = std::cmp::min(5, ctx.remaining_accounts.len());
    msg!("Winner count: {:?}", winner_count);

    let prize_distribution: [f64; 5] = [
        36.0, // 1st place
        22.5, // 2nd place
        13.5, // 3rd place
        10.0, // 4th place
        8.0, // 5th place
    ];

    for i in 0..winner_count {
        // let winner_pubkey: Pubkey = memes[i].submitter;
        let winner_account_info: &AccountInfo<'info> = &ctx.remaining_accounts[i]; // Updated to use the new lifetime

        // Verify the winner account
        require!(
            winner_account_info.owner == &anchor_spl::token::ID,
            CustomError::InvalidWinnerAccount
        );

        // Deserialize and validate winner's token account
        let winner_token_account: Account<'info, TokenAccount> = Account::try_from(
            &winner_account_info
        ) // Use to_account_info() instead of dereferencing
            .map_err(|_| CustomError::InvalidWinnerAccount)?; // Added semicolon here

        if total_prize != 0 {
            // Calculate prize amount based on percentage
            let prize_amount: u64 = (((total_prize as f64) * prize_distribution[i]) / 100.0) as u64;
            msg!("Prize amount: {:?}", prize_amount);

            // Transfer prize to winner
            {
                let prize_token_account_info: AccountInfo<'_> =
                    ctx.accounts.prize_token_account.to_account_info(); // Store account info in a variable
                let prize_pool_info: AccountInfo<'_> = prize_pool.to_account_info(); // Store account info in a variable

                // Ensure we are not holding onto mutable references longer than necessary
                let cpi_accounts: anchor_spl::token::Transfer<'_> = anchor_spl::token::Transfer {
                    from: prize_token_account_info.clone(),
                    to: winner_account_info.clone(),
                    authority: prize_pool_info,
                };
                let cpi_program: AccountInfo<'_> = ctx.accounts.token_program.to_account_info();
                let cpi_ctx: CpiContext<
                    '_,
                    '_,
                    '_,
                    '_,
                    anchor_spl::token::Transfer<'_>
                > = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
                anchor_spl::token::transfer(cpi_ctx, prize_amount)?;
                msg!("Winner prize transferred: {:?}", prize_amount);
            }
        }

        if total_sol_prize != 0 {
            // Calculate prize amount based on percentage
            let prize_sol_amount: u64 = (((total_sol_prize as f64) * prize_distribution[i]) /
                100.0) as u64;
            msg!("SOL prize amount: {:?}", prize_sol_amount);

            // Transfer prize to winner
            {
                let prize_pool_info: AccountInfo<'_> = prize_pool.to_account_info(); // Store account info in a variable

                // Ensure we are not holding onto mutable references longer than necessary
                let cpi_accounts: anchor_lang::system_program::Transfer<'_> = anchor_lang::system_program::Transfer {
                    from: prize_pool_info.clone(),
                    to: winner_account_info.clone(),
                    // authority: prize_pool_info,
                };
                let cpi_program: AccountInfo<'_> = ctx.accounts.system_program.to_account_info();
                let cpi_ctx: CpiContext<
                    '_,
                    '_,
                    '_,
                    '_,
                    anchor_lang::system_program::Transfer<'_>
                > = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
                anchor_lang::system_program::transfer(cpi_ctx, prize_sol_amount)?;
                msg!("Winner SOL prize transferred: {:?}", prize_sol_amount);
            }
        }
    }

    competition.is_finished = true;
    Ok(())
}

#[derive(Accounts)]
pub struct FinishCompetition<'info> {
    #[account(
        mut,
        seeds = [b"comp", token_address.key().as_ref()],
        bump
    )]
    pub competition: Account<'info, Competition>,

    #[account(
        mut,
        seeds = [b"prize_pool", token_address.key().as_ref()],
        bump
    )]
    pub prize_pool: SystemAccount<'info>,

    #[account(mut)]
    pub prize_token_account: Account<'info, TokenAccount>,

    /// CHECK: safe address. no need to validate.
    #[account(mut)]
    pub dao_account: UncheckedAccount<'info>,

    #[account(mut)]
    pub dao_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,

    /// CHECK: safe address. no need to validate.
    pub token_address: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}
