import React, { PureComponent } from "react";
import {Button, Form, Input, Modal, Row, Radio} from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { DatePicker } from 'antd';
import {RichEditor, ScrollBar, ComboGrid, Attachment, } from "suid";

import moment from 'moment';
import { constants, } from '@/utils';
import styles from "./FormMoal.less";

const { PRIORITY_OPT, TARGETTYPE_OPT, NOTIFY_SERVER_PATH, } = constants;

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
    // const { rowData} = props;
    this.state = {
      isPreview: false,
      // targetType: rowData ? rowData.targetType : TARGETTYPE_OPT[1].value,
      targetType: TARGETTYPE_OPT[1].value,

    };
  };

  onFormSubmit = _ => {
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const [effectiveDate, invalidDate,] = formData.effectiveDateRange;
      delete formData.effectiveDateRange;
      let tempFiles = formData.Attachments;
      if (!tempFiles && this.attachmentRef) {
        tempFiles = this.attachmentRef.getAttachmentStatus().fileList;
      }
      let params = {
        category: 'SEI_BULLETIN',
        effectiveDate: effectiveDate.format('YYYY-MM-DD'),
        invalidDate: invalidDate.format('YYYY-MM-DD'),
        docIds: tempFiles ? tempFiles.map(attach => attach.id) : [],
      };
      params = Object.assign({},rowData || {}, params, formData);
      save(params);
    });
  };

  handleChangeTarget = (e) => {
    const { form } = this.props;

    this.setState({
      targetType: e.target.value,
    }, () => {
      form.setFieldsValue({
        targetCode: '',
        targetName: '',
      });
    });
  }

  getComboTreeProps = () => {
    const { form, } = this.props;
    return {
      form,
      name: 'targetName',
      field: ['targetCode'],
      store: {
        url: `/sei-basic/organization/getUserAuthorizedTreeEntities`,
      },
      reader: {
        name: 'name',
        field: ['code'],
      },
      placeholder: '请选择发布机构',
    };
  }

  getComboGridProps = () => {
    const { form } = this.props;
    const columns = [{
      title: '群组代码',
      width: 80,
      dataIndex: 'code',
    }, {
      title: '群组名称',
      width: 80,
      dataIndex: 'name',
    }];
    return {
      form,
      columns,
      name: 'targetName',
      field: ['targetCode'],
      searchProperties: ['code', 'name'],
      store: {
        autoLoad: false,
        url: `${NOTIFY_SERVER_PATH}/group/findAllUnfrozen`,
      },
      rowKey: "id",
      reader: {
        name: 'name',
        field: ['code',],
      },
      placeholder: '请选择发布群组',
    };
  }

  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const { targetType, } = this.state;
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
        <ScrollBar>
          <Row style={{ width: '60%', margin: '0 auto' }}>
              <Form {...formItemLayout} layout="horizontal">
                <FormItem style={{ display: 'none'}}>
                  {getFieldDecorator("id", {
                    initialValue: rowData && rowData.id,
                  })(<Input />)}
                </FormItem>
                <FormItem style={{ display: 'none'}}>
                  {getFieldDecorator("contentId", {
                    initialValue: rowData && rowData.contentId,
                  })(<Input />)}
                </FormItem>
                <FormItem label={formatMessage({ id: "bulletin.subject", defaultMessage: "标题" })}>
                  {getFieldDecorator("subject", {
                    initialValue: rowData ? rowData.subject : "",
                    rules: [{
                      required: true,
                      message: formatMessage({ id: "bulletin.subject.required", defaultMessage: "标题不能为空" })
                    }]
                  })(<Input />)}
                </FormItem>
                <FormItem style={{ display: 'none' }}>
                  {getFieldDecorator("targetType", {
                    initialValue: targetType,
                  })(
                    <Input />
                  )}
                </FormItem>
                {/* <FormItem label={formatMessage({ id: "bulletin.targetType", defaultMessage: "发布类型" })}>
                  {getFieldDecorator("targetType", {
                    initialValue: targetType,
                    rules: [{
                      required: true,
                      message: formatMessage({ id: "bulletin.targetType.required", defaultMessage: "发布类型不能为空" })
                    }]
                  })(
                    <RadioGroup onChange={this.handleChangeTarget} options={TARGETTYPE_OPT} />
                  )}
                </FormItem> */}
                <FormItem style={{ display: 'none' }}>
                  {getFieldDecorator("targetCode", {
                    initialValue: rowData ? rowData.targetCode : "",
                  })(<Input />)}
                </FormItem>
                {/* {targetType === TARGETTYPE_OPT[0].value ? (
                  <FormItem label={formatMessage({ id: "bulletin.institution", defaultMessage: "发布机构" })}>
                    {getFieldDecorator("targetName", {
                      initialValue: rowData ? rowData.targetName : "",
                      rules: [{
                        required: true,
                        message: formatMessage({ id: "bulletin.institution.required", defaultMessage: "发布机构不能为空" })
                      }]
                    })(<ComboTree {...this.getComboTreeProps()}/>)}
                  </FormItem>
                ) : ( */}
                  <FormItem label="发布群组">
                    {getFieldDecorator("targetName", {
                      initialValue: rowData ? rowData.targetName : "",
                      rules: [{
                        required: true,
                        message: "发布群组不能为空"
                      }]
                    })(<ComboGrid {...this.getComboGridProps()}/>)}
                  </FormItem>
                {/* )} */}
                <FormItem label={formatMessage({ id: "bulletin.priority", defaultMessage: "优先级" })}>
                  {getFieldDecorator("priority", {
                    initialValue: rowData ? rowData.priority : "",
                    rules: [{
                      required: true,
                      message: formatMessage({ id: "bulletin.priority.required", defaultMessage: "优先级不能为空" })
                    }]
                  })(
                    <RadioGroup options={PRIORITY_OPT} />
                  )}
                </FormItem>
                <FormItem label={formatMessage({ id: "bulletin.effectiveDate", defaultMessage: "有效期间" })}>
                  {getFieldDecorator("effectiveDateRange", {
                    initialValue: rowData ? [moment(rowData.effectiveDate), moment(rowData.invalidDate)] : null,
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
                <FormItem label="附件">
                {getFieldDecorator("Attachments", {
                  })(
                    <Attachment
                    onAttachmentRef={inst => this.attachmentRef = inst}
                    entityId = {rowData && rowData.id}
                    serviceHost='/api-gateway/edm-service'
                  >

                  </Attachment>
                  )}
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
        </ScrollBar>
      </Modal>
    );
  }
}

export default FormModal;
