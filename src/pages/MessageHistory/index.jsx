import React, { Component, Fragment, } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Tag, Tooltip, Typography, } from "antd";
import { ExtTable, ExtIcon, ComboList, } from 'suid';
import moment from 'moment';
import PageWrapper from '@/components/PageWrapper';
import { constants, } from '@/utils';
import ViewDetail from './components/ViewDetail';
import styles from "./index.less";

const { NOTIFY_SERVER_PATH, } = constants;
const { Text, } = Typography;

@withRouter
@connect(({ messageHistory, loading, }) => ({ messageHistory, loading, }))
class MessageHistory extends Component {
  state = {
    showViewDetail: false,
    category: '',
  }

  reloadData = _ => {
    this.tableRef && this.tableRef.remoteDataRefresh();
  };

  handleEvent = (type, row) => {
    const { dispatch } = this.props;

    switch(type) {
      case 'view':
          dispatch({
            type: 'messageHistory/updateState',
            payload: {
              showViewDetail: true,
              rowData: row,
            }
          });
        break;
      default:
        break;
    }
  }

  handleClose = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "messageHistory/updateState",
      payload: {
        modalVisible: false,
        editData: null
      }
    });
  };

  getViewDetailProps = () => {
    const { messageHistory, dispatch, } = this.props;
    const { rowData, } = messageHistory;
    const { id, category: msgCategory, } = rowData || {};

    return {
      id,
      showHead: true,
      msgCategory,
      onBack: () => {
        dispatch({
          type: 'messageHistory/updateState',
          payload: {
            showViewDetail: false,
            rowData: null,
          }
        });
      }
    };
  }

  getCategoryComboListProps = () => {

    return  {
    //   store: {
    //      autoLoad: false,
    //      url: `${NOTIFY_SERVER_PATH}/message/getCategory`,
    //   },
      // {
      //   DingTalk: "钉钉"
      //   EMAIL: "电子邮件"
      //   MiniApp: "微信小程序"
      //   SEI_BULLETIN: "通告"
      //   SEI_MESSAGE: "站内信"
      //   SEI_REMIND: "提醒"
      //   SMS: "手机短信"
      //   WeChat: "微信"
      // },
      dataSource:[{
        remark: '全部',
        value: '',
      }, {
        remark: '电子邮件',
        value: 'EMAIL'
      }, {
        remark: '微信小程序',
        value: 'MiniApp'
      }, {
          value: 'SEI_REMIND',
          remark: '提醒'
      }, {
        remark: '手机短信',
        value: 'SMS'
      }, {
        remark: '微信',
        value: 'WeChat'
      }, {
        remark: '钉钉',
        value: 'DingTalk'
      }],
      placeholder: '请选择消息分类',
      value: '全部',
      style: {
        width: 200,
        marginRight: 10,
      },
      reader: {
        name: 'remark',
      },
      afterSelect: ({value: category }) => {
        this.setState({
          category,
        });
      }
    };
  }

  getExtableProps = () => {
    const { category, } = this.state;
    const columns = [
      {
        title: "操作",
        key: "operation",
        width: 100,
        align: "center",
        dataIndex: "id",
        className: "action",
        required: true,
        render: (_, record) => (
          <span className={cls('action-box')}>
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
          </span>
        )
      },
      {
        title: "主题",
        dataIndex: "subject",
        width: 120,
        required: true,
      },
      {
        title: "消息类型",
        dataIndex: "notifyTypeRemark",
        width: 120,
        required: true,
      },
      {
        title: "目标对象名称",
        dataIndex: "targetName",
        width: 120,
        required: true,
      },
      {
        title: "目标值",
        dataIndex: "targetValue",
        width: 220,
        required: true,
      },
      {
        title: "发布时间",
        dataIndex: "sendDate",
        width: 180,
        required: true,
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: "发送成功",
        dataIndex: "sendStatus",
        width: 80,
        required: true,
        render: text => {
          return text ? (<Tag color="green">是</Tag>) : <Tag color="red">否</Tag>
        }
      },
      {
        title: "发送日志",
        dataIndex: "sendLog",
        width: 220,
        required: true,
        render: text => {
          return text ? <Fragment><Text copyable={{ text }} /><Tooltip placeholder="topLeft" title={text}>{text}</Tooltip></Fragment> : '无';
        }
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <ComboList {...this.getCategoryComboListProps()} />
          <Button type="primary" onClick={this.reloadData}>
            刷新
          </Button>
        </Fragment>
      )
    };

    const cascadeParams = {
      filters: [],
    };
    if (category) {
      cascadeParams.filters.push(
        {
          "fieldName": "category",
          "value": category,
          "operator": "EQ",
        }
      );
    }
    return {
      cascadeParams,
      columns,
      bordered: false,
      toolBar: toolBarProps,
      remotePaging: true,
      searchProperties: ['subject', 'targetValue', 'targetName'],
      store: {
        type: 'POST',
        url: `${NOTIFY_SERVER_PATH}/messageHistory/findByPage`
      },
      sort: {
        multiple: true,
        field: { sendDate: 'desc', },
      },
    };
  };

  render() {
    const { messageHistory, } = this.props;
    const { showViewDetail, } = messageHistory;

    return (
      <React.Fragment>
        <PageWrapper className={cls({
          [styles["container-box"]]: true,
          [styles["container-box-hidden"]]: showViewDetail
        })}>
          <ExtTable onTableRef={ inst => this.tableRef=inst } {...this.getExtableProps()} />
        </PageWrapper>
        {  showViewDetail
              ? <ViewDetail {...this.getViewDetailProps()} />
              : null
          }
      </React.Fragment>
    );
  }
}

export default MessageHistory;
