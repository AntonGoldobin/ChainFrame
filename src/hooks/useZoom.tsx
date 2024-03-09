import { useEffect, useRef, useState } from 'react'

export interface IUseZoomProps {
	isZoomEnabled: boolean
	initScale: number
	initTranslateX: number
	initTranslateY: number
}

export const useZoom = ({
	isZoomEnabled,
	initScale,
	initTranslateX,
	initTranslateY,
}: IUseZoomProps) => {
	const [styles, setStyles] = useState<React.CSSProperties>({
		position: 'absolute',
		transformOrigin: '0 0',
		transition: 'transform 10ms ease-in-out',
		maxWidth: 1000,
		minWidth: 100,
		// Возможно нужно будет удалить
		top: 0,
		left: 0,
	})
	const elementRef: any = useRef(null)

	let currentScale = initScale

	let translateX = initTranslateX
	let translateY = initTranslateY

	const factor = 1

	const zoom = (nextScale: number, event: any) => {
		const ratio = 1 - nextScale / currentScale

		const { clientX, clientY } = event

		translateX += (clientX - translateX) * ratio
		translateY += (clientY - translateY) * ratio

		const transform = `translate(${translateX}px, ${translateY}px) scale(${nextScale})`

		setStyles((prev) => ({ ...prev, transform }))
		currentScale = nextScale
	}

	const onWheel = (e: any) => {
		e.preventDefault()

		if (!isZoomEnabled) {
			return
		}

		if (!elementRef.current) {
			return
		}

		const img: any = elementRef.current

		const imgScaleCoef =
			img.getBoundingClientRect().width / (img?.width || 100) / 2

		const delta = e.deltaY / 700
		const nextScale = currentScale + delta * factor * imgScaleCoef

		zoom(nextScale, e)
	}

	useEffect(() => {
		const element = elementRef.current

		if (!element) {
			return
		}

		element.addEventListener('wheel', onWheel, {
			passive: false,
		})
		return () => {
			element.removeEventListener('wheel', onWheel)
		}
	}, [isZoomEnabled])

	return { elementRef, styles }
}
