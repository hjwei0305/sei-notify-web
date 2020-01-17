import React, { Component, Fragment } from "react";
import withRouter from "umi/withRouter";
import { connect } from "dva";
import cls from "classnames";
import { Button, Popconfirm } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import isEqual from "react-fast-compare";
import { ResizeMe, ExtTable, PageLoader, utils, ExtIcon } from 'seid'
import { constants } from "@/utils";
import FormModal from "./FormModal";
import styles from "./index.less";

const { UNIT_BTN_KEY } = constants;
const { authAction } = utils;


@withRouter
@ResizeMe()
@connect(({ notifyContent, loading }) => ({ notifyContent, loading }))
class NotifyContent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      delRowId: null
    };
  }

  componentDidUpdate(_prevProps, prevState) {
    if (!isEqual(prevState.list, this.props.notifyContent.list)) {
      this.setState({
        list: this.props.notifyContent.list
      });
    }
  }

  reloadData = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "notifyContent/queryList"
    });
  };

  add = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "notifyContent/updateState",
      payload: {
        showModal: true,
        rowData: null
      }
    });
  };

  edit = record => {
    const { dispatch } = this.props;
    dispatch({
      type: "notifyContent/editNotify",
      payload: {
        id: record.id,
      }
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "notifyContent/save",
      payload: {
        data
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: "notifyContent/updateState",
            payload: {
              showModal: false
            }
          });
          this.reloadData();
        }
      }
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState({
      delRowId: record.id
    }, _ => {
      dispatch({
        type: "notifyContent/del",
        payload: {
          id: record.id
        },
        callback: res => {
          if (res.successful) {
            this.setState({
              delRowId: null
            });
            this.reloadData();
          }
        }
      });
    });
  };

  closeFormModal = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "notifyContent/updateState",
      payload: {
        showModal: false,
        rowData: null
      }
    });
  };

  render() {
    const { notifyContent, loading } = this.props;
    let { delRowId, list } = this.state;
    if(!list){
      list = [];
    }
    const { showModal, rowData } = notifyContent;
    const columns = [
      {
        title: formatMessage({ id: "notifyContent.operation", defaultMessage: "操作" }),
        key: "operation",
        width: 100,
        align: "center",
        dataIndex: "id",
        className: "action",
        required: true,
        render: (text, record) => (
          <span className={cls("action-box")}>
            {
              authAction(
                <ExtIcon
                  key={UNIT_BTN_KEY.EDIT}
                  className="edit"
                  onClick={_ => this.edit(record)}
                  type="edit"
                  ignore='true'
                  antd
                />
              )
            }
            {
              authAction(
                <Popconfirm
                  key={UNIT_BTN_KEY.DELETE}
                  placement="topLeft"
                  ignore='true'
                  title={formatMessage({ id: "notifyContent.delete.confirm", defaultMessage: "确定要删除吗？提示：删除后不可恢复" })}
                  onConfirm={_ => this.del(record)}
                >
                  {
                    loading.effects["notifyContent/del"] && delRowId === record.id
                      ? <ExtIcon className="del-loading" type="loading" antd />
                      : <ExtIcon className="del" type="delete" antd />
                  }
                </Popconfirm>
              )
            }
          </span>
        )
      },
      {
        title: formatMessage({ id: "notifyContent.code", defaultMessage: "代码" }),
        key: "code",
        dataIndex: "code",
        width: 120,
        required: true,
      },
      {
        title: formatMessage({ id: "notifyContent.name", defaultMessage: "名称" }),
        key: "name",
        dataIndex: "name",
        width: 220,
        required: true,
      },
      {
        title: formatMessage({ id: "notifyContent.content", defaultMessage: "内容" }),
        key: "content",
        dataIndex: "content",
        className: "content",
        width: 450,
      }
    ];
    const formModalProps = {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects["notifyContent/save"]
    };
    const toolBarProps = {
      left: (
        <Fragment>
          {
            authAction(
              <Button
                key={UNIT_BTN_KEY.CREATE}
                type="primary"
                onClick={this.add}
                ignore='true'
              >
                <FormattedMessage id="notifyContent.add" defaultMessage="新建" />
              </Button>
            )
          }
          <Button onClick={this.reloadData}>
            <FormattedMessage id="notifyContent.refresh" defaultMessage="刷新" />
          </Button>
        </Fragment>
      ),
    };
    return (
      <div className={cls(styles["container-box"])} >
        {
          loading.effects["notifyContent/queryList"]
            ? <PageLoader />
            : null
        }
        <ExtTable
          toolBar={toolBarProps}
          rowKey={record => record.id}
          columns={columns}
          dataSource={list}
        />
        {
          showModal
            ? <FormModal {...formModalProps
            } />
            : null
        }
      </div>
    );
  }
}

export default NotifyContent;
