import * as S from './styles'
import * as S2 from '../styles'

type Props = {
  resourceQuantity: number;
  handleIncrementResourceQuantity: () => void;
  handleDecrementResourceQuantity: () => void;
}

export const ResourceButtonsAndCounter = ({ resourceQuantity, handleIncrementResourceQuantity, handleDecrementResourceQuantity }: Props) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <S.ResourceCounterWrapper>
        {[...Array(resourceQuantity)].map((_, index) => (
          <S.ResourceSphere key={index} />
        ))}
      </S.ResourceCounterWrapper>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <S2.SmallButton backgroundColor='orange' onClick={handleIncrementResourceQuantity}>+</S2.SmallButton>
        <S2.SmallButton backgroundColor='purple' onClick={handleDecrementResourceQuantity}>-</S2.SmallButton>
      </div>
    </div>
  )
}