import { providers } from 'ethers';
import { useMemo } from 'react';
import type { Chain, Client, Transport, Account } from 'viem';
import { Config, useClient, useConnectorClient } from 'wagmi';

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  if (transport.type === 'fallback') {
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(({ value }) =>
        new providers.JsonRpcProvider(value?.url, network)
      )
    );
  }

  return new providers.JsonRpcProvider(transport.url, network);
}

/** Hook para convertir un cliente Viem a un proveedor ethers.js */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const client = useClient<Config>({ chainId });
  return useMemo(() => (client ? clientToProvider(client) : undefined), [client]);
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  return provider.getSigner(account.address);
}

/** Hook para convertir un cliente Viem conectado en un signer de ethers.js */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId });
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}