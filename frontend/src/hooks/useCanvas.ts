import { useRef, useEffect } from 'react'

export const useCanvas = (draw: (context: CanvasRenderingContext2D, count: number) => void) => {

    const ref = useRef<null|HTMLCanvasElement>(null)

    useEffect(() => {

        const canvas = ref.current as HTMLCanvasElement
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        let count = 0
        let animationId = 0;

        const renderer = () => {
            count++
            draw(context, count)
            animationId = window.requestAnimationFrame(renderer)
        }
        renderer()

        return () => {
            window.cancelAnimationFrame(animationId)
        }
    }, [draw])

    return ref
}