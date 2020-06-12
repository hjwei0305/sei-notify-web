import React, { Component, Fragment, } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Tag, } from "antd";
import { ExtTable, ExtIcon } from 'suid';
import moment from 'moment';
import PageWrapper from '@/components/PageWrapper';
import { constants, } from '@/utils';
import ViewDetail from './components/ViewDetail';
import styles from "./index.less";

const { NOTIFY_SERVER_PATH, } = constants;

@withRouter
@connect(({ messageHistory, loading, }) => ({ messageHistory, loading, }))
class MessageHistory extends Component {
  state = {
    showViewDetail: false,
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

  getExtableProps = () => {
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
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button onClick={this.reloadData}>
            刷新
          </Button>
        </Fragment>
      )
    };
    return {
      columns,
      bordered: false,
      toolBar: toolBarProps,
      remotePaging: true,
      searchProperties: ['subject'],
      store: {
        type: 'POST',
        url: `${NOTIFY_SERVER_PATH}/messageHistory/findByPage`
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
