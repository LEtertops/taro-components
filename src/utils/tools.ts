/**
 *  节流函数
 * @param {function} 回调方法
 * @param {number} 等待时间
 */
const throttle = (fn: any, wait: number) => {
	let inThrottle = false
	let lastFn: any
	let lastTime: number
	return function () {
		const context = this
		const args = arguments
		if (!inThrottle) {
			fn.apply(context, args)
			lastTime = Date.now()
			inThrottle = true
		} else {
			clearTimeout(lastFn)
			lastFn = setTimeout(() => {
				if (Date.now() - lastTime >= wait) {
					fn.apply(context, args)
					lastTime = Date.now()
				}
			}, Math.max(wait - (Date.now() - lastTime), 0))
		}
	}
}

export const isNull = (value: any) => {
	const isEmpty = typeof value === 'string' && value === ''
	const isNaN = typeof value === 'number' && Number.isNaN(value)
	return value === null || value === undefined || isEmpty || isNaN
}

export const isNotNull = (value: any) => !isNull(value)

/**
 * 判断对象是否为空对象
 * 例：{} 返回 true，{ a: 1 } 返回 false，undefined | null | string | number 等非对象类型返回 true
 *
 * @export
 * @param {any} value -入参
 * @returns -返回true或者false
 */
export function isEmptyObj(value: any): boolean {
	if (
		typeof value === 'undefined' ||
		value === null ||
		typeof value !== 'object'
	) {
		return true
	}
	if (Object.keys(value).length > 0) {
		return false
	}
	return true
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export function debounce(func: any, wait: number, immediate?: boolean) {
	let timeout

	return function () {
		const context = this
		const args = arguments

		if (timeout) clearTimeout(timeout)
		if (immediate) {
			const callNow = !timeout
			timeout = setTimeout(() => {
				timeout = null
			}, wait)
			if (callNow) func.apply(context, args)
		} else {
			timeout = setTimeout(function () {
				func.apply(context, args)
			}, wait)
		}
	}
}

/**
 * 传递值，过滤出数据
 * @param value
 * @returns
 */
export function filterData(value?: any) {
	let result = ''
	if (value && value !== 'null' && value !== 'undefined') {
		result = value
	}
	return result
}

export function distanceFilter(value) {
	const result: any = filterData(value)
	if (result * 1 > 1) {
		return `距您${result}公里`
	} else {
		return `距您${result && result !== '0' ? result * 1000 : '-'}米`
	}
}

/**
 * 格式化销量数据
 * eg:10000下 销量9999
 * 1万上1000万下 N万+
 * 1000万上10000万下  N千万+
 * 10000万上  N亿+
 */
export function formatSaleCount(value, hideUnit?: boolean) {
	let txt = ''
	const num: number = value ? Number(value) : 0
	if (10000 < num && num < 1000000) {
		const curentNum = Math.floor((num / 10000) * 10) / 10
		txt = `${hideUnit ? '' : '销量'}${
			String(curentNum).indexOf('.') > -1 ? curentNum.toFixed(1) : curentNum
		}万+`
	} else if (1000000 < num && num < 10000000) {
		const curentNum = Math.floor((num / 1000000) * 10) / 10
		txt = `${hideUnit ? '' : '销量'}${
			String(curentNum).indexOf('.') > -1 ? curentNum.toFixed(1) : curentNum
		}百万+`
	} else if (10000000 < num && num < 100000000) {
		const curentNum = Math.floor((num / 1000000) * 10) / 10
		txt = `${hideUnit ? '' : '销量'}${
			String(curentNum).indexOf('.') > -1 ? curentNum.toFixed(1) : curentNum
		}千万+`
	} else if (100000000 < num) {
		const curentNum = Math.floor((num / 100000000) * 10) / 10
		txt = `${hideUnit ? '' : '销量'}${
			String(curentNum).indexOf('.') > -1 ? curentNum.toFixed(1) : curentNum
		}亿+`
	} else {
		txt = `${hideUnit ? '' : '销量'}${num}`
	}
	return txt
}

const colorType = (color?: string) => {
	if (typeof color !== 'string' || color.length < 4) {
		return ''
	}
	const lower = color.toLowerCase() || ''
	if (
		/^(rgba|rgb)\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0?\.\d+|1)\s*)?\)\s*/g.test(
			lower
		)
	) {
		if (lower.startsWith('rgba')) {
			return 'rgba'
		}
		return 'rgb'
	} else if (
		/^#[0-9a-fA-F]{3,6}/g.test(color) &&
		(color.length === 4 || color.length === 7)
	) {
		return 'hex'
	} else {
		return ''
	}
}
const formatHex = color =>
	color.length === 7 ? color : color.replace(/[0-9a-fA-F]/g, m => m + m)

const isHex = color => colorType(color) === 'hex'

const isRgb = color => colorType(color) === 'rgb'

const isRgba = color => colorType(color) === 'rgba'
const getColorList = color => {
	if (isRgba(color) || isRgb(color)) {
		const list = color
			.replace(/^rgba/, '')
			.replace(/^rgb/, '')
			.replace('(', '')
			.replace(')', '')
			.replace(/\s+/g, '')
			.split(',')
			.map(val => Number(val))
		if (list[3] == null) {
			list[3] = 1
		}
		return list
	} else if (isHex(color)) {
		const c = formatHex(color)
		return [
			parseInt(`0x${c.slice(1, 3)}`),
			parseInt(`0x${c.slice(3, 5)}`),
			parseInt(`0x${c.slice(5, 7)}`),
			1,
		]
	} else {
		return null
	}
}

export const rgbaToRgb = (color, bgColor?: any) => {
	if (!isRgba(color)) {
		return color
	}
	const rgba = getColorList(color)
	const alpha = rgba[3] == null ? Number(rgba[3]) : 1
	const bgList = colorType(bgColor)
		? isRgba(bgColor)
			? getColorList(rgbaToRgb(bgColor, '#ffffff'))
			: getColorList(bgColor)
		: [255, 255, 255, 1]
	const red = rgba[0] * alpha + bgList[0] * (1 - alpha)
	const green = rgba[1] * alpha + bgList[1] * (1 - alpha)
	const blue = rgba[2] * alpha + bgList[2] * (1 - alpha)
	return `rgb(${red}, ${green}, ${blue})`
}

export const isLightColor = (color, grey) => {
	if (!colorType(color)) {
		return color
	}
	const g = grey || 100
	const c = isRgba(color) ? rgbaToRgb(color) : color
	const list = getColorList(c)
	const d = list[0] * 0.299 + list[1] * 0.587 + list[2] * 0.114
	return d > g
}

export default throttle
