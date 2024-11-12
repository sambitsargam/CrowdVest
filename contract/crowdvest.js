const { Account, GlittrSDK, txBuilder } = require("@glittr-sdk/sdk");
const NETWORK = "regtest"; 
const electrumApi = "https://hackathon-electrum.glittr.fi";
const glittrApi = "https://hackathon-core-api.glittr.fi";
const creatorWif = "your-creator-WIF-here"; 

// Initialize GlittrSDK client
const client = new GlittrSDK({
  network: NETWORK,
  electrumApi: electrumApi,
  glittrApi: glittrApi,
});

// Create creator account from WIF
const creatorAccount = new Account({
  wif: creatorWif,
  network: NETWORK,
});

// Helper function to create the crowdfunding contract
async function createCrowdfundingContract() {
  const contract = txBuilder.purchaseBurnSwapContractInstantiate({
    simple_asset: {
      supply_cap: 1000000n.toString(), // Max tokens that can be minted
      divisibility: 18,                // Tokens are divisible up to 18 decimal places
      live_time: 0,                    // Contract doesn't expire
    },
    purchase_burn_swap: {
      input_asset: "raw_btc",          // Use raw BTC to mint tokens
      transfer_scheme: { purchase: creatorAccount.p2pkh().address },
      transfer_ratio_type: { fixed: { ratio: [1, 1] } }, // 1:1 ratio (BTC to tokens)
    },
  });

  const txid = await client.createAndBroadcastTx({
    account: creatorAccount.p2pkh(),
    tx: contract,
    outputs: [{ address: creatorAccount.p2pkh().address, value: 546 }],
  });

  console.log("Crowdfunding Contract Created with TXID: ", txid);
}

// Helper function to mint tokens for contributors
async function mintCrowdfundingTokens(contributorWif, amountInSatoshis) {
  const contributorAccount = new Account({
    wif: contributorWif,
    network: NETWORK,
  });

  const contract = [101869, 1];  // Replace with the actual contract reference

  const tx = txBuilder.mint({
    contract,
    pointer: 0,
  });

  const txid = await client.createAndBroadcastTx({
    account: contributorAccount.p2pkh(),
    tx,
    outputs: [
      { address: contributorAccount.p2pkh().address, value: 546 },
      { address: creatorAccount.p2pkh().address, value: amountInSatoshis },
    ],
  });

  console.log("Minting Transaction ID: ", txid);
}

// Vesting logic - delayed withdrawal after a certain period
async function vestingWithdraw() {
  const vestingStartTime = 1680489600; // Example: timestamp when the contribution was made
  const currentTime = Math.floor(Date.now() / 1000); // Current timestamp

  const vestingPeriod = 180 * 24 * 60 * 60; // 6 months in seconds (adjust as needed)

  if (currentTime - vestingStartTime >= vestingPeriod) {
    // Vesting period is over, allow withdrawal
    const txid = await client.createAndBroadcastTx({
      account: creatorAccount.p2pkh(),
      tx: {
        // Logic to release the vested funds
      },
      outputs: [{ address: creatorAccount.p2pkh().address, value: 1000 }],
    });

    console.log("Vesting Withdraw TXID: ", txid);
  } else {
    console.log("Vesting period not completed yet.");
  }
}

// Main function to handle contract creation, minting, and vesting
async function main() {
  console.log("Creating the crowdfunding contract...");
  // Step 1: Create the Crowdfunding Contract (Deploy it)
  await createCrowdfundingContract();

  // Step 2: Mint Tokens (Example: Contributor WIF and amount in BTC)
  const contributorWif = "contributor-WIF-here"; // Replace with contributor's WIF text
  const amountInSatoshis = 100000; // Example amount in satoshis (0.001 BTC)
  await mintCrowdfundingTokens(contributorWif, amountInSatoshis);

  // Step 3: Vesting Withdraw (Once the vesting period is over, allow withdrawal)
  // This is a simple example, you'd likely need a more robust check on time-based vesting
  await vestingWithdraw();
}

main().catch((err) => console.error("Error in execution: ", err));
