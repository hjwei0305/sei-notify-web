import React, { Component, Fragment } from 'react';
import cls from "classnames";
import withRouter from "umi/withRouter";
import { Radio, Button, Tag, Select, Icon, Dropdown, Menu, message, } from 'antd';
import { connect } from "dva";
import { ExtTable, ExtIcon } from 'suid'
import queryString from "query-string";
import { formatMessage, } from "umi-plugin-react/locale";
import { constants } from "@/utils";
import ViewDetail from "./components/ViewDetail";
import styles from "./index.less";

const { NOTIFY_SERVER_PATH, TARGETTYPE_OPT, MSG_CATEGORY, } = constants;

@withRouter
@connect(({ bulletin, loading }) => ({ bulletin, loading }))
class userBulletin extends Component {

  constructor(props) {
    super(props);
    this.params = queryString.parse(window.location.href.split('?')[1]);
    this.state = {
      isRead: '0',
      category: this.params.category || MSG_CATEGORY[0].value,
    }
  }


  handleChange = (e) => {
    this.setState({
      isRead: e.target.value,
    });
  }


  reloadData = _ => {
    this.tableRef && this.tableRef.remoteDataRefresh();
  }

  handleCategoryChange = (category) => {
    this.setState({
      category,
    }, () => {
      this.reloadData();
    });
  }

  handleEvent = (type, record) => {
    const { dispatch, } = this.props;
    switch(type) {
      case 'view':
        dispatch({
          type: 'bulletin/updateState',
          payload: {
            showViewDetail: true,
            rowData: record,
          }
        });
        break;
      default:
        break;
    }
  }

  getViewDetailProps = () => {
    const { bulletin, dispatch, } = this.props;
    const { category: msgCategory, } = this.state;
    const { rowData, } = bulletin;
    const { id, } = rowData || {};

    return {
      id,
      showHead: true,
      msgCategory,
      onBack: () => {
        dispatch({
          type: 'bulletin/updateState',
          payload: {
            showViewDetail: false,
            rowData: null,
          }
        });
      }
    };
  }

  handleMenuClick = ({ key }) => {
    if(this.selectRowKeys && this.selectRowKeys.length) {

      const { dispatch } = this.props;

      dispatch({
        type: `bulletin/${key}`,
        payload: this.selectRowKeys,
      }).then(success => {
        if(success) {
          this.tableRef && this.tableRef.manualSelectedRows([])
          this.reloadData();
        }
      })
    } else {
      message.warn('请选择需要操作的消息');
    }
  }

  getExtTableProps = () => {
    const { isRead, category } = this.state;
    const columns = [
      {
        title: formatMessage({ id: "global.operation", defaultMessage: "操作" }),
        key: "operation",
        width: 160,
        align: "center",
        dataIndex: "id",
        className: "action",
        required: true,
        render: (text, record) => {

          return <span className={cls('action-box')}>
            <ExtIcon
              className="read"
              onClick={_ => this.handleEvent('view', record)}
              type="read"
              ignore='true'
              tooltip={
                { title: '查看' }
              }
              antd
            />
          </span>;
        }
      },
      {
        title: formatMessage({ id: "bulletin.subject", defaultMessage: "标题" }),
        dataIndex: "subject",
        width: 220,
        required: true,
      },
      {
        title: formatMessage({ id: "bulletin.targetType", defaultMessage: "发布类型" }),
        dataIndex: "targetType",
        required: true,
        render: (text) => {
          const targetType = TARGETTYPE_OPT.filter(item => item.value === text);
          if (targetType.length) {
            return targetType[0].label;
          }
          return text;
        }
      },
      {
        title: formatMessage({ id: "bulletin.tagName", defaultMessage: "类型值" }),
        width: 220,
        dataIndex: "targetName",
        className: "targetName",
      },
      {
        title: formatMessage({ id: "bulletin.priority", defaultMessage: "优先级" }),
        dataIndex: "priorityRemark",
        required: true,
      },{
        title: formatMessage({ id: "bulletin.releaseDate", defaultMessage: "发布时间" }),
        dataIndex: "publishDate",
        required: true,
        width: 180
      },
      // {
      //   title: formatMessage({ id: "bulletin.effectiveDate", defaultMessage: "生效时间" }),
      //   dataIndex: "effectiveDate",
      //   required: true,
      // },{
      //   title: formatMessage({ id: "bulletin.invalidDate", defaultMessage: "截止日期" }),
      //   dataIndex: "invalidDate",
      //   required: true,
      // },
      {
        title: '是否已读',
        width: 120,
        dataIndex: 'read',
        align: 'center',
        render: (isReaded) => {
          return (
            isReaded ? <Tag color="red">已读</Tag> : <Tag color="green">未读</Tag>
          );
        }
      }

    ];

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="unreadSelected">
          未读
        </Menu.Item>
        <Menu.Item key="readSelected">
          已读
        </Menu.Item>
      </Menu>
    );

    const toolBarProps = {
      left: (
        <Fragment>
            <Select
              placeholder="消息类型"
              value={category}
              style={{
                marginRight: 10,
              }}
              onChange={this.handleCategoryChange}
            >
              {MSG_CATEGORY.map(item => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
            </Select>
            <Radio.Group defaultValue="0" onChange={this.handleChange}>
              <Radio.Button value="">全部</Radio.Button>
              <Radio.Button value="1">已读</Radio.Button>
              <Radio.Button value="0">未读</Radio.Button>
            </Radio.Group>
            <Dropdown
              overlay={(menu)}
            >
              <Button
                style={{
                  marginLeft: 10,
                }}
              >
                标记为 <Icon type="down" />
              </Button>
            </Dropdown>
            <Button
              type='primary'
              onClick={() => {
                this.reloadData();
              }}
            >
              刷新
            </Button>
        </Fragment>
      )
    };
    const cascadeParams = {
      filters: [],
    };
    cascadeParams.filters.push(
      {
        "fieldName": "category",
        "value": category,
        "operator": "EQ",
      }
    );
    if(isRead) {
      cascadeParams.filters.push(
        {
          "fieldName": "read",
          "value": '1',
          "operator": isRead === '1' ? "EQ" : "NU",
          "fieldType": "bool"
        }
      );
    }
    return {
      columns,
      cascadeParams,
      toolBar: toolBarProps,
      searchProperties: ['subject'],
      bordered: false,
      checkbox: true,
      remotePaging: true,
      onSelectRow: (keys, rows) => {
        this.selectRowKeys = keys;
      },
      store: {
        type: 'POST',
        url: `${NOTIFY_SERVER_PATH}/message/findMessageByPage`,
      }
    };
  }

  render() {
    const { bulletin, } = this.props;
    const { showViewDetail, } = bulletin;

    return (
      <Fragment>
        <div className={cls(styles["container-box"])} style={{ display: showViewDetail ? 'none' : ''}}>
          <ExtTable onTableRef={inst => this.tableRef = inst} {...this.getExtTableProps()} />
        </div>
        {  showViewDetail
            ? <ViewDetail {...this.getViewDetailProps()} />
            : null
        }
      </Fragment>
    );
  }
}

export default userBulletin;
