import React, { PureComponent } from "react";
import { Button, Form, Input, Modal, Row, Col } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";

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
      ?  "修改通知内容"
      :  "新建通知内容" ;
    const content = form.getFieldValue("content")||rowData.content;
    return (
      <Modal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        maskClosable={false}
        footer={null}
        title={title}
        width={"90%"}
      >
        <Row>
          <Col span={9}>
            <Form {...formItemLayout} layout="horizontal">
              <FormItem label={formatMessage({ id: "global.code", defaultMessage: "代码" })}>
                {getFieldDecorator("code", {
                  initialValue: rowData ? rowData.code : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "global.code.required", defaultMessage: "代码不能为空" })
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
                {getFieldDecorator("name", {
                  initialValue: rowData ? rowData.name : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "global.name", defaultMessage: "内容" })}>
                {getFieldDecorator("content", {
                  initialValue: rowData ? rowData.content : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "global.name.required", defaultMessage: "内容不能为空" })
                  }]
                })(<TextArea rows={5}/>)}
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
          </Col>
          <Col span={15}>
            {<FormItem wrapperCol={contentWrapper}>
              <div style={{border:"1px solid #c4cfd5",margin:"2px 0 0 40px",borderRadius: "3px",
                height:"auto",minHeight:"32px"}}>
                <p style={{margin:"10px"}} dangerouslySetInnerHTML={{ __html: content||"内容展示区域" }}/>
              </div>
            </FormItem>}
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default FormModal;
