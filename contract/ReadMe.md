# Soonak Memes Contract

This folder contains the smart contracts for the **Soonak Memes** project, built using **Solana Anchor**. These contracts handle the on-chain logic for creating, sharing, and managing memes on the Solana blockchain.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Contract Structure](#contract-structure)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

The smart contracts in this folder are responsible for:
- Creating new memes.
- Storing meme metadata.
- Managing user interactions with memes.
- Facilitating transactions on the Solana blockchain.

## Setup

To get started with the smart contracts, ensure you have the following prerequisites:

- **Rust**: Install Rust from [rustup.rs](https://rustup.rs/).
- **Solana CLI**: Install the Solana Command Line Tools from [Solana Docs](https://docs.solana.com/cli/install-solana-cli-tools).
- **Anchor**: Install Anchor by following the instructions on the [Anchor documentation](https://project-serum.github.io/anchor/getting-started/installation.html).

### Install Dependencies

Navigate to this directory and run:
```bash
cargo build-bpf
```

## Contract Structure

```
contract/
├── src/
│   ├── lib.rs           # Main contract logic
│   ├── instructions.rs   # Instructions for the contract
│   └── state.rs         # Data structures for the contract state
├── Cargo.toml           # Cargo configuration file
└── Anchor.toml          # Anchor configuration file
```

### File Descriptions

- **lib.rs**: Contains the main logic for the smart contracts.
- **instructions.rs**: Defines the various instructions that can be called by users.
- **state.rs**: Contains the data structures used to store contract state.

## Deployment

To deploy the contracts to the Solana blockchain, follow these steps:

1. **Build the Contracts**:
   ```bash
   anchor build
   ```

2. **Deploy the Contracts**:
   ```bash
   anchor deploy
   ```

3. **Verify Deployment**:
   After deployment, verify that the contracts are correctly deployed using:
   ```bash
   anchor deploy --provider.cluster <CLUSTER>
   ```

## Testing

To test the smart contracts, you can run the following command:

```bash
anchor test
```

This will execute the tests defined in the `tests/` directory.

## Contributing

Contributions to the contract are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions or feedback regarding the contracts, please reach out to:

- **Your Name**: [your.email@example.com](mailto:your.email@example.com)
- **GitHub**: [yourusername](https://github.com/yourusername)

---

Thank you for your interest in the Soonak Memes contracts! We look forward to your contributions and feedback!
