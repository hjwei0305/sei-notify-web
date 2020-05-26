import React, { PureComponent } from "react";
import { Form, Input, } from "antd";
import { ExtModal, ScrollBar, ComboGrid, ComboTree, } from 'suid';
import { constants } from '@/utils';
import { Fragment } from "react";

const { NOTIFY_SERVER_PATH, } = constants;
const FormItem = Form.Item;

@Form.create()
class FormModal extends PureComponent {

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

  getPosComboTreeProps = () => {
    const { form, } = this.props;
    return {
      form,
      name: 'posOrgName',
      field: ['posOrgId',],
      // field: ['targetCode'],
      store: {
        url: `/sei-notify/bulletin/getUserAuthorizedTreeOrg`,
      },
      reader: {
        name: 'name',
        field: ['id'],
      },
      afterSelect: () => {
        form.setFieldsValue({
          itemId: '',
          itemCode: '',
          itemName: '',
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
      // field: ['targetCode'],
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
    const { form } = this.props;
    const columns = [{
      title: '岗位代码',
      width: 80,
      dataIndex: 'code',
    }, {
      title: '岗位名称',
      width: 80,
      dataIndex: 'name',
    }, {
      title: '岗位类别',
      width: 80,
      dataIndex: 'positionCategoryName',
    }];
    return {
      form,
      columns,
      name: 'itemName',
      field: ['itemId', 'itemCode'],
      searchProperties: ['code', 'name'],
      remotePaging: true,
      store: {
        type: 'POST',
        params: {
          filters: [
            {
              "fieldName": "organizationId",
              "value": form.getFieldValue('posOrgId'),
              "operator": "EQ",
            }
          ],
        },
        autoLoad: false,
        url: `${NOTIFY_SERVER_PATH}/group/findPositionByPage`,
      },
      rowKey: "id",
      reader: {
        name: 'name',
        field: ['id', 'code'],
      },
      placeholder: '请先选择机构，然后选择岗位',
    };
  }

  getComboGridProps = () => {
    const { form } = this.props;
    const columns = [{
      title: '用户帐号',
      width: 80,
      dataIndex: 'itemCode',
    }, {
      title: '用户名称',
      width: 80,
      dataIndex: 'itemName',
    }];
    return {
      form,
      columns,
      name: 'itemName',
      field: ['itemId', 'itemCode'],
      searchProperties: ['itemName', 'itemCode'],
      remotePaging: true,
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${NOTIFY_SERVER_PATH}/group/getUserAccounts`,
      },
      rowKey: "itemId",
      reader: {
        name: 'itemName',
        field: ['itemId', 'itemCode'],
      }
    };
  }

  render() {
    const { form, saving, visible, onCancel, rowData, pRowData } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator('itemCode', { initialValue: '' });
    getFieldDecorator('itemId', { initialValue: '' });
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18,
      }
    };
    const title = rowData ? '编辑' : '新建';
    const { id: parentId, category } = pRowData || {};

    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        confirmLoading={saving}
        title={title}
        onOk={() => {this.onFormSubmit()}}
        width={550}
        okText="保存"
      >
        <div>
          <ScrollBar>
            <Form style={{ padding: '0 10px',}} {...formItemLayout} layout="horizontal">
            <FormItem style={{ display: 'none' }}>
                {getFieldDecorator("category", {
                  initialValue: category,
                })(<Input />)}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator("groupId", {
                  initialValue: parentId,
                })(<Input />)}
              </FormItem>
              {
                category === "USER" ? (
                  <FormItem label="用户">
                  {getFieldDecorator("itemName", {
                    rules: [{
                      required: true,
                      message: "用户不能为空",
                    }]
                  })(<ComboGrid {...this.getComboGridProps()} />)}
                </FormItem>
                ) : null
              }
              {
                category === "ORG" ? (
                  <FormItem label="组织机构">
                  {getFieldDecorator("itemName", {
                    rules: [{
                      required: true,
                      message: "组织机构不能为空",
                    }]
                  })(<ComboTree {...this.getComboTreeProps()} />)}
                </FormItem>
                ) : null
              }
              {
                category === "POS" ? (<Fragment>
                  <FormItem label="组织机构id" style={{ display: 'none' }}>
                    {getFieldDecorator("posOrgId", {})(<Input />)}
                  </FormItem>
                  <FormItem label="组织机构">
                    {getFieldDecorator("posOrgName", {
                      rules: [{
                        required: true,
                        message: "组织机构不能为空",
                      }]
                    })(<ComboTree {...this.getPosComboTreeProps()} />)}
                  </FormItem>
                  <FormItem label="岗位">
                    {getFieldDecorator("itemName", {
                      rules: [{
                        required: true,
                        message: "岗位不能为空",
                      }]
                    })(<ComboGrid disabled={!form.getFieldValue('posOrgId')} {...this.getPosComboGridProps()} />)}
                  </FormItem>
                </Fragment>
                ) : null
              }
            </Form>
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
