import { useEffect, useState } from "react";
import { recoverTypedDataAddress } from "viem";
import type { Address } from "wagmi";
import { useNetwork } from 'wagmi'
import { useSignTypedData, useAccount } from "wagmi";

const name = "Cloud Sign";
const primaryType = "Contract"
const version = "1"

export const SignTypedData = () => {
  const { address } = useAccount();
  const { chain } = useNetwork()

  const domain = {
    name,
    version,
    chainId: chain?.id,
    verifyingContract: "0x56bFfb1065014F370e69975A48B9277EB8DA7365",
  } as const;

  // The named list of all type definitions
  const types = {
    Contract: [
      { name: "creator", type: "address" },
      { name: "ipfsHash", type: "string" },
    ],
  } as const;

  const message = {
    creator: address || '0x',
    ipfsHash: "QmYDpHvjDCJdk7PRMYEcmwPHn2f85sr9m3WUAFMPq2i3iy",
  } as const;

  const { data, error, isLoading, signTypedData } = useSignTypedData({
    domain,
    types,
    message,
    primaryType,
  });

  const [recoveredAddress, setRecoveredAddress] = useState<Address>();
  useEffect(() => {
    if (!data) return;
    (async () => {
      setRecoveredAddress(
        await recoverTypedDataAddress({
          domain,
          types,
          message,
          primaryType,
          signature: data,
        })
      );
    })();
  }, [data]);

  return (
    <div>
      <button
        disabled={isLoading}
        onClick={() => signTypedData()}
        type="button"
      >
        {isLoading ? "Check Wallet" : "Sign Message"}
      </button>

      {data && (
        <div>
          <div>signature {data}</div>
          <div>recovered address {recoveredAddress}</div>
        </div>
      )}

      <div>{error && (error?.message ?? "Failed to sign message")}</div>
    </div>
  );
};
