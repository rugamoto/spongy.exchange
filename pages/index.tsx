import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { ChainId, Chain, TokenList, Path, SocketQuote, SocketTx } from 'socket-v2-sdk'
import { useEffect, useState } from 'react'
import { socket } from '../utils/socket'
import Wallet from '../components/Wallet'
import { useWallet } from '../hooks/useWallet'
import { WalletContext } from '../context/WalletContext'
import TokenSelect from '../components/TokenSelect'
import { NATIVE_TOKEN_ADDRESS } from 'socket-v2-sdk/lib/src/constants'
import ChainSelect from '../components/ChainSelect'
import { ethers } from 'ethers'
import Image from 'next/image'
import Icon from '../public/icon.svg'
import ActiveExchange from '../components/ActiveExchange'

const Home: NextPage = () => {
  const wallet = useWallet()

  const [chains, setChains] = useState<Chain[]>([])
  const [fromChainId, setFromChainId] = useState<ChainId>(ChainId.MAINNET_CHAIN_ID)
  const [toChainId, setToChainId] = useState<ChainId>(ChainId.POLYGON_CHAIN_ID)
  const [tokenLists, setTokenLists] = useState<{
    from: TokenList
    to: TokenList
  }>()

  const [fromTokenAddress, setFromTokenAddress] = useState<string>(NATIVE_TOKEN_ADDRESS)
  const [toTokenAddress, setToTokenAddress] = useState<string>(NATIVE_TOKEN_ADDRESS)

  const [amount, setAmount] = useState<string>()
  const [quote, setQuote] = useState<SocketQuote | null>(null)
  const [isQuoteDone, setIsQuoteDone] = useState<boolean>(false)

  useEffect(() => {
    if (
      wallet.account &&
      tokenLists &&
      fromChainId &&
      toChainId &&
      fromTokenAddress &&
      toTokenAddress &&
      amount
    ) {
      const fetchQuote = async () => {
        const fromToken = tokenLists.from.tokenByAddress(fromTokenAddress)
        const toToken = tokenLists.to.tokenByAddress(toTokenAddress)
        if (!fromToken || !toToken) throw new Error('token not found')
        const path = new Path({ fromToken, toToken })
        const quote = await socket.getBestQuote({
          address: wallet.account!,
          amount: ethers.utils.parseUnits(amount, fromToken.decimals).toString(),
          path,
        })
        setQuote(quote)
      }

      fetchQuote()
    }
  }, [wallet.account, tokenLists, fromChainId, toChainId, fromTokenAddress, toTokenAddress, amount])

  useEffect(() => {
    const fetchChains = async () => {
      const allChains = await socket.getChains()
      setChains(allChains)
    }

    fetchChains()
  }, [])

  useEffect(() => {
    const fetchTokenList = async () => {
      const tokenLists = await socket.getTokenList({ fromChainId, toChainId })
      setTokenLists(tokenLists)
    }

    fetchTokenList()
  }, [fromChainId, toChainId])

  const receiveAmount =
    quote?.route.toAmount &&
    ethers.utils.formatUnits(quote.route.toAmount, quote.path.toToken.decimals)

  const [latestTx, setLatestTx] = useState<SocketTx>()

  async function startQuote() {
    if (!wallet.provider) throw new Error('No provider detected. Are you connected?')
    if (!quote) throw new Error('No quote detected. Did you get a quote?')
    const connectedSocket = socket.connect(wallet.provider)
    await connectedSocket.web3Start(quote, {
      onTx: (tx) => {
        setLatestTx(tx)
      },
    })
    setIsQuoteDone(true)
  }

  function resetQuote() {
    setQuote(null)
    setIsQuoteDone(false)
    setLatestTx(undefined)
    setAmount(undefined)
  }

  async function handleQuoteDone() {
    resetQuote()
  }

  return (
    <WalletContext.Provider value={{ ...wallet }}>
      <div className={styles.container}>
        <Head>
          <title>Spongy Exchange</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <header className={styles.header}>
            <Wallet />
          </header>

          <Image src={Icon} alt="Spongy" width="200" height="200" />
          <p style={{ marginBottom: 20, marginTop: 0, fontWeight: 'bold' }}>Spongy.exchange</p>

          {quote && latestTx ? (
            <ActiveExchange
              quote={quote}
              tx={latestTx}
              done={isQuoteDone}
              onClickDone={handleQuoteDone}
            />
          ) : (
            <div>
              <div className={styles.chains}>
                <ChainSelect
                  label="Transfer From"
                  value={fromChainId}
                  chains={chains}
                  onChange={(chainId) => setFromChainId(chainId)}
                />

                <ChainSelect
                  label="Transfer To"
                  value={toChainId}
                  chains={chains}
                  onChange={(chainId) => setToChainId(chainId)}
                />
              </div>

              {tokenLists && (
                <div className={styles.tokens}>
                  <label>Send</label>
                  <div className={styles.tokenSelect}>
                    <input
                      className={styles.amountInput}
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                    />
                    <TokenSelect
                      value={fromTokenAddress}
                      onChange={(address: string) => setFromTokenAddress(address)}
                      list={tokenLists.from}
                    />
                  </div>

                  <label>Receive</label>
                  <div className={styles.tokenSelect}>
                    <input
                      type="text"
                      disabled
                      value={receiveAmount}
                      placeholder="0.0"
                      className={styles.amountInput}
                    />
                    <TokenSelect
                      value={toTokenAddress}
                      onChange={(address: string) => setToTokenAddress(address)}
                      list={tokenLists.to}
                    />
                  </div>
                </div>
              )}

              <button onClick={startQuote} disabled={!quote}>
                Exchange!
              </button>
            </div>
          )}
        </main>

        <footer className={styles.footer}>Made with ❤️ by anons all over the interwebs</footer>
      </div>
    </WalletContext.Provider>
  )
}

export default Home
