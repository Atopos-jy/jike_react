import { Link } from "react-router-dom";
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  DatePicker,
  Select,
} from "antd";
// 改用 dayjs 中文语言包
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import "./index.scss";

import { Table, Tag, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import img404 from "@/assets/error.png";
import type { ColumnsType } from "antd/es/table";
import { useChannel } from "@/hooks/useChannel";

// 定义封面类型
interface ArticleCover {
  images: string[]; // 封面图片数组
}

// 定义文章列表项类型
interface ArticleItem {
  id: string;
  comment_count: number;
  cover: ArticleCover;
  like_count: number;
  pubdate: string;
  read_count: number;
  status: 0 | 1 | 2 | 3 | 4;
  title: string;
}
// 全局设置 dayjs 中文
dayjs.locale("zh-cn");

const { Option } = Select;
const { RangePicker } = DatePicker;

const Article = () => {
  const columns: ColumnsType<ArticleItem> = [
    {
      title: "封面",
      dataIndex: "cover",
      width: 120,
      render: (cover: ArticleCover) => {
        const coverUrl = cover?.images?.[0] || img404;
        return <img src={coverUrl} width={80} height={60} alt="" />;
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      width: 220,
    },
    {
      title: "状态",
      dataIndex: "status",
      // 明确 status 参数类型
      render: (status: 0 | 1 | 2 | 3) => <Tag color="green">审核通过</Tag>,
    },
    {
      title: "发布时间",
      dataIndex: "pubdate",
    },
    {
      title: "阅读数",
      dataIndex: "read_count",
    },
    {
      title: "评论数",
      dataIndex: "comment_count",
    },
    {
      title: "点赞数",
      dataIndex: "like_count",
    },
    {
      title: "操作",
      render: (_: any, record: ArticleItem) => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            />
          </Space>
        );
      },
    },
  ];

  const data: ArticleItem[] = [
    {
      id: "8218",
      comment_count: 0,
      cover: {
        images: ["http://geek.itheima.net/resources/images/15.jpg"],
      },
      like_count: 0,
      pubdate: "2019-03-11 09:00:00",
      read_count: 2,
      status: 2,
      title: "wkwebview离线化加载h5资源解决方案",
    },
  ];
  const { channelOptions } = useChannel();

  return (
    <div className="article-page">
      <Card
        title={
          <Breadcrumb
            separator=">"
            items={[
              { title: <Link to="/home">首页</Link> }, // 支持嵌套 Link 组件
              { title: "内容管理" },
              { title: "文章列表" },
            ]}
          />
        }
        style={{ marginBottom: 20 }}
      >
        <Form
          initialValues={{ status: 4 }}
          layout="inline"
          style={{ display: "flex", alignItems: "center", gap: 16 }}
        >
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={4}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 160 }}
              allowClear
            >
              {channelOptions.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            <RangePicker
              locale={locale}
              placeholder={["开始日期", "结束日期"]}
              allowClear
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              筛选
            </Button>
            <Button htmlType="reset" style={{ marginLeft: 8 }}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 表格区域 */}
      <Card title={`根据筛选条件共查询到 count 条结果：`}>
        <Table rowKey="id" columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Article;
