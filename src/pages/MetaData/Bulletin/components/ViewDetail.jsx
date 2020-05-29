import React from 'react';
import { connect, } from 'dva';
import { Attachment, } from 'suid';
import { Skeleton, Divider, Empty, Row, Col, Button, Card, } from 'antd';

@connect(({ bulletin, loading, }) => ({ bulletin, loading, }))
class ViewDetail extends React.Component {
  state = {
    detail: null,
    attachNum: 0,
  }

  componentDidMount() {
    const { id, dispatch, msgCategory } = this.props;
    if (id) {

      dispatch({
        type: 'bulletin/bulletinOpt',
        payload: {
          msgCategory,
          ids: [id],
          optType: 'view',
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
    let title = detail ? `【${detail.subject}】消息明细` : '';

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
    const { detail, attachNum } = this.state;
    const { loading, } = this.props;

    return (
        <Card {...this.getCardProps()}>
          <Skeleton loading={loading.effects['bulletin/bulletinOpt']} active>
            { detail ? (
                <React.Fragment>
                  <h1 style={{ padding: 20, textAlign: 'center', fontSize: 20 }}>{detail.subject}</h1>
                  {/* <h4 style={{ display: 'inline-block', marginRight: 5 }}>有效期：{`${detail.effectiveDate}~${detail.invalidDate}`}</h4> */}
                  <h4 style={{ display: 'inline-block' }}>优先级：{`${detail.priorityRemark}`}</h4>
                  <Divider style={{
                    marginTop: 5,
                  }}/>

                  <div style={{
                    backgroundColor: 'rgba(208, 205, 205, 0.2)',
                    padding: '12px',
                  }}>
                    <div dangerouslySetInnerHTML={{__html: detail.content}}></div>
                  </div>
{/*                   <Divider style={{
                  }} dashed={true}>附件</Divider>
                  <Attachment
                    allowUpload={false}
                    allowDelete={false}
                    // viewType="card"
                    serviceHost='/edm-service'
                    entityId = {detail.id}
                    onChange = { (docIds) => {
                      this.setState({
                        attachNum: docIds.length
                      });
                    } }
                  /> */}
                  <Row type="flex" style={{
                    justifyContent: 'flex-end',
                  }}>
                    <Col style={{
                      textAlign: 'center'
                    }}>
                      <div style={{
                        marginBottom: 5
                      }}>{detail.createName}</div>
                      <div>{detail.createTime}</div>
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
