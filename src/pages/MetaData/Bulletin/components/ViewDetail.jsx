import React from 'react';
import { connect, } from 'dva';
import { Skeleton, Divider, Empty, Row, Col, Button, Card, } from 'antd';

@connect(({ bulletin, loading, }) => ({ bulletin, loading, }))
class ViewDetail extends React.Component {
  state = {
    detail: null,
    attachNum: 0,
  }

  componentDidMount() {
    const { id, dispatch, } = this.props;
    if (id) {

      dispatch({
        type: 'bulletin/bulletinOpt',
        payload: {
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
    const title = detail ? `【${detail.subject}】` : '';
    return {
      title: `${title}通告详情`,
      bordered: false,
      extra:(
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
      ),
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
                  <h5 style={{ display: 'inline-block', marginRight: 5 }}>有效期：{`${detail.effectiveDate}~${detail.invalidDate}`}</h5>
                  <h5 style={{ display: 'inline-block' }}>优先级：{`${detail.priorityRemark}`}</h5>
                  <Divider style={{
                    marginTop: 5,
                  }}/>

                  <div style={{
                    backgroundColor: 'rgba(208, 205, 205, 0.2)',
                    padding: '12px',
                  }}>
                    <div dangerouslySetInnerHTML={{__html: detail.content}}></div>
                  </div>
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
