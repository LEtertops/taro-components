import { Component, PropsWithChildren } from 'react'
import { View, Text } from '@tarojs/components'
import HdCheckbox from '../../commponents/HdCheckbox'
import './index.scss'

export default class Index extends Component<PropsWithChildren> {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <HdCheckbox checked>111</HdCheckbox>
        <HdCheckbox checked>
          Hello world!
        </HdCheckbox>
        <HdCheckbox checked>
          <Text>Hello world!</Text>
        </HdCheckbox>
      </View>
    )
  }
}
