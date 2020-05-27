import React, { PureComponent } from "react";
import { Drawer, Button, Tooltip } from "antd";
import cls from 'classnames';
import { ComboTree, ListCard, } from 'suid';
import { constants } from '@/utils';
import { Fragment } from "react";
import OrgTree from './OrgTree';
import styles from './index.less';

const { NOTIFY_SERVER_PATH, } = constants;

class FormDrawer extends PureComponent {

  state = {
    data: [],
  }

  onFormSubmit = _ => {
    const { form, onSave } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onSave) {
        onSave([formData]);
      }
    });
  };

  handleAssignUsers = () => {
    const { pRowData, onSave, } = this.props;
    const { data, } = this.state;
    const { id: groupId, category, } = pRowData || {};

    if (onSave) {
      const params = data.map(item => ({
        groupId,
        category,
        itemCode: item.itemCode,
        itemId: item.itemId,
        itemName: item.itemName,
      }));
      onSave(params);
    }

  }

  handleAssignPos = () => {
    const { pRowData, onSave, } = this.props;
    const { data, } = this.state;
    const { id: groupId, category, } = pRowData || {};

    if (onSave) {
      const params = data.map(item => ({
        groupId,
        category,
        itemCode: item.code,
        itemId: item.id,
        itemName: item.name,
      }));
      onSave(params);
    }
  }

  getPosComboTreeProps = () => {
    return {
      name: 'posOrgName',
      store: {
        url: `/sei-notify/bulletin/getUserAuthorizedTreeOrg`,
      },
      reader: {
        name: 'name',
      },
      width: 300,
      afterSelect: (value) => {
        this.setState({
          organizationId: value.id,
        });
      },
      placeholder: '请选择组织机构',
    };
  }

  getComboTreeProps = () => {
    const { form, } = this.props;
    return {
      form,
      name: 'itemName',
      field: ['itemId', 'itemCode'],
      store: {
        url: `/sei-notify/bulletin/getUserAuthorizedTreeOrg`,
      },
      reader: {
        name: 'name',
        field: ['id', 'code'],
      },
      placeholder: '请选择机构',
    };
  }

  getPosComboGridProps = () => {
    const { organizationId, } = this.state;
    return {
      title: this.getTitle(),
      showArrow: false,
      checkbox: true,
      onSelectChange: (keys, items) => {
        this.setState({
          data: items,
        });
      },
      cascadeParams: {
        filters: [
          {
            "fieldName": "organizationId",
            "value": organizationId,
            "operator": "EQ",
          }
        ],
      },
      itemField: {
        title: item => item.name,
        description: item => item.code,
      },
      searchProperties: ['code', 'name'],
      remotePaging: true,
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${NOTIFY_SERVER_PATH}/group/findPositionByPage`,
      },
      rowKey: "id",
    };
  }

  getTitle = () => {
    const { pRowData, saving, } = this.props;
    const { data, } = this.state;
    const { category } = pRowData || {};
    let cmp = null;
    if (category === 'USER') {
      cmp = (
        <Tooltip title="分配用户">
          <Button loading={saving} icon="import" disabled={!(data && data.length)} type="primary" onClick={this.handleAssignUsers} />
        </Tooltip>
      );
    }

    if(category === "ORG") {
      cmp = (
        <Tooltip title="分配组织">
          <Button disabled={!(data && data.length)} loading={saving} icon="import" type="primary" onClick={this.handleAssignPos} />
        </Tooltip>
      );
    }

    if(category === "POS") {
      cmp = (
        <Fragment>
          <ComboTree style={{ width: 200, }} {...this.getPosComboTreeProps()} />
          {/* <ExtIcon type="plus" onClick={this.handleAssignPos} tooltip={{ title: '分配岗位' }} antd /> */}
          <Tooltip title="分配岗位">
            <Button disabled={!(data && data.length)} loading={saving} icon="import" type="primary" onClick={this.handleAssignPos} />
          </Tooltip>

        </Fragment>
      );
    }

    return cmp;
  }

  getComboGridProps = () => {

    return {
      title: this.getTitle(),
      showArrow: false,
      checkbox: true,
      onSelectChange: (keys, items) => {
        this.setState({
          data: items,
        });
      },
      name: 'itemName',
      field: ['itemId', 'itemCode'],
      searchProperties: ['itemName', 'itemCode'],
      itemField: {
        title: item => item.itemName,
        description: item => item.itemCode,
      },
      remotePaging: true,
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${NOTIFY_SERVER_PATH}/group/getUserAccounts`,
      },
      rowKey: "itemId",
    };
  }

  getOrgTreeProps = () => {
    return {
      toolBar: {
        left: this.getTitle(),
      },
      onSelect: (treeData) => {
        this.setState({
          data: treeData,
        });
      }
    };
  }

  render() {
    const { visible, onCancel, rowData, pRowData } = this.props;
    const title = rowData ? '编辑' : '分配群组项';
    const { category } = pRowData || {};

    return (
      <Drawer
        visible={visible}
        destroyOnClose
        className={cls(styles['drawer-wrapper'])}
        onClose={() => {
          this.setState({
            data: []
          }, () => {
            onCancel()
          });
        }}
        title={title}
        width={550}
      >
        <div style={{ height: '100%',}}>
          {
            category === "USER" ? (<ListCard {...this.getComboGridProps()} />) : null
          }
          {
            category === "POS" ? (<ListCard {...this.getPosComboGridProps()} />) : null
          }
          {
            category === "ORG" ? (<OrgTree {...this.getOrgTreeProps()} />) : null
          }
        </div>
      </Drawer>
    );
  }
}

export default FormDrawer;
