import React, { PureComponent } from "react";
import {Button, Form, Input, Modal, Row, Radio} from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { DatePicker } from 'antd';
import {RichEditor, ComboTree,} from "seid";
import styles from "./FormMoal.less";
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
      console.log(formData, 'test');
      // save(params);
    });
  };

  getComboTreeProps = () => {
    const { form, } = this.props;
    return {
      form,
      name: 'institution',
      store: {
        url: `/sei-basic/organization/getUserAuthorizedTreeEntities`,
      },
      reader: {
        name: 'name',
      },
      placeholder: '请选择发布机构',
    };
  }
  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData
      ?  formatMessage({ id: "bulletin.editBulletin", defaultMessage: "修改通知内容" })
      :  formatMessage({ id: "bulletin.addBulletin", defaultMessage: "新建通知内容" });
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
              <FormItem label={formatMessage({ id: "bulletin.subject", defaultMessage: "标题" })}>
                {getFieldDecorator("subject", {
                  initialValue: rowData ? rowData.subject : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "bulletin.subject.required", defaultMessage: "标题不能为空" })
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "bulletin.institution", defaultMessage: "发布机构" })}>
                {getFieldDecorator("institution", {
                  initialValue: rowData ? rowData.institution : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "bulletin.institution.required", defaultMessage: "发布机构不能为空" })
                  }]
                })(<ComboTree {...this.getComboTreeProps()}/>)}
              </FormItem>
              <FormItem label={formatMessage({ id: "bulletin.priority", defaultMessage: "优先级" })}>
                {getFieldDecorator("priority", {
                  initialValue: rowData ? rowData.priority : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "bulletin.priority.required", defaultMessage: "优先级不能为空" })
                  }]
                })(
                  <RadioGroup options={[{
                    label: '高',
                    value: 'high',
                  },{
                    label: '紧急',
                    value: 'Urgent',
                  },{
                    label: '一般',
                    value: 'General',
                  }]} />
                )}
              </FormItem>
              <FormItem label={formatMessage({ id: "bulletin.effectiveDate", defaultMessage: "有效期间" })}>
                {getFieldDecorator("effectiveDate", {
                  initialValue: rowData ? rowData.effectiveDate : null,
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "bulletin.effectiveDate.required", defaultMessage: "有效期间不能为空" })
                  }]
                })(<RangePicker style={{ width: '100%', }} />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "bulletin.content", defaultMessage: "通告内容" })}>
                {getFieldDecorator("content", {
                  initialValue: rowData ? rowData.content : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "bulletin.content.required", defaultMessage: "通告内容不能为空！" })
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
