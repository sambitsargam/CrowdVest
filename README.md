# CrowdVest - Decentralized Crowdfunding with Vesting

CrowdVest is a decentralized crowdfunding platform built on Bitcoin using the Glittr SDK. The platform allows project creators to raise funds from contributors using tokenized assets, with built-in vesting to ensure long-term commitment. It leverages Bitcoin's blockchain for secure, transparent, and efficient fundraising, while ensuring that contributors' funds are vested over time.

## Features

- **Crowdfunding**: Allows users to raise funds from multiple contributors.
- **Vesting**: Tokens are unlocked over time, incentivizing long-term commitment from contributors.
- **Decentralized**: Built on the Bitcoin blockchain using the Glittr SDK, ensuring transparency and security.
- **Smart Contracts**: Interact with Bitcoin’s ecosystem through smart contracts, assets, and transaction broadcasting.

## Technologies

- **Glittr SDK**: A client-side library that provides seamless access to the Glittr infrastructure, enabling smart contract deployment and interaction with Bitcoin’s ecosystem.
- **Bitcoin**: Utilizes Bitcoin for secure and decentralized transactions.

## Installation

To run the project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/sambitsargam/CrowdVest.git
    cd CrowdVest
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the project:

    ```bash
    npm start
    ```

4. Open the app in your browser at `http://localhost:3000`.

## Smart Contract

The CrowdVest contract is built using the Glittr SDK and facilitates the creation of a crowdfunding campaign with tokenized contributions and vesting. It ensures the transparency and security of all transactions.

## Usage

1. **Create a Campaign**: Project creators can set up a campaign with details like the target amount, vesting schedule, and contribution options.
2. **Contribute to a Campaign**: Contributors can send Bitcoin to the campaign and receive tokens representing their contribution.
3. **Vesting**: Tokens are vested over time, and contributors can claim their tokens according to the defined vesting schedule.

## Frontend

The frontend is built using React.js and connects to the Glittr SDK for blockchain interactions. Users can easily interact with the platform via a user-friendly interface.

## Contribution

Feel free to fork the repository, create issues, and submit pull requests. All contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **Glittr SDK**: For providing the tools to seamlessly integrate with Bitcoin's blockchain.
- **Bitcoin**: For being the foundation of the decentralized network.

