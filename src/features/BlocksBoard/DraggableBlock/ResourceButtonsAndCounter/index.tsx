import * as S from './styles'
import * as S2 from '../styles'

type Props = {
  resourceQuantity: number;
  onIncrementResourceQuantity: () => void;
  onDecrementResourceQuantity: () => void;
}

export const ResourceButtonsAndCounter = ({ resourceQuantity, onIncrementResourceQuantity, onDecrementResourceQuantity }: Props) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <S.ResourceCounterWrapper>
        {[...Array(resourceQuantity)].map((_, index) => (
          <S.ResourceSphere key={index} data-testid='resource-sphere' />
        ))}
      </S.ResourceCounterWrapper>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <S2.SmallButton backgroundColor='orange' onClick={onIncrementResourceQuantity}>+</S2.SmallButton>
        <S2.SmallButton backgroundColor='purple' onClick={onDecrementResourceQuantity}>-</S2.SmallButton>
      </div>
    </div>
  )
}