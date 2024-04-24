import { useConnect } from '@connect2ic/react';
import { Button, Col, Form, Input, Row, Typography, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { backend } from '../../../../declarations/backend';
import { IRustFrame } from '../../../../models/IFrame';
import * as styled from './EditFrame.styled';

export interface IEditFrameProps {
  frame?: IRustFrame;
}

export interface IEditFrameRequest {
  name: string;
  image_url: string;
}

export const EditFrame = ({ frame }: IEditFrameProps) => {
  const { principal } = useConnect();
  const [form] = useForm<IEditFrameRequest>();

  const handleCreateFrame = () => {
    if (!frame?.id) {
      message.error('No frame ID.');
      return;
    }

    if (!principal) {
      message.error('Log in first please');
    }

    form
      .validateFields()
      .then((values) => {
        const newFrame: IEditFrameRequest = {
          ...values,
        };

        backend
          .edit_frame_by_id(frame?.id, newFrame)
          .then(() => {
            message.success('Chain frame has been edited');
          })
          .catch((err) => {
            message.error('Something went wrong', err);
            console.log('err create frame request:', err);
          });
      })
      .catch((err) => message.error('Fill required fields', err));
  };

  useEffect(() => {
    form.setFieldsValue({
      name: frame?.name,
      image_url: frame?.image_url?.[0] || '',
    });
  }, [frame]);

  return (
    <>
      <Row>
        <Col span={6}>
          <styled.LeftMenu>
            <Typography.Title level={4}>Edit current frame</Typography.Title>
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
            </Form>

            <Button onClick={handleCreateFrame} type="primary">
              Save Frame
            </Button>
          </styled.LeftMenu>
        </Col>
        <Col span={18}>
          <styled.ImageContainer src={frame?.image_url[0]} />
        </Col>
      </Row>
    </>
  );
};
