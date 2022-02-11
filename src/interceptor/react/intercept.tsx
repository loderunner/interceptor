import * as React from 'react'
import { createContext, useContext, useState } from 'react'

import * as intercept from '../intercept'

interface InterceptContextType {
  intercepts: intercept.Intercept[]
  addIntercept: (inter: intercept.Intercept) => void
  removeIntercept: (inter: intercept.Intercept) => void
}

const InterceptContext = createContext<InterceptContextType>({
  intercepts: [],
  addIntercept: () => {},
  removeIntercept: () => {},
})

interface Props {
  children: React.ReactNode
}

export const Provider = ({ children }: Props) => {
  const [intercepts, setIntercepts] = useState([...intercept.intercepts])

  const addIntercept = (inter: intercept.Intercept) => {
    intercept.addIntercept(inter)
    setIntercepts([...intercept.intercepts])
  }
  const removeIntercept = (inter: intercept.Intercept) => {
    intercept.removeIntercept(inter)
    setIntercepts([...intercept.intercepts])
  }

  return (
    <InterceptContext.Provider
      value={{ intercepts, addIntercept, removeIntercept }}
    >
      {children}
    </InterceptContext.Provider>
  )
}

export const useIntercepts = () => useContext(InterceptContext)
