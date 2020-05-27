import React, { Component } from 'react';
import queryString from "query-string";
import ViewDetail from "./components/ViewDetail";
import { Fragment } from 'react';

class MsgDetail extends Component {

  constructor(props) {
    super(props);
    this.params = queryString.parse(window.location.href.split('?')[1]);
  }

  getViewDetailProps = () => {

    const { detailId: id , category: msgCategory, } = this.params;

    return {
      id,
      msgCategory,
      showHead: false,
    };
  }

  render() {
    const { detailId, category } = this.params;
    return (
      <Fragment>
        { detailId && category ? <ViewDetail {...this.getViewDetailProps()} /> : <h3>参数不对，明细id和类型</h3>}
      </Fragment>
    );
  }
}

export default MsgDetail;
