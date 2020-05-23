import React, { Component, Fragment } from 'react';
import cls from "classnames";
import withRouter from "umi/withRouter";
import { Radio, Button, Tag } from 'antd';
import { connect } from "dva";
import { ExtTable, ExtIcon } from 'suid'
import { formatMessage, } from "umi-plugin-react/locale";
import { constants } from "@/utils";
import ViewDetail from "./components/ViewDetail";
import styles from "./index.less";

const { NOTIFY_SERVER_PATH, TARGETTYPE_OPT, } = constants;

@withRouter
@connect(({ bulletin, loading }) => ({ bulletin, loading }))
class userBulletin extends Component {

  state = {
    isRead: '0',
  }

  handleChange = (e) => {
    this.setState({
      isRead: e.target.value,
    });
  }


  reloadData = _ => {
    this.tableRef && this.tableRef.remoteDataRefresh();
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
    const { rowData, } = bulletin;

    return {
      id: rowData && rowData.id,
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

  getExtTableProps = () => {
    const { isRead, } = this.state;
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
          return targetType[0].label;
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
        dataIndex: "releaseDate",
        required: true,
        width: 180
      },{
        title: formatMessage({ id: "bulletin.effectiveDate", defaultMessage: "生效时间" }),
        dataIndex: "effectiveDate",
        required: true,
      },{
        title: formatMessage({ id: "bulletin.invalidDate", defaultMessage: "截止日期" }),
        dataIndex: "invalidDate",
        required: true,
      },{
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

    const toolBarProps = {
      left: (
        <Fragment>
            <Radio.Group defaultValue="0" onChange={this.handleChange}>
              <Radio.Button value="">全部</Radio.Button>
              <Radio.Button value="1">已读</Radio.Button>
              <Radio.Button value="0">未读</Radio.Button>
            </Radio.Group>
            <Button
              type='primary'
              style={{
                marginLeft: 10,
              }}
              onClick={() => {
                this.reloadData();
              }}
            >
              刷新
            </Button>
        </Fragment>
      )
    };
    const cascadeParams = {};
    if(isRead) {
      cascadeParams.filters = [
        {
          "fieldName": "read",
          "value": '1',
          "operator": isRead === '1' ? "EQ" : "NU",
          "fieldType": "bool"
        }
      ];
    }
    return {
      columns,
      cascadeParams,
      toolBar: toolBarProps,
      searchProperties: ['subject'],
      bordered: false,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${NOTIFY_SERVER_PATH}/bulletinMsg/findBulletinByPage4User`,
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
