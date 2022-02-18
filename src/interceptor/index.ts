import { Intercept, intercepts as readWriteIntercepts } from './intercept'
import { Request, requests as readWriteRequests } from './request'

const readonlyIntercepts = readWriteIntercepts as ReadonlyArray<
  Readonly<Intercept>
>
export const intercepts = readonlyIntercepts

const readonlyRequests = readWriteRequests as ReadonlyArray<Readonly<Request>>
export const request = readonlyRequests

export { listen, unlisten } from './debugger'
export { Request, RequestEventListener, subscribe } from './request'
export { Intercept, addIntercept, removeIntercept } from './intercept'
