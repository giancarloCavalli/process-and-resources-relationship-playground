import { Block } from "./types"

describe('DraggableBlock tests', () => {
  it('should render block passed as prop', () => {
    const block: Block = {
      id: '99',
      position: {
        left: 50,
        top: 100
      },
      type: "PROCESS",
      resourceQuantity: 1
    }
  })
})