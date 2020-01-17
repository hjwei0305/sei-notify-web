/**
 * @Description:
 * @Author: pengxu
 * @Date: 2020/1/8
 */
import React, { PureComponent } from "react";
import withRouter from "umi/withRouter";
import { Button, Checkbox, Form, Icon, Input } from "antd";
import md5 from "md5";
import { connect } from "dva";
import styles from "./index.module.less";

const { Item } = Form;

@withRouter
@connect(({ global, loading }) => ({ global, loading }))
@Form.create()
class LoginForm extends PureComponent {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, user) => {
      if (!err) {
        user.password = md5(user.password);
        this.props.dispatch({
          type: "global/login",
          payload: {
            data: user
          }
        });
      }
    });
  };

  componentDidMount() {
    this.userInput.focus();
  }

  render() {
    const { loading, form, global } = this.props;
    const { getFieldDecorator } = form;
    const { showTenant } = global;
    return (
      <div className={styles["login-form"]}>
        <div className={"login-form"}>
          <div className="login-logo">
            <div className="login-name">SOMS-用户登录</div>
          </div>
          <Form onSubmit={this.handleSubmit} style={{ maxWidth: "300px" }}>
            {
              showTenant && <Item>
                {
                  getFieldDecorator("tenantCode", {
                    rules: [{ required: false, message: "请输入租户账号!" }]
                  })(
                    <Input
                      autoFocus="autoFocus"
                      size="large"
                      prefix={<Icon type="safety" style={{ color: "rgba(0,0,0,.25)" }}/>}
                      placeholder="租户账号"
                    />
                  )
                }
              </Item>
            }
            <Item>
              {
                getFieldDecorator("account", {
                  rules: [{ required: true, message: "请输入用户名" }]
                })(
                  <Input
                    ref={(inst) => {
                      this.userInput = inst;
                    }}
                    size="large"
                    prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }}/>}
                    placeholder="用户名"
                  />
                )
              }
            </Item>
            <Item>
              {
                getFieldDecorator("password", {
                  rules: [{ required: true, message: "请输入密码!" }]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }}/>}
                    size="large"
                    type="password"
                    placeholder="密码"
                  />
                )
              }
            </Item>
            <Item>
              {
                getFieldDecorator("rememberMe", {
                  valuePropName: "checked",
                  initialValue: true
                })(
                  <Checkbox>记住我</Checkbox>
                )}
              <a className="login-form-forgot" style={{ float: "right" }}>忘记密码?</a>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="login-form-button"
                style={{ width: "100%" }}
                loading={loading.effects["global/login"]}
              >
                登录
              </Button>
            </Item>
          </Form>
        </div>
      </div>
    );
  }
}
export default LoginForm
