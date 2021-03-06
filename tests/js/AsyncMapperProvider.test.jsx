// Copyright (c) 2020 Gonzalo Müller Bravo.
import * as React from 'react'

import {
  AsyncMapperProvider,
  useMapper,
  useMapperDispatcher,
  useMapperState
} from '../../src/react-reducer-provider'

import delay from 'delay'
import { mount } from 'enzyme'

async function testMap(action) {
  switch (action) {
    case 'ACTION1':
      return await delay(5, { value: '1' })
    default:
      return '0'
  }
}

describe('AsyncMapperProvider tests', () => {
  it('should render', async () => {
    const testInitialState = 'A'
    const provider = mount(
      <AsyncMapperProvider
        name={456}
        mapper={testMap}
        initialState={testInitialState}
      >
        <div>Child</div>
      </AsyncMapperProvider>
    )

    expect(provider).toHaveText('Child')
    expect(provider).toHaveProp('name', 456)
    expect(provider).toHaveProp('mapper', testMap)
    expect(provider).toHaveProp('initialState', testInitialState)
  })

  it('should reduce with useMapperDispatcher and get state', async () => {
    const testInitialState = 'A'
    const FunComponent1 = () => {
      const dispatch = useMapperDispatcher(557)
      return (
        <button onClick={() => dispatch('ACTION1')}>
          Click
        </button>
      )
    }
    const FunComponent2 = () => {
      const state = useMapperState(557)
      return (
        <div>
          Child{state}
        </div>
      )
    }
    const provider = mount(
      <AsyncMapperProvider
        name={557}
        mapper={testMap}
        initialState={testInitialState}
      >
        <FunComponent1 />
        <FunComponent2 />
      </AsyncMapperProvider>
    )
    expect(provider).toHaveText('ClickChildA')

    provider.find('button').simulate('click')
    provider.update()

    await delay(10)
    expect(provider).toHaveText('ClickChild1')
  })

  it('should reduce with useMapper and get state', async () => {
    const testInitialState = 'A'
    const FunComponent1 = () => {
      const [ state, dispatch ] = useMapper(558)
      return (
        <button onClick={() => dispatch('ACTION1')}>
          Click{state}
        </button>
      )
    }
    const FunComponent2 = () => {
      const state = useMapperState(558)
      return (
        <div>
          Child{state}
        </div>
      )
    }
    const provider = mount(
      <AsyncMapperProvider
        name={558}
        mapper={testMap}
        initialState={testInitialState}
      >
        <FunComponent1 />
        <FunComponent2 />
      </AsyncMapperProvider>
    )
    expect(provider).toHaveText('ClickAChildA')

    provider.find('button').simulate('click')
    provider.update()

    await delay(10)
    expect(provider).toHaveText('Click1Child1')
  })
})
