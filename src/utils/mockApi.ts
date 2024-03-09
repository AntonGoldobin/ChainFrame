import { IFrame } from '../models/IFrame';

const mockFrames: IFrame[] = [
  {
    id: 1,
    imageUrl:
      'https://i.pinimg.com/originals/1b/28/f3/1b28f35fc24c2d3fc7a59bb6ab772abb.jpg',
    top: 0,
    left: 0,
    width: 500,
    height: 500,
    childrenIds: [2],
  },
  {
    id: 2,
    imageUrl:
      'https://i.pinimg.com/736x/a3/fd/56/a3fd56c8c2fe68d71953ef48b5e48c45.jpg',
    top: 630,
    left: 1668,
    width: 50,
    height: 50,
    childrenIds: [3],
  },
  {
    id: 3,
    imageUrl:
      'https://i.pinimg.com/originals/1b/28/f3/1b28f35fc24c2d3fc7a59bb6ab772abb.jpg',
    top: 490,
    left: 291,
    width: 50,
    height: 50,
    childrenIds: [],
  },
];

export const getFrameById = (id: number): Promise<IFrame> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const currentFrame = mockFrames.find((frame) => {
        console.log(frame.id, id);
        return frame.id === id;
      });
      if (currentFrame) {
        resolve(currentFrame);
      } else {
        reject(new Error('Frame not found'));
      }
    }, 1000);
  });
};
