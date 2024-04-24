import { Principal } from '@dfinity/principal';

export interface IFrame {
  id: number;
  image_url: string[];
  top: number;
  left: number;
  width: number;
  height: number;
  owner: Principal;
  children_ids: any[];
  name: string;
}

export interface IRustFrame {
  id: bigint;
  image_url: string[];
  top: number;
  left: number;
  width: number;
  height: number;
  owner: Principal;
  children_ids: any[];
  name: string;
}

export interface IFrameCreateRequest {
  top: number;
  left: number;
  width: number;
  height: number;
  owner: string;
  parent_id: bigint;
  name: string;
  image_url: string;
}

export interface IFrameEditRequest {
  image_url?: string;
  name: string;
}
