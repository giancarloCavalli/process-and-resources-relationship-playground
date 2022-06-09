import { BlockType } from '../../types/blockType'
import * as S from './style'

type Props = {
  blockType: BlockType,
  handleClick: (blockType: BlockType) => void
}

export const GenerateBlockButton = ({ blockType, handleClick }: Props) => {

  const onButtonClick = () => {
    handleClick(blockType);
  }

  return (
    <S.Wrapper onClick={onButtonClick}>
      {`ADD ${blockType}`}
    </S.Wrapper>
  )
}