import { Box, Stack } from '@mui/material'
import * as React from 'react'
import { useEffect, useReducer } from 'react'

import * as Client from './client'

import type * as api from '../api'

const App = () => {
  const [requests, pushRequest] = useReducer(
    (requests: api.Request[], req: api.Request) => [...requests, req],
    []
  )

  useEffect(() => {
    return Client.subscribe((req) => pushRequest(req))
  }, [])

  return (
    <>
      <Box sx={{ typography: 'h1' }}>Hello World!</Box>
      <Stack>
        {requests.map((req, i) => (
          <div key={i}>{`${req.method} ${req.url}`}</div>
        ))}
      </Stack>
    </>
  )
}

export default App
