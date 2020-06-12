import React from 'react';
import { connect, } from 'dva';
import { Attachment, } from 'suid';
import { Skeleton, Divider, Empty, Row, Col, Button, Card, } from 'antd';
import moment from 'moment';
import { constants, } from '@/utils';

const { BASE_URL, } = constants;

@connect(({ messageHistory, loading, }) => ({ messageHistory, loading, }))
class ViewDetail extends React.Component {
  state = {
    detail: null,
  }

  componentDidMount() {
    const { id, dispatch, } = this.props;
    if (id) {

      dispatch({
        type: 'messageHistory/getById',
        payload: {
          id
        },
      }).then(res => {
        const { success, data, } = res || {};
        if (success) {
          this.setState({
            detail: data,
          });
        }
      });
    }
  }

  handleBack = () => {
    const { onBack, } = this.props;
    if (onBack) {
      onBack();
    }
  }

  getCardProps = () => {
    const { detail, } = this.state;
    const { showHead, } = this.props;
    let title = detail ? `消息明细` : '';

    return {
      title: showHead ? title : null,
      bordered: false,
      extra: showHead ? (
        <React.Fragment>
          <Button type="primary" onClick={this.handleBack}>返回</Button>
{/*          { type === 'user' ? (
            <Button
              style={{ marginLeft: 8 }}
              type="primary"
              onClick={() => {
                hasKonwn({
                  id,
                  category: 'Bulletin',
                });
                this.handleBtn();
              }}
            >
              不再提醒
            </Button>
          ) : (null) }*/}
        </React.Fragment>
      ): null,
    };
  }

  render() {
    const { detail, } = this.state;
    const { loading, } = this.props;

    return (
        <Card {...this.getCardProps()}>
          <Skeleton loading={loading.effects['bulletin/bulletinOpt']} active>
            { detail ? (
                <React.Fragment>
                  <h1 style={{ padding: 20, textAlign: 'center', fontSize: 20 }}>{detail.subject}</h1>
                  <Divider style={{
                    marginTop: 5,
                  }}/>

                  <div style={{
                    backgroundColor: 'rgba(208, 205, 205, 0.2)',
                    padding: '12px',
                  }}>
                    <div dangerouslySetInnerHTML={{__html: detail.content || '暂无'}}></div>
                  </div>
                <Divider style={{
                  }} dashed={true}>附件</Divider>
                  <Attachment
                    allowUpload={false}
                    allowDelete={false}
                    serviceHost={`${BASE_URL}/edm-service`}
                    entityId = {detail.contentId}
                  />
                  <Row type="flex" style={{
                    justifyContent: 'flex-end',
                  }}>
                    <Col style={{
                      textAlign: 'center'
                    }}>
                      <div style={{
                        marginBottom: 5
                      }}>{detail.createName}</div>
                      <div>{detail.sendDate ? `发布时间：${moment(detail.sendDate).format('YYYY-MM-DD HH:mm:ss')}` : '' }</div>
                    </Col>
                  </Row>
                </React.Fragment>
              ) : (<Empty />)}
          </Skeleton>
        </Card>
    );
  }
}

export default ViewDetail;
