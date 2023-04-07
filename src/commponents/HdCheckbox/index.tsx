import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import cls from 'classnames'
import './index.scss'

interface IProps {
	// 是否选中
	checked?: boolean
	// 切换选中状态方法回调
	onChange?: (checked: boolean) => void
	// 是否禁用
	disabled?: boolean
	// children
	children?: any
	// icon尺寸大小 默认36
	iconSize?: number
	// 文本文字大小 默认24
	fontSize?: number
	// 选择状态icon的class
	checkedIconClass?: string
	// 非选中状态下icon的class
	uncheckIconClass?: string
	// icon的颜色，默认#e54339
	iconColor?: string
	// 选中状态下icon的颜色，优先级高于iconColor
	checkedIconColor?: string
	// 非选中状态下icon的颜色，优先级高于iconColor
	uncheckIconColor?: string
	label?: string
	className?: string
}

interface IIcon {
	// 是否选中
	checked?: boolean
	style: any
	iconClass?: string
}

interface ILabel {
  children: any
  className: string
}

const Icon = (props: IIcon) => {
	const { checked, style, iconClass } = props || {}
  if (iconClass) {
    return <Text className={`iconfont ${iconClass}`} style={style} />
  }
	return checked ? (
		<Text className='iconfont' style={style}>
			&#xe70e;
		</Text>
	) : (
		<Text className='iconfont' style={style}>
			&#xe710;
		</Text>
	)
}

const Label = (props: ILabel) => {
  const { children, className } = props || {}
  return typeof children === 'string'
    ? <Text className={className}>{children}</Text>
    : children
}

const HdCheckbox = (props: IProps) => {
  const { fontSize, uncheckIconClass, checkedIconColor, iconSize } = props
  const { uncheckIconColor, checkedIconClass, className, label } = props
  const { checked, onChange, disabled, children, iconColor } = props
	const handler = () => {
		if (!disabled && typeof onChange === 'function') {
			onChange(!checked)
		}
	}
	const checkColor = checkedIconColor || iconColor || '#e54339'
	const uncheckColor = uncheckIconColor || iconColor || '#e54339'
	const color = checked ? checkColor : uncheckColor
	const style = { color, fontSize: Taro.pxTransform(iconSize || 36) }
	return (
		<View
			className={cls('hd-checkbox', className, { checked, disabled })}
			style={{ fontSize: Taro.pxTransform(fontSize || 24) }}
			onClick={handler}
		>
			{checked ? (
				<Icon checked style={style} iconClass={checkedIconClass} />
			) : (
				<Icon style={style} iconClass={uncheckIconClass} />
			)}
      {children
        ? <Label className='hd-checkbox-text'>{ children || label}</Label>
        : null}
		</View>
	)
}
export default HdCheckbox
