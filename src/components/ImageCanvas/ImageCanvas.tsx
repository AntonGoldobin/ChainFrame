import { useEffect, useRef } from 'react';

export interface IImageCanvasProps {
  imageUrl: string;
}

const ImageCanvas = ({ imageUrl }: IImageCanvasProps) => {
  const canvasRef: any = useRef();

  console.log(imageUrl);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
    };
  }, [imageUrl]);

  return <canvas ref={canvasRef} />;
};

export default ImageCanvas;
