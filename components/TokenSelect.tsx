import { TokenList } from 'socket-v2-sdk'

interface TokenSelectProps {
  label: string
  list: TokenList
  value: string | undefined
  onChange: (tokenAddress: string) => void
}

const TokenSelect = ({ label, list, value, onChange }: TokenSelectProps) => {
  return (
    <div>
      <label>{label}</label>
      <select onChange={(e) => onChange(e.target.value)} value={value}>
        {list.tokens.map((token) => (
          <option key={token.address} value={token.address}>
            {token.symbol} {token.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default TokenSelect
