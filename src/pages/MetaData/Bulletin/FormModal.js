import React, { PureComponent } from "react";
import {Button, Form, Input, Modal, Row, Col, Radio} from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { DatePicker } from 'antd';
import {RichEditor} from "seid"
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};

const buttonWrapper = { span: 20, offset: 4 };
const contentWrapper = { span: 24};
@Form.create()
class FormModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPreview: false
    };
  };
  onFormSubmit = _ => {
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      save(params);
    });
  };
  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData
      ?  "修改通知内容"
      :  "新建通知内容" ;
    return (
      <Modal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        maskClosable={false}
        footer={null}
        title={title}
        width={"100%"}
      >
        <Row>
            <Form {...formItemLayout} layout="horizontal">
              <FormItem label={"标题"}>
                {getFieldDecorator("code", {
                  initialValue: rowData ? rowData.code : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "global.code.required", defaultMessage: "标题不能为空" })
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "global.name", defaultMessage: "发布机构" })}>
                {getFieldDecorator("name", {
                  initialValue: rowData ? rowData.name : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "global.name.required", defaultMessage: "发布机构不能为空" })
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "global.name", defaultMessage: "优先级" })}>
                {getFieldDecorator("content", {
                  initialValue: rowData ? rowData.content : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "global.name.required", defaultMessage: "优先级不能为空" })
                  }]
                })(
                  <RadioGroup>
                    <Radio key="high">高</Radio>
                    <Radio key="high1">紧急</Radio>
                    <Radio key="high2">一般</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem label={formatMessage({ id: "global.name", defaultMessage: "有效期间" })}>
                {getFieldDecorator("name", {
                  initialValue: rowData ? rowData.name : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "global.name.required", defaultMessage: "有效期间不能为空" })
                  }]
                })(<RangePicker  />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "global.name", defaultMessage: "通告内容" })}>
                {getFieldDecorator("name", {
                  initialValue: rowData ? rowData.name : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "global.name.required", defaultMessage: "通告内容不能为空" })
                  }]
                })(<RichEditor  contentStyle={{border:"1px solid #c4cfd5",height:"auto",minHeight:"50px"}}/>)}
              </FormItem>
              <FormItem wrapperCol={buttonWrapper} className="btn-submit">
                <Button
                  type="primary"
                  loading={saving}
                  onClick={this.onFormSubmit}
                >
                  <FormattedMessage id="global.ok" defaultMessage="确定" />
                </Button>
              </FormItem>
            </Form>
        </Row>
      </Modal>
    );
  }
}

export default FormModal;
