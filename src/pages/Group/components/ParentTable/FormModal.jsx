import React, { PureComponent } from "react";
import { Form, Input, InputNumber, Checkbox, Select, } from "antd";
import { ExtModal, ScrollBar, } from 'suid';
import { constants, } from '@/utils';

const FormItem = Form.Item;
const Option = Select.Option;
const { GROUP_CATEGORY, } = constants;

@Form.create()
class FormModal extends PureComponent {

  onFormSubmit = _ => {
    const { form, onSave } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onSave) {
        onSave(formData);
      }
    });
  };

  render() {
    const { form, saving, visible, onCancel, rowData, } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18,
      }
    };
    const title = rowData ? '编辑' : '新建';
    const { id, code, name, rank=0, frozen=false, } = rowData || {};

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
                {getFieldDecorator("id", {
                  initialValue: id,
                })(<Input />)}
              </FormItem>
              <FormItem label="代码">
                {getFieldDecorator("code", {
                  initialValue: code,
                  rules: [{
                    required: true,
                    message: "代码不能为空",
                  }]
                })(<Input disabled={!!rowData} />)}
              </FormItem>
              <FormItem label="名称">
                {getFieldDecorator("name", {
                  initialValue: name,
                  rules: [{
                    required: true,
                    message: "名称不能为空"
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label="分类">
                {getFieldDecorator("category", {
                  initialValue: rank,
                })(<Select style={{ width: '100%'}}>
                  {GROUP_CATEGORY.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
                </Select>)}
              </FormItem>
              <FormItem label="排序">
                {getFieldDecorator("rank", {
                  initialValue: rank,
                })(<InputNumber style={{ width: '100%'}} />)}
              </FormItem>
              <FormItem label="冻结">
                {getFieldDecorator("frozen", {
                  valuePropName: 'checked',
                  initialValue: frozen,
                })(<Checkbox />)}
              </FormItem>
            </Form>
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
