export interface IFrame {
  id: number;
  image_url: string[];
  top: number;
  left: number;
  width: number;
  height: number;
  children_ids: any[];
}

export interface IFrameCreateRequest {
  top: number;
  left: number;
  width: number;
  height: number;
}
