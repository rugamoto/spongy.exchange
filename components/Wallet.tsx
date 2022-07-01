import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { Chain, ChainId } from 'socket-v2-sdk'
import { WalletContext } from '../context/WalletContext'
import styles from '../styles/Wallet.module.css'
import { socket } from '../utils/socket'

const Wallet = () => {
  const wallet = useContext(WalletContext)
  async function handleConnect() {
    await wallet?.connectWallet()
  }

  const [chain, setChain] = useState<Chain>()

  useEffect(() => {
    if (wallet?.network?.chainId) {
      ;(async () => {
        const chain = await socket.getChain(wallet?.network?.chainId as ChainId)
        setChain(chain)
      })()
    }
  }, [wallet?.network?.chainId])

  return (
    <div className={styles.wallet}>
      {wallet?.account ? (
        <div className={styles.account}>
          {chain && <img src={chain.icon} alt={chain.name} />}
          <div>{wallet.account}</div>
        </div>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
    </div>
  )
}

export default Wallet
