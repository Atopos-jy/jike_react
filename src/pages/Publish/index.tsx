import {
  Card,
  Breadcrumb,
  Form,
  Input,
  Select,
  Radio,
  Upload,
  Button,
  Space,
  FormProps,
} from "antd";
import { Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import {
  addArticle,
  getChannel,
  type ChannelItem,
  type PublishFormFields,
} from "@/api/article";
import "./index.scss";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd/es/upload/interface";
// 封装 TinyMCE 组件，适配 Antd Form 的 value/onChange 接口
const TEditor = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (content: string) => void;
}) => {
  return (
    <Editor
      tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 360,
        menubar: false,
        statusbar: false,
        branding: false,
        promotion: false,
        placeholder: "请输入文章内容",
        plugins: ["lists", "link", "table", "code", "wordcount"],
        toolbar:
          "blocks | bold italic underline | link | bullist numlist | removeformat",
        content_style:
          'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; font-size: 14px; }',
        paste_data_images: false,
      }}
    />
  );
};

const Publish: React.FC = () => {
  // 给 Form 绑定强类型，指定表单字段类型
  const [form] = Form.useForm<PublishFormFields>();

  const [channelOptions, setChannelOptions] = useState<ChannelItem[]>([]);
  useEffect(() => {
    const getChannelList = async () => {
      const res = await getChannel();
      setChannelOptions(res.data.channels);
    };
    getChannelList();
  }, []);
  const handleFormSubmit: FormProps<PublishFormFields>["onFinish"] = (
    values,
  ) => {
    addArticle(values);
    console.log(values);
  };

  const [imageList, setImageList] = useState<UploadFile[]>([]);

  const onUploadChange: UploadProps["onChange"] = (value) => {
    console.log(value);

    setImageList(value.fileList);
  };
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[{ title: <Link to="/">首页</Link> }, { title: "发布文章" }]}
          />
        }
      >
        <Form<PublishFormFields>
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            type: 1,
            content: "",
            channel_id: 0,
            cover: {
              type: 0,
              images: [],
            },
          }}
          onFinish={handleFormSubmit} // 绑定提交回调
          autoComplete="off"
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input
              placeholder="请输入文章标题"
              style={{ width: 400 }}
              maxLength={100} // 可选：限制标题长度
            />
          </Form.Item>

          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select
              placeholder="请选择文章频道"
              style={{ width: 400 }}
              options={channelOptions.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group>
                <Radio value={1}>单图</Radio>
                <Radio value={2}>三图</Radio>
                <Radio value={3}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            <Upload
              listType="picture-card"
              showUploadList
              action={"http://geek.itheima.net/v1_0/upload"}
              name="image"
              onChange={onUploadChange}
            >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
            {/* 使用封装后的编辑器组件，自动接管 value 和 onChange */}
            <TEditor />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
              <Button size="large" htmlType="reset">
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;
