/**
 * 数字输入框
 */
import cls from 'classnames'
import './index.scss'
import { debounce } from '../../utils/tools'
import { useMemo, useState } from 'react'
import { View, Text, Input } from '@tarojs/components'

/**
 * props属性
 */
interface IProps {
	// 绑定值
	value: number
	// 设置计数器允许的最小值
	min?: number
	// 设置计数器允许的最大值
	max?: number
	// 计数器步长 默认值：1
	step?: number
	// 是否只能输入 step 的倍数
	stepStrictly?: boolean
	// 数值精度
	precision?: number
	// 是否禁用计数器
	disabled?: boolean
	// 是否禁用计数器
	fitContent?: boolean
	// 是否使用控制按钮
	controls?: boolean
	// 输入框默认 placeholder
	placeholder?: string
	onChange?: (value?: number) => void
	minTrigger?: (value: number, disabled: boolean) => void
	maxTrigger?: (value: number, disabled: boolean) => void
	className?: string
	inputProps?: any
	type?: 'number' | 'digit'
	style?: string | object
	[key: string]: any
}

const toPrecision = (num: number, precision: number) => {
	return parseFloat(
		String(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision))
	)
}

const debounceDo: (cb: any) => void = debounce(
	(cb: any) => {
		if (typeof cb === 'function') {
			cb()
		}
	},
	512,
	false
)

/**
 * 组件内部属性
 */

const HdInputNumber = (props: IProps) => {
	const { controls = true, inputProps, placeholder } = props
	const { className, style, maxTrigger, minTrigger, onChange } = props
	const { disabled, value, precision, stepStrictly, fitContent } = props
	const { type = 'number', step = 1, max = Infinity, min = -Infinity } = props
	const [userInput, setUserInput] = useState<number | null>(null)
	const maxDisabled = useMemo(() => {
		return disabled || Number(value) >= Number(max)
	}, [value, max, disabled])
	const minDisabled = useMemo(() => {
		return disabled || Number(value) <= Number(min)
	}, [value, min, disabled])
	const displayValue = useMemo(() => {
		if (userInput != null) {
			return userInput
		}
		return value
	}, [value, userInput])

	const maxHandler = (val?: number) => {
		if (typeof maxTrigger === 'function') {
			maxTrigger(val || value, disabled || maxDisabled)
		}
	}

	const minHandler = (val?: number) => {
		if (typeof minTrigger === 'function') {
			minTrigger(val || value, disabled || minDisabled)
		}
	}

	const changeHandler = (val?: number) => {
		if (typeof onChange === 'function') {
			onChange(val)
		}
	}
	const getPrecision = (val?: number) => {
		if (val === undefined) {
			return 0
		}
		const valueString = val.toString()
		const dotPosition = valueString.indexOf('.')
		let temp = 0
		if (dotPosition !== -1) {
			temp = valueString.length - dotPosition - 1
		}
		return temp
	}
	const numPrecision = useMemo(() => {
		const stepPrecision = getPrecision(step)
		if (precision !== undefined) {
			if (stepPrecision > precision) {
				console.warn('[提示][InputNumber]precision应该大于step的小数位数')
			}
			return precision
		} else {
			return Math.max(getPrecision(value), stepPrecision)
		}
	}, [value, step, precision])
	const _increase = val => {
		if (typeof val !== 'number' && val !== undefined) {
			return value
		}
		const precisionFactor = Math.pow(10, numPrecision)
		return toPrecision(
			(precisionFactor * val + precisionFactor * step) / precisionFactor,
			numPrecision
		)
	}
	const _decrease = val => {
		if (typeof val !== 'number' && val !== undefined) {
			return value
		}
		const precisionFactor = Math.pow(10, numPrecision)
		return toPrecision(
			(precisionFactor * val - precisionFactor * step) / precisionFactor,
			numPrecision
		)
	}
	const increase = () => {
		debugger
		if (maxDisabled) {
			maxHandler()
		} else {
			const newVal = _increase(value || 0)
			changeHandler(newVal)
		}
	}
	const decrease = () => {
		if (minDisabled) {
			minHandler()
		} else {
			const newVal = _decrease(value || 0)
			changeHandler(newVal)
		}
	}

	const delayInitUserInput = () => {
		debounceDo(() => {
			setUserInput(null)
		})
	}

	const inputHandler = e => {
		const edv = e.detail.value
		setUserInput(edv)
		let newVal = edv === undefined ? value : Number(edv)
		debugger
		if (newVal !== undefined) {
			// eslint-disable-next-line
			if (isNaN(newVal)) {
				changeHandler(value)
				return delayInitUserInput()
			}
			if (stepStrictly) {
				const stepPrecision = getPrecision(step)
				const precisionFactor = Math.pow(10, stepPrecision)
				newVal =
					(Math.round(newVal / step) * precisionFactor * step) / precisionFactor
			}

			if (precision !== undefined) {
				newVal = toPrecision(newVal, precision)
			}
			if (newVal >= max) {
				newVal = max
				maxHandler(newVal)
			}
			if (newVal <= min) {
				newVal = min
				minHandler(newVal)
			}
			changeHandler(newVal)
		}
		return delayInitUserInput()
	}
	return (
		<View
			style={style}
			className={cls(className, 'hd-input-number', {
				'is-disabled': disabled,
				'hd-input-number-fit-content': fitContent,
			})}
		>
			{controls ? (
				<View
					className={cls('hd-input-number-decrease', {
						'is-disabled': minDisabled,
					})}
					onClick={decrease}
				>
					<Text className='iconfont'>&#xe6f3;</Text>
				</View>
			) : null}
			<View className={cls('hd-input')}>
				<Input
					value={displayValue}
					{...inputProps}
					type={type}
					placeholder={placeholder || ''}
					className={cls('hd-input-inner')}
					onInput={inputHandler}
				/>
				{fitContent ? (
					<View className='hd-input-block'>{displayValue}</View>
				) : null}
			</View>
			{controls ? (
				<View
					className={cls('hd-input-number-increase', {
						'is-disabled': maxDisabled,
					})}
					onClick={increase}
				>
					<Text className='iconfont'>&#xe6ee;</Text>
				</View>
			) : null}
		</View>
	)
}

export default HdInputNumber
