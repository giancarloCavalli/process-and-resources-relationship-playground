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
    expect(queryByTestId('block-wrapper')).toHaveStyle({
      left: '50px',
      top: '100px'
    })
  })

  it('should render resource block passed as prop', () => {
    const block: Block = {
      id: '51',
      position: {
        left: 100,
        top: 150
      },
      type: "RESOURCE",
      resourceQuantity: 2
    }

    const { getByText, getAllByTestId, queryByTestId } = render(
      <DraggableBlock
        block={block}
        isWaitingSelection={false}
        isInEditConnectionMode={false}
      />
    )

    expect(getByText('R51')).toBeInTheDocument()
    expect(getAllByTestId('resource-sphere').length).toBe(2)
    expect(queryByTestId('block-wrapper')).toHaveStyle({
      left: '100px',
      top: '150px'
    })
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

  it('should render cancel connecting button when isInEditConnectionMode and hide + and - small buttons', () => {
    const block: Block = {
      id: '1',
      position: {
        left: 50,
        top: 100
      },
      type: "RESOURCE",
      resourceQuantity: 2
    }

    const { getByText, queryByTestId } = render(
      <DraggableBlock
        block={block}
        isInEditConnectionMode
        isWaitingSelection={false}
      />
    )

    expect(getByText('X')).toBeInTheDocument()

    expect(queryByTestId('start-connecting-button')).not.toBeInTheDocument()
    expect(queryByTestId('drop-connections-button')).not.toBeInTheDocument()
  })

  it('should render connect button when isWaitingSelection and hide + and - small buttons', () => {
    const block: Block = {
      id: '1',
      position: {
        left: 50,
        top: 100
      },
      type: "PROCESS",
      resourceQuantity: 1
    }

    const { queryByTestId } = render(
      <DraggableBlock
        block={block}
        isInEditConnectionMode={false}
        isWaitingSelection
      />
    )

    expect(queryByTestId('connect-to-button')).toBeInTheDocument()

    expect(queryByTestId('start-connecting-button')).not.toBeInTheDocument()
    expect(queryByTestId('drop-connections-button')).not.toBeInTheDocument()
  })

  it('should update position on element drag', () => {
    const block: Block = {
      id: '1',
      position: {
        left: 0,
        top: 0
      },
      type: "PROCESS",
      resourceQuantity: 1
    }

    const { getByTestId } = render(
      <DraggableBlock
        block={block}
        isInEditConnectionMode={false}
        isWaitingSelection={false}
      />
    )

    fireEvent.mouseDown(getByTestId(/block-wrapper/), {
      clientX: 0, clientY: 0
    })
    fireEvent.mouseMove(getByTestId(/block-wrapper/), {
      clientX: 50, clientY: 100
    })
    fireEvent.mouseUp(getByTestId(/block-wrapper/))

    expect(getByTestId(/block-wrapper/)).toHaveStyle({
      left: '50px',
      top: '100px'
    })

    expect(block.position.left).toEqual(50)
    expect(block.position.top).toEqual(100)
  })

})