import { useConnect } from '@connect2ic/react';
import { Button, Col, Form, Input, Row, Typography, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { backend } from '../../../../declarations/backend';
import { IFrameCreateRequest, IRustFrame } from '../../../../models/IFrame';
import * as styled from './AddNewChainFrame.styled';

export interface IAddNewChainFrameProps {
  frame?: IRustFrame;
}

interface IAddNewForm {
  name: string;
  image_url: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

export const AddNewChainFrame = ({ frame }: IAddNewChainFrameProps) => {
  const [crop, setCrop] = useState<Crop>();
  const { principal } = useConnect();
  const [form] = useForm<IAddNewForm>();

  const handleCreateFrame = async () => {
    if (!crop) {
      message.error(
        'Please select a part of the frame for creating a new frame.',
      );
      return;
    }

    if (!principal) {
      message.error('Log in first please');
    }

    if (!frame?.id) {
      message.error('No frame ID.');
      return;
    }

    form
      .validateFields()
      .then((values) => {
        const newFrame: IFrameCreateRequest = {
          ...values,
          owner: principal,
          parent_id: BigInt(frame?.id),
        };

        backend
          .insert_frame(newFrame)
          .then((childId: BigInt) => {
            setCrop(undefined);
            form.resetFields();
            message.success(
              'Chain frame has been created: id: ' + Number(childId),
            );
          })
          .catch((err) => {
            message.error('Something went wrong', err);
            console.log('err create frame request:', err);
          });
      })
      .catch((err) => message.error('Fill required fields', err));
  };

  const handleChangeCrop = (crop: PixelCrop) => {
    setCrop(crop);

    const sizeData = {
      top: Math.floor(crop.y),
      left: Math.floor(crop.x),
      width: Math.floor(crop.width),
      height: Math.floor(crop.height),
    };

    form.setFieldsValue(sizeData);
  };

  return (
    <>
      <Row>
        <Col span={6}>
          <styled.LeftMenu>
            <Typography.Title level={4}>Add new chain frame</Typography.Title>
            <Form layout="vertical" form={form}>
              <Form.Item
                name="name"
                label="Frame Name"
                rules={[{ required: true, message: 'Please fill name' }]}
              >
                <Input placeholder="Frame Name" />
              </Form.Item>
              <Form.Item
                name="image_url"
                label="Image Url"
                rules={[{ required: true, message: 'Please fill url' }]}
              >
                <Input placeholder="https://..." />
              </Form.Item>
              <Form.Item name="width" rules={[{ required: true }]} noStyle />
              <Form.Item name="height" rules={[{ required: true }]} noStyle />
              <Form.Item name="top" rules={[{ required: true }]} noStyle />
              <Form.Item name="left" rules={[{ required: true }]} noStyle />
            </Form>

            <Button onClick={handleCreateFrame} type="primary">
              Create Frame
            </Button>
          </styled.LeftMenu>
        </Col>
        <Col span={18}>
          <ReactCrop crop={crop} onChange={handleChangeCrop} aspect={1}>
            <styled.ImageContainer src={frame?.image_url[0]} />
          </ReactCrop>
        </Col>
      </Row>
    </>
  );
};
