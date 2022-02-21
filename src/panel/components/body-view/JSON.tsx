import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { MoreHoriz as MoreHorizIcon } from '@/icons'

import type { CSSProperties, MutableRefObject } from 'react'

type JSONValue =
  | null
  | boolean
  | number
  | string
  | JSONValue[]
  | { [key: string]: JSONValue }

type PrimitiveValue = null | boolean | number | string

const isPrimitive = (value: JSONValue): value is PrimitiveValue =>
  typeof value === 'boolean' ||
  typeof value === 'number' ||
  typeof value === 'string' ||
  value === null
const isArray = (value: JSONValue): value is JSONValue[] =>
  value instanceof Array
const isObject = (value: JSONValue): value is { [key: string]: JSONValue } =>
  value instanceof Object

interface PrimitiveProps {
  value: PrimitiveValue
}

const PrimitiveView = ({ value }: PrimitiveProps) => {
  switch (typeof value) {
    case 'boolean':
      return <pre>{value}</pre>
    case 'number':
      return <pre>{value}</pre>
    case 'string':
      return <pre>&quot;{value}&quot;</pre>
    case 'object': {
      if (value === null) {
        return <pre>null</pre>
      }
    }
  }
  throw new Error('invalid JSON value')
}

interface ObjectProps {
  obj: { [key: string]: JSONValue } | JSONValue[]
  depth: number
  foldButtonRef?: MutableRefObject<HTMLButtonElement | null>
}

const ObjectView = ({ obj, depth, foldButtonRef }: ObjectProps) => {
  const [folded, setFolded] = useState(depth !== 0)
  const style: CSSProperties = useMemo(
    () => ({ marginLeft: `${depth * 0.75}rem` }),
    [depth]
  )

  const onToggleFolded = useCallback(() => setFolded((f) => !f), [])

  useEffect(() => {
    if (foldButtonRef?.current) {
      foldButtonRef.current.onclick = onToggleFolded
    }
  })

  const rows = useMemo<React.ReactNode[]>(() => {
    const items = []
    for (const [k, v] of Object.entries(obj)) {
      if (isPrimitive(v)) {
        items.push(
          <div key={k} className="flex items-baseline space-x-1" style={style}>
            <pre>{k}:</pre>
            <PrimitiveView value={v} />
          </div>
        )
      } else if (isArray(v) || isObject(v)) {
        items.push(<ObjectRows key={k} {...{ k, v, style, depth }} />)
      } else {
        throw new Error('invalid JSON value')
      }
    }
    return items
  }, [obj, style, depth])

  return <div className={folded ? 'hidden' : ''}>{rows}</div>
}

interface RowsProps {
  k: string
  v: { [key: string]: JSONValue } | JSONValue[]
  style: CSSProperties
  depth: number
}

const ObjectRows = ({ k, v, style, depth }: RowsProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const [leftGuard, rightGuard] = useMemo(() => {
    if (isArray(v)) {
      return ['[', ']']
    } else if (isObject(v)) {
      return ['{', '}']
    }
    throw new Error('invalid JSON value')
  }, [v])

  return (
    <>
      <div key={k} className="flex items-baseline space-x-1" style={style}>
        <pre>{k}:</pre>
        <pre className="flex items-center space-x-0.5">
          {leftGuard}
          <button
            className="rounded-sm bg-slate-400 hover:bg-slate-500 active:bg-slate-600"
            ref={buttonRef}
          >
            <MoreHorizIcon />
          </button>
          {rightGuard}
        </pre>
      </div>
      <ObjectView obj={v} depth={depth + 1} foldButtonRef={buttonRef} />
    </>
  )
}

interface Props {
  jsonData: string
}

export const JSONBodyView = ({ jsonData }: Props) => {
  const value = useMemo<JSONValue>(() => JSON.parse(jsonData), [jsonData])
  const view = useMemo(() => {
    if (isPrimitive(value)) {
      return <PrimitiveView value={value} />
    } else if (isArray(value) || isObject(value)) {
      return <ObjectView obj={value} depth={0} />
    }
    throw new Error('invalid JSON value')
  }, [value])
  return view
}
