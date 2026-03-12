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
  message,
} from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import {
  addArticle,
  type PublishFormFields,
  type PublishFormData,
  getArticleById,
  updateArticle,
} from "@/api/article";
import "./index.scss";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { RadioChangeEvent } from "antd/es/radio";
import type { UploadProps, UploadFile } from "antd/es/upload/interface";
import { getToken } from "@/utils/token";
import { useChannel } from "@/hooks/useChannel";
import { url } from "node:inspector";
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

  const { channelOptions } = useChannel();
  const handleFormSubmit: FormProps<PublishFormFields>["onFinish"] = (
    values,
  ) => {
    if (imageList.length !== imageType) {
      return message.warning("封面类型和封面数量不匹配");
    }
    const cover: PublishFormData = {
      type: imageType,
      images: imageList.map((item) => {
        if (item.response) {
          return item.response.data.url;
        } else {
          return item.url;
        }
      }),
    };
    const submitData: PublishFormFields = {
      ...values,
      cover,
    };
    //处理调用不同接口 新增 - 新增接口 编辑状态 - 更新接口
    if (articleId) {
      updateArticle({ ...submitData, id: articleId });
      message.success("更新文章成功");
    } else {
      addArticle(submitData);
      message.success("发布文章成功");
    }
    form.resetFields();
    setImageType(0);
    setImageList([]);
  };

  const [imageList, setImageList] = useState<UploadFile[]>([]);

  const onUploadChange: UploadProps["onChange"] = (value) => {
    setImageList(value.fileList);
  };

  const [imageType, setImageType] = useState(0);
  const onTypeChange = (e: RadioChangeEvent) => {
    setImageType(e.target.value);
  };

  //回填数据
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("id");
  useEffect(() => {
    if (!articleId) {
      console.log("无文章ID，进入新建文章模式");
      return;
    }
    const getArticle = async () => {
      const res = await getArticleById(articleId);
      console.log(res);
      form.setFieldsValue({
        ...res.data,
        type: res.data.cover.type,
      });
      setImageType(res.data.cover.type);
      setImageList(
        res.data.cover.images.map((url: Object) => {
          return { url };
        }),
      );
    };
    getArticle();
  }, [articleId, form]);
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to="/">首页</Link> },
              { title: `${articleId ? "编辑" : "发布"}文章` },
            ]}
          />
        }
      >
        <Form<PublishFormFields>
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            type: 0,
            title: "",
            content: "",
            channel_id: 0,
            cover: {
              type: imageType,
              images: imageList.map((item) => item.response?.data.url),
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
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {/* showUploadList: 控制显示上传列表 */}
            {imageType > 0 && (
              <Upload
                listType="picture-card"
                showUploadList
                action={"http://geek.itheima.net/v1_0/upload"}
                name="image"
                onChange={onUploadChange}
                maxCount={imageType}
                fileList={imageList}
                headers={{
                  Authorization: `Bearer ${getToken() || ""}`,
                }}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
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
