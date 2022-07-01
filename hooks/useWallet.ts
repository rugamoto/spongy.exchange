import { ethers } from 'ethers'
import { Network } from '@ethersproject/networks'
import { useEffect, useState } from 'react'
import Core from 'web3modal'
import { useWeb3Modal } from './useWeb3Modal'

export function useWallet() {
  const web3Modal = useWeb3Modal()

  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const [account, setAccount] = useState<string>()
  const [network, setNetwork] = useState<Network>()

  const setupWallet = async (web3Modal: Core) => {
    const web3ModalProvider = await web3Modal.connect()
    const web3Provider = new ethers.providers.Web3Provider(web3ModalProvider, 'any')
    setProvider(web3Provider)
    const accounts = await web3Provider.listAccounts()
    setAccount(accounts[0])
    const theNetwork = await web3Provider.getNetwork()
    setNetwork(theNetwork)
  }

  useEffect(() => {
    if (web3Modal) {
      if (web3Modal.cachedProvider) {
        setupWallet(web3Modal)
      }
    }
  }, [web3Modal])

  const connectWallet = async () => {
    if (web3Modal) {
      await setupWallet(web3Modal)
    }
  }

  return { web3Modal, provider, account, network, connectWallet }
}
