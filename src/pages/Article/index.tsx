import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  DatePicker,
  Select,
  Popconfirm,
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
import { useEffect, useState } from "react";
import {
  AritcleListParams,
  deleteArticle,
  getArticleList,
  type ArticleItem,
} from "@/api/article";
// 定义封面类型
interface ArticleCover {
  images: string[]; // 封面图片数组
}
// 全局设置 dayjs 中文
dayjs.locale("zh-cn");

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ArticleFilterFormFields {
  status: 0 | 1 | 2 | 3 | 4;
  channel_id?: number;
  date?: [dayjs.Dayjs, dayjs.Dayjs]; // 日期范围，可选（dayjs 类型）
}

const Article = () => {
  const [form] = Form.useForm<ArticleFilterFormFields>();
  const navigate = useNavigate();

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
      render: (status: 0 | 1 | 2 | 3) => {
        // 定义状态映射表：key 是 status 值，value 是对应的标签配置
        const statusMap = {
          0: { text: "草稿", color: "default" },
          1: { text: "待审核", color: "warning" },
          2: { text: "审核通过", color: "success" },
          3: { text: "审核失败", color: "error" },
        };
        const { text, color } = statusMap[status];
        return <Tag color={color}>{text}</Tag>;
      },
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
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/publish?id=${record.id}`)}
            />
            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={() => handleDelete(record)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
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
  //文章列表
  const [article, setArticleList] = useState<{
    list: ArticleItem[];
    count: number;
  }>({
    list: [],
    count: 0,
  });
  //筛选功能
  const [reqData, setReqData] = useState<AritcleListParams>({
    page: 1,
    per_page: 10,
    status: "",
    channel_id: 1,
    begin_pubdate: "",
    end_pubdate: "",
  });
  //获取当前的筛选数据
  const onFinish = (formValue: ArticleFilterFormFields) => {
    console.log(formValue);
    setReqData({
      ...reqData,
      channel_id: formValue.channel_id,
      status: formValue.status === 4 ? undefined : String(formValue.status),
      begin_pubdate: formValue.date?.[0].format("YYYY-MM-DD"),
      end_pubdate: formValue.date?.[1].format("YYYY-MM-DD"),
    });
  };
  useEffect(() => {
    const getList = async () => {
      const res = await getArticleList(reqData);
      console.log(res);
      const { results, total_count } = res.data;
      setArticleList({
        list: results,
        count: total_count,
      });
    };
    getList();
  }, [reqData]);
  //分页功能
  const handlePageChange = (page: number, pageSize: number) => {
    setReqData({
      ...reqData,
      page,
      per_page: pageSize,
    });
  };
  //重置功能
  const handleReset = () => {
    form.resetFields(); // 重置表单
    setReqData({
      page: 1, // 重置分页到第一页
      per_page: 10,
      status: undefined,
      channel_id: undefined,
      begin_pubdate: undefined,
      end_pubdate: undefined,
    });
  };

  //编辑功能 跳转页面
  //删除功能
  const handleDelete = async (record: ArticleItem) => {
    await deleteArticle(record.id);
    setReqData({
      page: 1,
      per_page: 10,
    });
    console.log(data);
  };
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
          onFinish={onFinish}
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
            <Button
              htmlType="reset"
              style={{ marginLeft: 8 }}
              onChange={handleReset}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 表格区域 */}
      <Card title={`根据筛选条件共查询到 ${article.count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={article.list}
          pagination={{
            current: reqData.page,
            pageSize: reqData.per_page,
            total: article.count,
            onChange: handlePageChange,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
};

export default Article;
