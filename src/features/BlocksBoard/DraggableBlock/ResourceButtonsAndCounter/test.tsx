import { render } from "@testing-library/react"
import { ResourceButtonsAndCounter } from "."

describe('ResourceButtonsAndCounter tests', () => {

  it('should render two small buttons and 3 resource spheres', () => {
    const onIncrementResourceQuantityMock = jest.fn()
    const onDecrementResourceQuantity = jest.fn()

    const { getAllByRole, getAllByTestId } = render(
      <ResourceButtonsAndCounter
        resourceQuantity={3}
        onIncrementResourceQuantity={onIncrementResourceQuantityMock}
        onDecrementResourceQuantity={onDecrementResourceQuantity}
      />
    )

    expect(getAllByRole('button').length).toBe(2)

    expect(getAllByTestId('resource-sphere').length).toBe(3)
  })
})