import {
  Card,
  Breadcrumb,
  Form,
  Input,
  Select,
  Button,
  Space,
  FormProps,
} from "antd";
import { Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import "./index.scss";

// 定义表单字段类型（强类型约束，避免字段名写错）
type PublishFormFields = {
  title: string;
  channel_id: number;
  content: string;
  type: number;
};

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
      // 使用 tinymceScriptSrc 指向 CDN，绕过 API Key 限制
      tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 360,
        menubar: false,
        statusbar: false,
        branding: false,
        promotion: false, // 隐藏升级提示
        placeholder: "请输入文章内容",
        // 移除高级插件，仅保留基础功能，避免加载失败
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

  // 可选：表单提交回调（示例，可根据业务补充）
  const handleFormSubmit: FormProps<PublishFormFields>["onFinish"] = (
    values,
  ) => {
    console.log("提交的表单数据：", values);
    // 这里对接你的发布接口
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
            channel_id: 0, // 补充初始值，避免 TS 报错
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
              // 补充 TS 类型：指定 Select 的值类型为 number
              options={[{ label: "推荐", value: 0 }]}
            />
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
