import { fireEvent } from "@testing-library/react"
import { BlocksBoard } from '.'
import { render } from '@/utils/test-utils'

describe('BlocksBoard tests', () => {
  it('should add process block on add process click', () => {
    const { getByText, queryByText } = render(
      <BlocksBoard />
    )

    expect(queryByText(/P0/i)).not.toBeInTheDocument()

    fireEvent.click(getByText(/ADD PROCESS/i))

    expect(getByText(/P0/i)).toBeInTheDocument()
  })

  it('should add resource block on add resource click', () => {
    const { getByText, queryByText } = render(
      <BlocksBoard />
    )

    expect(queryByText(/R0/i)).not.toBeInTheDocument()

    fireEvent.click(getByText(/ADD RESOURCE/i))

    expect(getByText(/R0/i)).toBeInTheDocument()
  })
})