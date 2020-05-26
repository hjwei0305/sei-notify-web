import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Tag, Tooltip } from 'antd';
import { utils, ExtIcon, ExtTable, } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { authAction } = utils;
const { NOTIFY_SERVER_PATH, } = constants;

@connect(({ group, loading }) => ({ group, loading }))
class CascadeTableMaster extends Component {
  state = {
    delRowId: null,
    selectedRowKeys: [],
  };

  add = _ => {
    const { dispatch } = this.props;

    dispatch({
      type: 'group/updatePageState',
      payload: {
        pVisible: true,
        isAddP: true,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/updatePageState',
      payload: {
        pVisible: true,
        isAddP: false,
        currPRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/saveParent',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'group/updatePageState',
          payload: {
            pVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = record => {
    const { dispatch, group } = this.props;
    const { currPRowData, } = group;
    this.setState(
      {
        delRowId: record.id,
      },
      _ => {
        dispatch({
          type: 'group/delPRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currPRowData && currPRowData.id === record.id) {
              dispatch({
                type: 'group/updatePageState',
                payload: {
                  currPRowData: null,
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

  closeFormModal = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/updatePageState',
      payload: {
        pVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['group/delPRow'] && delRowId === row.id) {
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

  getFormModalProps = () => {
    const { loading, group } = this.props;
    const { pVisible, currPRowData, isAddP } = group;

    return {
      onSave: this.save,
      rowData: isAddP ? null : currPRowData,
      visible: pVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['group/saveParent'],
    };
  };

  reloadData = _ => {
    this.tableRef && this.tableRef.remoteDataRefresh();
  };

  getExtableProps = () => {
    const { dispatch, } = this.props;
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
                {authAction(
                  <ExtIcon
                    key={'edit'}
                    className="edit"
                    onClick={e => this.edit(record, e)}
                    type="edit"
                    ignore="true"
                    tooltip={
                      { title: '编辑' }
                    }
                    antd
                  />,
                )}
                {/* {record.frozen ? null : (
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
                )} */}
              </div>
            </>
          );
        }
      },
      {
        title: "代码",
        dataIndex: "code",
        width: 120,
        required: true,
      },
      {
        title: "名称",
        dataIndex: "name",
        width: 160,
        required: true,
        render: (text, record) => <Tooltip title={record.className}>{text}</Tooltip>
      },
      {
        title: "群组类型",
        dataIndex: "groupCategoryRemark",
        width: 160,
        required: true,
      },
      {
        title: '冻结',
        dataIndex: "frozen",
        width: 120,
        required: true,
        render: (frozen) => {
          return frozen ? <Tag color="red">已冻结</Tag> : <Tag color="green">可用</Tag>
        }
      }
    ];

    const toolBarProps = {
      left: (
        <>
          {authAction(
            <Button
              key={'add'}
              type="primary"
              onClick={this.add}
              ignore='true'
            >
              新建
            </Button>
          )}
          <Button onClick={this.reloadData}>
            刷新
          </Button>
        </>
      )
    };
    return {
      bordered: false,
      // remotePaging: true,
      searchProperties: ['code', 'name'],
      columns,
      toolBar: toolBarProps,
      onSelectRow: (_, selectedRows) => {
        dispatch({
          type: 'group/updatePageState',
          payload: {
            currPRowData: selectedRows[0],
          },
        });
      },
      store: {
        url: `${NOTIFY_SERVER_PATH}/group/findAll`,
      },
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => this.tableRef = inst} {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default CascadeTableMaster;
