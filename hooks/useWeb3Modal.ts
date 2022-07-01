import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { INFURA_API_KEY } from '../utils/constants'

export function useWeb3Modal() {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null)

  useEffect(() => {
    const newWeb3Modal = new Web3Modal({
      cacheProvider: true,
      network: 'mainnet',
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: INFURA_API_KEY,
          },
        },
        coinbasewallet: {
          package: CoinbaseWalletSDK,
          options: {
            appName: 'Spongey',
            infuraId: INFURA_API_KEY,
          },
        },
      },
    })

    setWeb3Modal(newWeb3Modal)
  }, [])

  return web3Modal
}
