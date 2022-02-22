import * as React from 'react'

export const RequestProvider = ({
  children,
}: {
  children: React.ReactNode
}) => <>{children}</>
export const useRequests = jest.fn(() => [globalMocks.request])

const continueRequest = jest.fn(() => {})
export const useRequest = jest.fn((id: string) => {
  if (id === 'request') {
    return { request: globalMocks.request, continueRequest }
  }
  throw new Error('Mock[useRequest]: request not found')
})
