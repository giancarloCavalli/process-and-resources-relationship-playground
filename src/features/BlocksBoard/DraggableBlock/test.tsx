import { fireEvent, render } from "@/utils/test-utils"
import { DraggableBlock } from "."
import { Block } from "./types"

describe('DraggableBlock tests', () => {

  it('should render process block passed as prop and no resource spheres in it', () => {
    const block: Block = {
      id: '99',
      position: {
        left: 50,
        top: 100
      },
      type: "PROCESS",
      resourceQuantity: 1
    }

    const { getByText, queryByTestId } = render(
      <DraggableBlock
        block={block}
        isWaitingSelection={false}
        isInEditConnectionMode={false}
      />
    )

    expect(getByText('P99')).toBeInTheDocument()
    expect(queryByTestId('resource-sphere')).not.toBeInTheDocument()
  })

  it('should render resource block passed as prop', () => {
    const block: Block = {
      id: '51',
      position: {
        left: 50,
        top: 100
      },
      type: "RESOURCE",
      resourceQuantity: 2
    }

    const { getByText, getAllByTestId } = render(
      <DraggableBlock
        block={block}
        isWaitingSelection={false}
        isInEditConnectionMode={false}
      />
    )

    expect(getByText('R51')).toBeInTheDocument()
    expect(getAllByTestId('resource-sphere').length).toBe(2)
  })

  it('should increment resource spheres on resource + button click if less than 4 spheres', () => {
    const block: Block = {
      id: '1',
      position: {
        left: 50,
        top: 100
      },
      type: "RESOURCE",
      resourceQuantity: 3
    }

    const { getByTestId, getAllByTestId } = render(
      <DraggableBlock
        block={block}
        isWaitingSelection={false}
        isInEditConnectionMode={false}
      />
    )

    expect(getAllByTestId('resource-sphere').length).toBe(3)

    fireEvent.click(getByTestId('incrementResourceButton'))
    expect(getAllByTestId('resource-sphere').length).toBe(4)

    fireEvent.click(getByTestId('incrementResourceButton'))
    expect(getAllByTestId('resource-sphere').length).toBe(4)
  })

  it('should decrement resource spheres on resource - button click if greather than 1 sphere', () => {
    const block: Block = {
      id: '1',
      position: {
        left: 50,
        top: 100
      },
      type: "RESOURCE",
      resourceQuantity: 2
    }

    const { getByTestId, getAllByTestId } = render(
      <DraggableBlock
        block={block}
        isWaitingSelection={false}
        isInEditConnectionMode={false}
      />
    )

    expect(getAllByTestId('resource-sphere').length).toBe(2)

    fireEvent.click(getByTestId('decrementResourceButton'))
    expect(getAllByTestId('resource-sphere').length).toBe(1)

    fireEvent.click(getByTestId('decrementResourceButton'))
    expect(getAllByTestId('resource-sphere').length).toBe(1)
  })

})