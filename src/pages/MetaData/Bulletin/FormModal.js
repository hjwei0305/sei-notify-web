import React, { PureComponent } from "react";
import {Button, Form, Input, Modal, Row, Radio} from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { DatePicker } from 'antd';
import {RichEditor} from "seid";
import styles from "./FormMoal.less";
import {getLocales} from "./locales/locales";
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 18
  }
};

const buttonWrapper = { span: 20, offset: 4 };
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
      ?  getLocales("editBulletin","修改通知内容")
      :  getLocales("addBulletin","新建通知内容");
    return (
      <Modal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        maskClosable={false}
        footer={null}
        title={title}
        wrapClassName={styles["order-box"]}
      >
        <Row>
            <Form {...formItemLayout} layout="horizontal">
              <FormItem label={getLocales("subject","标题")}>
                {getFieldDecorator("subject", {
                  initialValue: rowData ? rowData.subject : "",
                  rules: [{
                    required: true,
                    message: getLocales("subject.required","标题不能为空")
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={getLocales("institution","发布机构")}>
                {getFieldDecorator("institution", {
                  initialValue: rowData ? rowData.institution : "",
                  rules: [{
                    required: true,
                    message: getLocales("institution.required","发布机构不能为空")
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={getLocales("priority","优先级")}>
                {getFieldDecorator("priority", {
                  initialValue: rowData ? rowData.priority : "",
                  rules: [{
                    required: true,
                    message: getLocales("priority.required","优先级不能为空")
                  }]
                })(
                  <RadioGroup>
                    <Radio key="high">高</Radio>
                    <Radio key="high1">紧急</Radio>
                    <Radio key="high2">一般</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem label={getLocales("effectiveDate","有效期间")}>
                {getFieldDecorator("effectiveDate", {
                  initialValue: rowData ? rowData.effectiveDate : null,
                  rules: [{
                    required: true,
                    message: getLocales("effectiveDate.required","有效期间不能为空")
                  }]
                })(<Input style={{width:"100%"}} />)}
              </FormItem>
              <FormItem label={getLocales("content","通告内容")}>
                {getFieldDecorator("content", {
                  initialValue: rowData ? rowData.content : "",
                  rules: [{
                    required: true,
                    message: getLocales("content.required","通告内容不能为空！")
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
