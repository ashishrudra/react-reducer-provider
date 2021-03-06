// Copyright (c) 2020 Gonzalo Müller Bravo.
import { createReducerProvider } from './ReducerProvider'

export function SyncReducerProvider(props) {
  return createReducerProvider(props, (stateRef, reRenderTrigger) => (action) => {
    stateRef.current = props.reducer(stateRef.current, action)
    reRenderTrigger(stateRef.current)
    return stateRef.current
  })
}
