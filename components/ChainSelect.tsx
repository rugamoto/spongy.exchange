import { Chain, ChainId, TokenList } from 'socket-v2-sdk'

interface ChainSelectProps {
  label: string
  chains: Chain[]
  value: ChainId | undefined
  onChange: (chainId: ChainId) => void
}

const ChainSelect = ({ label, chains, value, onChange }: ChainSelectProps) => {
  return (
    <div>
      <label>{label}</label>
      <select
        onChange={(e) => onChange(parseInt(e.target.value))}
        value={value}
      >
        {chains.map((chain) => (
          <option key={chain.chainId} value={chain.chainId}>
            {chain.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ChainSelect
