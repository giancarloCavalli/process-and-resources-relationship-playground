import { render, RenderOptions } from '@testing-library/react'
import { FC, ReactElement } from 'react'
import BlockProvider from '../features/BlocksBoard/context'

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BlockProvider>
      {children}
    </BlockProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }