import { useAccount, useDisconnect, useEnsName } from "wagmi";

import { useIsMounted } from "../hooks";
import { SignTypedData } from "./SignTypedData";

export const Account = () => {
  const isMounted = useIsMounted();
  const account = useAccount({
    onConnect: (data) => console.log("connected", data),
    onDisconnect: () => console.log("disconnected"),
  });
  const { data: ensName } = useEnsName({
    address: account?.address,
    chainId: 1,
  });

  const disconnect = useDisconnect();

  return (
    <div>
      <div>
        {ensName ? `(${account?.address})` : null}
      </div>

      <div>
        {isMounted && account?.address && (
          <button type="button" onClick={() => disconnect.disconnect()}>
            Disconnect
          </button>
        )}
      </div>
      {true && (
        <>
          <h4>Sign Typed Data</h4>
          <SignTypedData />
        </>
      )}
    </div>
  );
};
