import React, { Component, Fragment } from "react";
import withRouter from "umi/withRouter";
import { connect } from "dva";
import cls from "classnames";
import { Button, Popconfirm, Tag } from "antd";
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
@connect(({ bulletin, loading }) => ({ bulletin, loading }))
class Bulletin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      delRowId: null
    };
  }

  componentDidUpdate(_prevProps, prevState) {
    console.log("我的数据ne",this.props.bulletin,this.props.bulletin.list);
    if (!isEqual(prevState.list, this.props.bulletin.list)) {
      this.setState({
        list: this.props.bulletin.list
      });
    }
  }

  reloadData = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "bulletin/queryList"
    });
  };

  add = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "bulletin/updateState",
      payload: {
        showModal: true,
        rowData: null
      }
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: "bulletin/updateState",
      payload: {
        showModal: true,
        rowData: rowData
      }
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "bulletin/save",
      payload: {
        data
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: "bulletin/updateState",
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
        type: "bulletin/del",
        payload: {
          id: record.id
        },
        callback: res => {
          if (res.success) {
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
      type: "bulletin/updateState",
      payload: {
        showModal: false,
        rowData: null
      }
    });
  };

  render() {
    const { bulletin, loading } = this.props;
    const { delRowId, list } = this.state;
    const { showModal, rowData } = bulletin;
    const columns = [
      {
        title: formatMessage({ id: "global.operation", defaultMessage: "操作" }),
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
                  title={formatMessage({ id: "global.delete.confirm", defaultMessage: "确定要删除吗？提示：删除后不可恢复" })}
                  onConfirm={_ => this.del(record)}
                >
                  {
                    loading.effects["unit/del"] && delRowId === record.id
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
        title: "标题",
        key: "subject",
        dataIndex: "subject",
        width: 120,
        required: true,
      },
      {
        title: "发布类型",
        key: "targetTypeRemark",
        dataIndex: "targetTypeRemark",
        required: true,
      },
      {
        title: "类型值",
        key: "tagName",
        dataIndex: "tagName",
        className: "tagName",
      },
      {
        title: "优先级",
        key: "priorityRemark",
        dataIndex: "priorityRemark",
        required: true,
      },{
        title: "发布时间",
        key: "releaseDate",
        dataIndex: "releaseDate",
        required: true,
      },{
        title: "生效日期",
        key: "effectiveDate",
        dataIndex: "effectiveDate",
        required: true,
      },{
        title: "截止日期",
        key: "invalidDate",
        dataIndex: "invalidDate",
        required: true,
      },
    ];
    const formModalProps = {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects["bulletin/save"]
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
    return (
      <div className={cls(styles["container-box"])} >
        {
          loading.effects["bulletin/queryList"]
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

export default Bulletin;
