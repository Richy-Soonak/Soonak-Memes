use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Invalid token account")]
    InvalidTokenAccount,
    #[msg("Invalid Token Mint")]
    InvalidTokenMint,
    #[msg("Competition has not started yet")]
    CompetitionNotStarted,
    #[msg("Competition has already ended")]
    CompetitionEnded,
    #[msg("Competition has not ended yet")]
    CompetitionNotEnded,
    #[msg("Competition has already been finished")]
    CompetitionAlreadyFinished,
    #[msg("Invalid meme index")]
    InvalidMemeIndex,
    #[msg("Donation period has been ended")]
    DonationPeriodEnded,
    #[msg("Competition has already started")]
    CompetitionAlreadyStarted,
    #[msg("Invalid winner token account")]
    InvalidWinnerAccount,
    #[msg("A competition already exists for this token")]
    CompetitionAlreadyExists,
    #[msg("Invalid Merkle proof")]
    InvalidMerkleProof,
    #[msg("Already voted")]
    AlreadyVoted,
    #[msg("Insufficient Lamports")]
    InsufficientLamports,
    #[msg("Insufficient Usdc")]
    InsufficientUsdc,
    #[msg("Spam filter fee has not paid")]
    SpamFilterFeeNotPaid,
    #[msg("Spam filter fee has already been paid")]
    SpamFilterFeeAlreadyPaid,
    #[msg("User is not the valid spam filter fee payer")]
    InvalidSpamFilterFeePayer,
}
