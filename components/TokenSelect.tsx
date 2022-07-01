import { TokenList } from 'socket-v2-sdk'
import Select, { components, GroupBase, OptionProps, SingleValueProps } from 'react-select'

interface TokenSelectProps {
  list: TokenList
  value: string | undefined
  onChange: (tokenAddress: string) => void
}

interface TokenOptionProps {
  value: string
  label: string | undefined
  icon: string | undefined
}

const OptionRender = (props: TokenOptionProps) => (
  <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left' }}>
    <img src={props.icon} style={{ width: 24 }} />
    <span style={{ marginLeft: 5 }}>{props.label}</span>
  </div>
)

const ChainOption = (
  props: OptionProps<TokenOptionProps, boolean, GroupBase<TokenOptionProps>>
) => (
  <components.Option {...props}>
    <OptionRender {...props.data} />
  </components.Option>
)

const ChainSingleValue = (
  props: SingleValueProps<TokenOptionProps, boolean, GroupBase<TokenOptionProps>>
) => (
  <components.SingleValue {...props}>
    <OptionRender {...props.data} />
  </components.SingleValue>
)

const TokenSelect = ({ list, value, onChange }: TokenSelectProps) => {
  return (
    <div style={{ width: 240 }}>
      <Select
        placeholder="Select Chain"
        // @ts-ignore
        value={
          value && {
            value,
            label: list.tokenByAddress(value)?.name,
            icon: list.tokenByAddress(value)?.icon,
          }
        }
        options={list.tokens.map((token) => ({
          value: token.address,
          label: token.name,
          icon: token.icon,
        }))}
        // @ts-ignore
        onChange={(option) => onChange(option?.value)}
        components={{ Option: ChainOption, SingleValue: ChainSingleValue }}
      />
    </div>
  )
}

export default TokenSelect
