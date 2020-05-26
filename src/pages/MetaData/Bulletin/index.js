import React, { Component, Fragment } from "react";
import withRouter from "umi/withRouter";
import { connect } from "dva";
import cls from "classnames";
import { Button, Popconfirm } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { isEqual } from "lodash";
import { ExtTable, utils, ExtIcon } from 'suid'
import { constants } from "@/utils";
import FormModal from "./FormModal";
import ViewDetail from "./components/ViewDetail";
import styles from "./index.less";

const { BULLETIN_BTN_KEY, NOTIFY_SERVER_PATH, MSG_CATEGORY } = constants;
const { authAction } = utils;


@withRouter
@connect(({ bulletin, loading }) => ({ bulletin, loading }))
class Bulletin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      delRowId: null
    };
  }

  componentDidUpdate(_prevProps, prevState) {
    if (!isEqual(prevState.list, this.props.bulletin.list)) {
      this.setState({
        list: this.props.bulletin.list
      });
    }
  }

  reloadData = _ => {
    this.tableRef && this.tableRef.remoteDataRefresh();
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "bulletin/save",
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: "bulletin/updateState",
          payload: {
            showModal: false
          }
        });
        this.reloadData();
      }
    });
  };

  handleEvent = (type, record) => {
    const { dispatch, } = this.props;
    switch(type) {
      case 'add':
      case 'edit':
        dispatch({
          type: "bulletin/updateState",
          payload: {
            showModal: true,
            rowData: record,
          }
        });
        break;
      case 'del':
        this.setState({
          delRowId: record.id
        }, _ => {
          dispatch({
            type: "bulletin/del",
            payload: [record.id],
          }).then(res => {
            if (res.success) {
              this.setState({
                delRowId: null
              });
              this.reloadData();
            }
          });
        });
        break;
      case 'release':
      case 'cancel':
        dispatch({
          type: "bulletin/bulletinOpt",
          payload: {
            optType: type,
            ids: [record.id],
          },
        }).then(res => {
          if (res.success) {
            this.reloadData();
          }
        });
        break;
      case 'view':
        console.log('view');
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

  closeFormModal = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "bulletin/updateState",
      payload: {
        showModal: false,
        rowData: null
      }
    });
  };

  getExtTableProps = () => {
    const { loading } = this.props;
    let { delRowId, } = this.state;
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
          const optList = [authAction(
            <ExtIcon
              key={BULLETIN_BTN_KEY.VIEW}
              className="read"
              onClick={_ => this.handleEvent('view', record)}
              type="read"
              ignore='true'
              tooltip={
                { title: '查看' }
              }
              antd
            />
          )];

          if (record.publish) {
            optList.unshift(authAction(
              <ExtIcon
                key={BULLETIN_BTN_KEY.CANCEL}
                className="undo"
                onClick={_ => this.handleEvent('cancel', record)}
                type="undo"
                ignore='true'
                tooltip={
                  { title: '撤销' }
                }
                antd
              />
            ));
          } else {
            optList.unshift(...[
              authAction(
                <ExtIcon
                  key={BULLETIN_BTN_KEY.RELEASE}
                  className="to-top"
                  onClick={_ => this.handleEvent('release', record)}
                  type="to-top"
                  ignore='true'
                  tooltip={
                    { title: '发布' }
                  }
                  antd
                />
              ),
              authAction(
                <ExtIcon
                  key={BULLETIN_BTN_KEY.EDIT}
                  className="edit"
                  onClick={_ => this.handleEvent('edit', record)}
                  type="edit"
                  ignore='true'
                  tooltip={
                    { title: '编辑' }
                  }
                  antd
                />
              ),
              authAction(
                <Popconfirm
                  key={BULLETIN_BTN_KEY.DELETE}
                  placement="topLeft"
                  ignore='true'
                  title={formatMessage({ id: "global.delete.confirm", defaultMessage: "确定要删除吗？提示：删除后不可恢复" })}
                  onConfirm={_ => this.handleEvent('del', record)}
                >
                  {
                    loading.effects["unit/del"] && delRowId === record.id
                      ? <ExtIcon className="del-loading" type="loading" antd />
                      : <ExtIcon
                          className="del"
                          type="delete"
                          antd
                          tooltip={
                            { title: '删除' }
                          }
                        />
                  }
                </Popconfirm>
              )
            ]);
          }

          return <span className={cls('action-box')}>{optList}</span>;
        }
      },
      {
        title: formatMessage({ id: "bulletin.subject", defaultMessage: "标题" }),
        dataIndex: "subject",
        width: 220,
        required: true,
      },
      {
        title: '群组',
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
      },{
        title: formatMessage({ id: "bulletin.effectiveDate", defaultMessage: "生效时间" }),
        dataIndex: "effectiveDate",
        required: true,
      },{
        title: formatMessage({ id: "bulletin.invalidDate", defaultMessage: "截止日期" }),
        dataIndex: "invalidDate",
        required: true,
      },
    ];

    const toolBarProps = {
      left: (
        <Fragment>
          {
            authAction(
              <Button
                key={BULLETIN_BTN_KEY.ADD}
                type="primary"
                onClick={_ => this.handleEvent('add', null)}
                ignore='true'
              >
                <FormattedMessage id="global.add" defaultMessage="新建" />
              </Button>
            )
          }
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </Fragment>
      )
    };

    return {
      columns,
      toolBar: toolBarProps,
      bordered: false,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${NOTIFY_SERVER_PATH}/bulletin/findByPage`,
      }
    };
  }

  getFormModalProps = () => {
    const { bulletin, loading } = this.props;
    const { showModal, rowData,  } = bulletin;

    return {
      save: this.save,
      notifyId: rowData && rowData.id,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects["bulletin/save"]
    };
  }

  getViewDetailProps = () => {
    const { bulletin, dispatch, } = this.props;
    const { rowData, } = bulletin;

    return {
      showHead: true,
      id: rowData && rowData.msgId,
      msgCategory: MSG_CATEGORY[0].value,
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

  render() {
    const { bulletin, } = this.props;
    const { showModal, showViewDetail, } = bulletin;
    return (
      <React.Fragment>
        <div className={cls(styles["container-box"])} style={{ display: showViewDetail ? 'none' : ''}}>
          <ExtTable onTableRef={inst => this.tableRef = inst} {...this.getExtTableProps()} />
          {
            showModal
              ? <FormModal {...this.getFormModalProps()} />
              : null
          }
        </div>
        {
          showViewDetail
            ? <ViewDetail {...this.getViewDetailProps()} />
            : null
        }
      </React.Fragment>
    );
  }
}

export default Bulletin;
