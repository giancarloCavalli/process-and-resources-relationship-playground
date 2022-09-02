import { fireEvent, render } from "@testing-library/react"
import { ResourceButtonsAndCounter } from "."

describe('ResourceButtonsAndCounter tests', () => {

  it('should render two small buttons and number of resource spheres equal to resource quantity prop', () => {
    const { getAllByRole, getAllByTestId } = render(
      <ResourceButtonsAndCounter
        resourceQuantity={3}
        onIncrementResourceQuantity={jest.fn()}
        onDecrementResourceQuantity={jest.fn()}
      />
    )

    expect(getAllByRole('button').length).toBe(2)

    expect(getAllByTestId('resource-sphere').length).toBe(3)
  })

  it('should call onIncrementResourceQuantity when clicking + button', () => {
    const onIncrementResourceQuantityMock = jest.fn()

    const { getByText } = render(
      <ResourceButtonsAndCounter
        resourceQuantity={1}
        onIncrementResourceQuantity={onIncrementResourceQuantityMock}
        onDecrementResourceQuantity={jest.fn()}
      />
    )

    fireEvent.click(getByText('+'))

    expect(onIncrementResourceQuantityMock).toHaveBeenCalledTimes(1)
  })

  it('should call onDecrementResourceQuantity when clicking - button', () => {
    const onDecrementResourceQuantity = jest.fn()

    const { getByText } = render(
      <ResourceButtonsAndCounter
        resourceQuantity={1}
        onIncrementResourceQuantity={jest.fn()}
        onDecrementResourceQuantity={onDecrementResourceQuantity}
      />
    )

    fireEvent.click(getByText('-'))

    expect(onDecrementResourceQuantity).toHaveBeenCalledTimes(1)
  })
})