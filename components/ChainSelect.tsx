import { Chain, ChainId } from 'socket-v2-sdk'
import Select, { components, GroupBase, OptionProps, SingleValueProps } from 'react-select'

interface ChainSelectProps {
  label: string
  chains: Chain[]
  value: ChainId | undefined
  onChange: (chainId: ChainId) => void
}

interface ChainOptionProps {
  value: ChainId
  label: string
  icon: string
}

const OptionRender = (props: ChainOptionProps) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img src={props.icon} style={{ width: 24 }} />
    <span style={{ marginLeft: 5 }}>{props.label}</span>
  </div>
)

const ChainOption = (
  props: OptionProps<ChainOptionProps, boolean, GroupBase<ChainOptionProps>>
) => (
  <components.Option {...props}>
    <OptionRender {...props.data} />
  </components.Option>
)

const ChainSingleValue = (
  props: SingleValueProps<ChainOptionProps, boolean, GroupBase<ChainOptionProps>>
) => (
  <components.SingleValue {...props}>
    <OptionRender {...props.data} />
  </components.SingleValue>
)

const ChainSelect = ({ label, chains, value, onChange }: ChainSelectProps) => {
  return (
    <div style={{ width: 200 }}>
      <label>{label}</label>
      <Select
        placeholder="Select Chain"
        // @ts-ignore
        value={{
          value,
          label: chains.find((c) => c.chainId === value)?.name,
          icon: chains.find((c) => c.chainId === value)?.icon,
        }}
        options={chains.map((c) => ({ value: c.chainId, label: c.name, icon: c.icon }))}
        // @ts-ignore
        onChange={(option) => onChange(option?.value)}
        components={{ Option: ChainOption, SingleValue: ChainSingleValue }}
      />
    </div>
  )
}

export default ChainSelect
