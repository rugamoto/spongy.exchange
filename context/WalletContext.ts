import { ethers } from 'ethers'
import { createContext } from 'react'
import { Network } from '@ethersproject/networks'
import Core from 'web3modal'

interface WalletContextInterface {
  web3Modal: Core | null
  provider?: ethers.providers.Web3Provider
  account?: string
  network?: Network
  connectWallet: () => Promise<void>
}

export const WalletContext = createContext<WalletContextInterface | null>(null)
