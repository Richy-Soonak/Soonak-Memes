use anchor_lang::prelude::*;

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    msg!("Greetings from Initialize: {:?}", ctx.program_id);
    Ok(())
}

#[derive(Accounts)]
pub struct Initialize {}

