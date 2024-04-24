import { useEffect, useRef } from 'react';

export interface IImageCanvasProps {
  imageUrl: string;
}

const ImageCanvas = ({ imageUrl }: IImageCanvasProps) => {
  const canvasRef: any = useRef();

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      ctx.drawImage(image, 0, 0, 1000, 1000);
    };
  }, [imageUrl]);

  return <canvas ref={canvasRef} />;
};

export default ImageCanvas;
