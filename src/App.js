import React, { useState, useEffect } from 'react';
import { GlittrSDK, Account, txBuilder } from '@glittr-sdk/sdk';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

const NETWORK = "regtest";
const electrumApi = "https://hackathon-electrum.glittr.fi";
const glittrApi = "https://hackathon-core-api.glittr.fi";

const client = new GlittrSDK({
  network: NETWORK,
  electrumApi: electrumApi,
  glittrApi: glittrApi,
});

const App = () => {
  const [creatorWif, setCreatorWif] = useState("");
  const [contributorWif, setContributorWif] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const [vestingTimeLeft, setVestingTimeLeft] = useState(null);
  const [amount, setAmount] = useState(0);

  const handleWifChange = (e, type) => {
    if (type === 'creator') {
      setCreatorWif(e.target.value);
    } else {
      setContributorWif(e.target.value);
    }
  };

  const createCrowdfundingContract = async () => {
    if (!creatorWif) {
      setTxStatus("Creator WIF is required.");
      return;
    }

    const creatorAccount = new Account({ wif: creatorWif, network: NETWORK });

    const contract = txBuilder.purchaseBurnSwapContractInstantiate({
      simple_asset: {
        supply_cap: 1000000n.toString(),
        divisibility: 18,
        live_time: 0,
      },
      purchase_burn_swap: {
        input_asset: "raw_btc",
        transfer_scheme: { purchase: creatorAccount.p2pkh().address },
        transfer_ratio_type: { fixed: { ratio: [1, 1] } },
      },
    });

    try {
      const txid = await client.createAndBroadcastTx({
        account: creatorAccount.p2pkh(),
        tx: contract,
        outputs: [{ address: creatorAccount.p2pkh().address, value: 546 }],
      });
      setTxStatus(`Contract Created! TXID: ${txid}`);
    } catch (error) {
      setTxStatus("Error in creating contract.");
      console.error(error);
    }
  };

  const mintTokens = async () => {
    if (!contributorWif || amount <= 0) {
      setTxStatus("Contributor WIF and valid amount are required.");
      return;
    }

    const contributorAccount = new Account({ wif: contributorWif, network: NETWORK });

    const contract = [101869, 1];

    const tx = txBuilder.mint({
      contract,
      pointer: 0,
    });

    try {
      const txid = await client.createAndBroadcastTx({
        account: contributorAccount.p2pkh(),
        tx,
        outputs: [
          { address: contributorAccount.p2pkh().address, value: 546 },
          { address: creatorWif, value: amount },
        ],
      });
      setTxStatus(`Tokens Minted! TXID: ${txid}`);
    } catch (error) {
      setTxStatus("Error in minting tokens.");
      console.error(error);
    }
  };

  const vestingWithdraw = async () => {
    const vestingStartTime = 1680489600;
    const currentTime = Math.floor(Date.now() / 1000);
    const vestingPeriod = 180 * 24 * 60 * 60;

    if (currentTime - vestingStartTime >= vestingPeriod) {
      setVestingTimeLeft(0);
      setTxStatus("Vesting period over. You can now withdraw.");
    } else {
      setVestingTimeLeft(vestingPeriod - (currentTime - vestingStartTime));
      setTxStatus("Vesting period not complete yet.");
    }
  };

  return (
    <div className="App">
      <h1>CrowdVest - Decentralized Crowdfunding</h1>
      <div>
        <h2>Create Crowdfunding Contract</h2>
        <input
          type="text"
          placeholder="Enter Creator WIF"
          value={creatorWif}
          onChange={(e) => handleWifChange(e, 'creator')}
        />
        <button onClick={createCrowdfundingContract}>Create Contract</button>
      </div>
      <div>
        <h2>Mint Tokens</h2>
        <input
          type="text"
          placeholder="Enter Contributor WIF"
          value={contributorWif}
          onChange={(e) => handleWifChange(e, 'contributor')}
        />
        <input
          type="number"
          placeholder="Amount in Satoshis"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button onClick={mintTokens}>Mint Tokens</button>
      </div>
      <div>
        <h2>Vesting</h2>
        <button onClick={vestingWithdraw}>Check Vesting Status</button>
        {vestingTimeLeft !== null && (
          <p>
            {vestingTimeLeft === 0
              ? "Vesting complete. Withdraw now!"
              : `Time left: ${vestingTimeLeft / 60 / 60 / 24} days`}
          </p>
        )}
      </div>
      <div>
        <h2>Status</h2>
        <p>{txStatus}</p>
      </div>
    </div>
  );
};

export default App;
