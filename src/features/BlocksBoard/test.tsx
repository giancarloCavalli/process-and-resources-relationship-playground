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

  it('should have increasing and independent for processes and resources', () => {
    const { getByText } = render(
      <BlocksBoard />
    )

    fireEvent.click(getByText(/ADD PROCESS/i))
    fireEvent.click(getByText(/ADD RESOURCE/i))
    fireEvent.click(getByText(/ADD PROCESS/i))
    fireEvent.click(getByText(/ADD RESOURCE/i))

    expect(getByText(/P0/i)).toBeInTheDocument()
    expect(getByText(/P1/i)).toBeInTheDocument()
    expect(getByText(/R0/i)).toBeInTheDocument()
    expect(getByText(/R1/i)).toBeInTheDocument()
  })

  it('should enable cancel connecting on process and enable connect to in resource when process start connecting', () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <BlocksBoard />
    )

    fireEvent.click(getByText(/add process/i))
    fireEvent.click(getByTestId(/start-connecting-button/i))
    expect(getByText(/X/i)).toBeInTheDocument()

    fireEvent.click(getByText(/add resource/i))
    fireEvent.click(getByText(/add resource/i))
    expect(getAllByTestId(/connect-to-button/i).length).toBe(2)

  })

  it('should enable cancel connecting on resource and enable connect to in process when resource start connecting', () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <BlocksBoard />
    )

    fireEvent.click(getByText(/add resource/i))
    fireEvent.click(getByTestId(/start-connecting-button/i))
    expect(getByText(/X/i)).toBeInTheDocument()

    fireEvent.click(getByText(/add process/i))
    fireEvent.click(getByText(/add process/i))
    expect(getAllByTestId(/connect-to-button/i).length).toBe(2)
  })

  it('should connect process and resource successfully', () => {
    const { getByText, getByTestId } = render(
      <BlocksBoard />
    )

    fireEvent.click(getByText(/ADD PROCESS/i))
    fireEvent.click(getByTestId((/start-connecting-button/i)))

    fireEvent.click(getByText(/ADD RESOURCE/i))
    fireEvent.click(getByTestId(/connect-to-button/i))

    expect(getByTestId('connection-line')).toBeInTheDocument()
    expect(getByTestId(/connection-arrow-head/i)).toBeInTheDocument()
  })
})