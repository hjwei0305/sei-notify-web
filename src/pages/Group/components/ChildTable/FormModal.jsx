import React, { PureComponent } from "react";
import { Form, Input, } from "antd";
import { ExtModal, ScrollBar, ComboGrid, } from 'suid';
import { constants } from '@/utils';

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

  getComboGridProps = () => {
    const { form } = this.props;
    const columns = [{
      title: '用户帐号',
      width: 80,
      dataIndex: 'userAccount',
    }, {
      title: '用户名称',
      width: 80,
      dataIndex: 'userName',
    }];
    return {
      form,
      columns,
      name: 'userName',
      field: ['userId', 'userAccount'],
      searchProperties: ['userName', 'userAccount'],
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${NOTIFY_SERVER_PATH}/group/getUserAccounts`,
      },
      rowKey: "userId",
      reader: {
        name: 'userName',
        field: ['userId', 'userAccount'],
      }
    };
  }

  render() {
    const { form, saving, visible, onCancel, rowData, pRowData } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator('userAccount', { initialValue: '' });
    getFieldDecorator('userId', { initialValue: '' });
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18,
      }
    };
    const title = rowData ? '编辑' : '新建';
    const { id: parentId, } = pRowData || {};

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
                {getFieldDecorator("groupId", {
                  initialValue: parentId,
                })(<Input />)}
              </FormItem>
              <FormItem label="用户">
                {getFieldDecorator("userName", {
                  rules: [{
                    required: true,
                    message: "用户不能为空",
                  }]
                })(<ComboGrid {...this.getComboGridProps()} />)}
              </FormItem>
            </Form>
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
