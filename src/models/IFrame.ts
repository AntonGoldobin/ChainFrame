export interface IFrame {
  id: number;
  imageUrl: string;
  top: number;
  left: number;
  width: number;
  height: number;
  childrenIds?: number[];
}

export interface IFrameCreateRequest {
  top: number;
  left: number;
  width: number;
  height: number;
}
