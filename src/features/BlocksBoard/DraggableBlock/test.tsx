import { DraggableBlock } from "."
import { render } from "../../../utils/test-utils"
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

})