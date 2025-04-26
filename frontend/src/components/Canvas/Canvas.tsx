import {useCanvas} from "../../hooks/useCanvas.ts";

type Props = {
    draw: (context: CanvasRenderingContext2D) => void;
}

export const Canvas = (props: Props) => {

    const { draw, ...rest } = props;
    const ref = useCanvas(draw);

    return <canvas width="800" height="800" className="mapWindow" ref={ref} {...rest}/>
}