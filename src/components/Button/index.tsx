import * as S from './style'

type Props = {
  handleClick: () => void,
  children: string | string[],
  backgroundColor?: string
}

export const Button = ({ handleClick, children, backgroundColor }: Props) => {

  const onButtonClick = () => {
    handleClick();
  }

  return (
    <S.Wrapper onClick={onButtonClick} backgroundColor={backgroundColor ?? "orange"}>
      {children}
    </S.Wrapper>
  )
}