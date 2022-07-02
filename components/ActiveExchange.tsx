import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { MoonLoader } from 'react-spinners'
import { Chain, ChainId, SocketQuote, SocketTx } from 'socket-v2-sdk'

const ActiveExchange = ({
  quote,
  tx,
  done,
  onClickDone,
}: {
  quote: SocketQuote
  tx?: SocketTx
  done: boolean
  onClickDone: () => void
}) => {
  return (
    <div>
      <div>
        <strong>
          {quote.path.fromToken.name} -&gt; {quote.path.toToken.name} ({quote.route.totalUserTx}{' '}
        </strong>
        Transactions)
      </div>
      {done ? (
        <div>
          <p>Exchange Done</p>
          <button onClick={onClickDone}>Done</button>
        </div>
      ) : (
        <div>
          {tx && (
            <div>
              <div
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '10px 0',
                }}
              >
                <MoonLoader color="blue" size={30} />
              </div>
              <div>
                Transaction {tx.userTxIndex + 1} / {tx.totalUserTx}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ActiveExchange
