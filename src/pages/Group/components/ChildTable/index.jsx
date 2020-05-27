import React, { Component, Fragment, } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, } from "antd";
import { isEqual,} from 'lodash';
import { ExtTable, utils, ExtIcon, } from 'suid';
import { constants } from '@/utils';
import FormModal from './Drawer';
import styles from "../../index.less";

const { authAction } = utils;
const { NOTIFY_SERVER_PATH, } = constants;


@connect(({ group, loading, }) => ({ group, loading, }))
class ChildTable extends Component {
  state = {
    delRowId: null,
    selectedRowKeys: [],
  }

  reloadData = _ => {
    const { group, } = this.props;
    const { currPRowData } = group;
    if (currPRowData) {
      this.tableRef && this.tableRef.remoteDataRefresh();
    }
  };

  handleSave = (rowData) => {
    const { dispatch, } = this.props;

    dispatch({
      type: "group/save",
      payload: rowData,
    }).then(res => {
      if (res.success) {
        this.setState({
          selectedRowKeys: [],
        });
        this.reloadData();
      }
    });
  }

  add = _ => {
    const { dispatch } = this.props;

    dispatch({
      type: 'group/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, group } = this.props;
    const { currCRowData, } = group;
    this.setState(
      {
        delRowId: record.id,
      },
      _ => {
        dispatch({
          type: 'group/delCRow',
          payload: {
            ids: [record.id],
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'group/updatePageState',
                payload: {
                  currCRowData: null,
                }
              }).then(() => {
                this.setState({
                  delRowId: null,
                });
              });
            } else {
              this.setState({
                delRowId: null,
              });
            }
            this.reloadData();
          }
        });
      },
    );
  };


  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "group/saveChild",
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'group/updatePageState',
          payload: {
            cVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  closeFormModal = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['group/delCRow'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return (
      <ExtIcon
        onClick={e => e.stopPropagation()}
        tooltip={{ title: '删除' }}
        className="del"
        type="delete"
        antd
      />
    );
  };

  getExtableProps = () => {
    const { selectedRowKeys, } = this.state;
    const { group,  } = this.props;
    const { currPRowData, } = group;
    const columns = [
      {
        title: "操作",
        key: "operation",
        width: 85,
        align: "center",
        dataIndex: "id",
        className: "action",
        required: true,
        render: (_, record) => {
          return (
            <>
              <div className="action-box" onClick={e => e.stopPropagation()}>
                {record.frozen ? null : (
                  <Popconfirm
                    key='delete'
                    placement="topLeft"
                    title="确定要删除吗？"
                    onCancel={e => e.stopPropagation()}
                    onConfirm={e => {
                      this.del(record);
                      e.stopPropagation();
                    }}
                  >
                    {this.renderDelBtn(record)}
                  </Popconfirm>
                )}
              </div>
            </>
          );
        }
      },
      {
        title: "群组项代码",
        dataIndex: "itemCode",
        width: 120,
        required: true,
      },
      {
        title: "群组项名称",
        dataIndex: "itemName",
        width: 180,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          {authAction(
            <Button
              key={'add'}
              type="primary"
              onClick={this.add}
              ignore='true'
            >
              分配
            </Button>
          )}
          <Button onClick={this.reloadData}>
            刷新
          </Button>
        </Fragment>
      )
    };
    return {
      bordered: false,
      cascadeParams: {
        groupId: currPRowData && currPRowData.id,
      },
      selectedRowKeys,
      searchProperties: ['itemCode', 'itemName'],
      onSelectRow: (selectedKeys) => {
        let tempKeys = selectedKeys;
        if (isEqual(selectedKeys, selectedRowKeys)) {
          tempKeys = []
        }
        this.setState({
          selectedRowKeys: tempKeys,
        });
      },
      columns,
      toolBar: toolBarProps,
      allowCancelSelect: true,
      store: {
        url: `${NOTIFY_SERVER_PATH}/group/getGroupItems`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, group, } = this.props;
    const { currPRowData, currCRowData, cVisible, } = group;
    return {
      onSave: this.save,
      pRowData: currPRowData,
      rowData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects["group/saveChild"]
    };
  };

  render() {
    return (
      <div className={cls(styles["container-box"])} >
        <ExtTable onTableRef={inst => this.tableRef = inst} {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default ChildTable;
