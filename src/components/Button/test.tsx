import { fireEvent, render } from "@testing-library/react"

import { Button } from './index'

describe('Button tests', () => {

  it('should render children in button', () => {
    const { getByText } = render(<Button handleClick={() => { }}>Click me</Button>)

    expect(getByText(/Click/).textContent).toBe("Click me")
  })

  it('should render orange as default background color', () => {
    const { getByRole } = render(<Button handleClick={() => { }}>Click me</Button>)

    expect(getByRole("button")).toHaveStyle({
      backgroundColor: 'orange'
    })
  })

  it('should render background color passed as prop', () => {
    const { getByRole } = render(<Button backgroundColor='green' handleClick={() => { }}>Click me</Button>)

    expect(getByRole('button')).toHaveStyle({
      backgroundColor: 'green'
    })
  })

  it('should invoke onClick function on click', () => {
    const onClickMock = jest.fn()
    const { getByRole } = render(<Button handleClick={onClickMock}>Click me</Button>)

    fireEvent.click(getByRole('button'))

    expect(onClickMock).toHaveBeenCalledTimes(1)
  })
})