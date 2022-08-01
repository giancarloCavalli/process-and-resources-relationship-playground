import { render } from "@testing-library/react"

import { Button } from './index'

describe('Button tests', () => {

  it('should render children in button', () => {
    const { getByText } = render(<Button handleClick={() => { }}>Click me</Button>)

    expect(getByText(/Click/).textContent).toBe("Click me")
  })
})