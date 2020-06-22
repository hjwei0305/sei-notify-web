import React, { Component, Fragment, } from 'react';
import { ListLoader, } from 'suid';
import TreeView from '@/components/TreeView';
import { getUserAuthorizedTreeOrg } from '../../service';

class OrgTree extends Component {

  state = {
    treeData: [],
    loading: true,
  }

  componentDidMount() {
    getUserAuthorizedTreeOrg().then(result => {
      const { data, success, } = result || {};
      if (success) {
        this.setState({
          treeData: data,
          loading: false,
        });
      }
    })
  }

  render() {
    const { treeData, loading } = this.state;
    const { onSelect, toolBar, } = this.props;
    return (
      <Fragment>
        { loading ? <ListLoader /> : (
          <TreeView checkable={true} treeData={treeData} toolBar={toolBar} onChange={onSelect} />
        ) }
      </Fragment>
    );
  }
}

export default OrgTree;
