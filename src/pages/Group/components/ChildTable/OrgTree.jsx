import React, { Component } from 'react';
import TreeView from '@/components/TreeView';
import { getUserAuthorizedTreeOrg } from '../../service';

class OrgTree extends Component {

  state = {
    treeData: [],
  }

  componentDidMount() {
    getUserAuthorizedTreeOrg().then(result => {
      const { data, success, } = result || {};
      if (success) {
        this.setState({
          treeData: data,
        });
      }
    })
  }

  render() {
    const { treeData } = this.state;
    const { onSelect, toolBar, } = this.props;
    return (
      <TreeView checkable={true} treeData={treeData} toolBar={toolBar} onChange={onSelect} />
    );
  }
}

export default OrgTree;
