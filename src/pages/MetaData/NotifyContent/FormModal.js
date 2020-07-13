import React, { PureComponent } from "react";
import { Button, Form, Input, Modal, Row, Col } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import MonacoEditor from '@/components/monaco';

const FormItem = Form.Item;
const { TextArea } = Input;
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
      ?  formatMessage({ id: "notifyContent.edit.modal", defaultMessage: "修改内容模板" })
      :  formatMessage({ id: "notifyContent.add.modal", defaultMessage: "新建内容模板" });
    let content = form.getFieldValue("content")||rowData&&rowData.content;
    if(form.getFieldValue("content")===""){
      content = "";
    }
    return (
      <Modal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        maskClosable={false}
        footer={null}
        title={title}
        width="90%"
      >
        <Row>
          <Col span={9}>
            <Form {...formItemLayout} layout="horizontal">
              <FormItem label={formatMessage({ id: "notifyContent.code", defaultMessage: "代码" })}>
                {getFieldDecorator("code", {
                  initialValue: rowData ? rowData.code : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "notifyContent.code.required", defaultMessage: "代码不能为空" })
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "notifyContent.name", defaultMessage: "名称" })}>
                {getFieldDecorator("name", {
                  initialValue: rowData ? rowData.name : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "notifyContent.name.required", defaultMessage: "名称不能为空" })
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "notifyContent.content", defaultMessage: "内容" })}>
                {getFieldDecorator("content", {
                  initialValue: rowData ? rowData.content : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "notifyContent.content.required", defaultMessage: "内容不能为空" })
                  }]
                })(<MonacoEditor />)}
              </FormItem>
              <FormItem wrapperCol={buttonWrapper} className="btn-submit">
                <Button
                  type="primary"
                  loading={saving}
                  onClick={this.onFormSubmit}
                >
                  <FormattedMessage id="notifyContent.ok" defaultMessage="确定" />
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={15}>
            {<FormItem wrapperCol={contentWrapper}>
              <div style={{border:"1px solid #c4cfd5",margin:"2px 0 0 40px",borderRadius: "3px",
                height:"auto",minHeight:"32px"}}>
                <p style={{margin:"10px"}} dangerouslySetInnerHTML={{ __html: content||
                formatMessage({ id: "notifyContent.content.hint", defaultMessage: "内容展示区域" })}}/>
              </div>
            </FormItem>}
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default FormModal;
