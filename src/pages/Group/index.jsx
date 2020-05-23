import React, { Component, } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Empty } from "antd";
import ParentTable from './components/ParentTable';
import ChildTable from './components/ChildTable';
import PageWrapper from '@/components/PageWrapper';
import CascadeLayout from '@/components/Layout/CascadeLayout';
import styles from "./index.less";

@withRouter
@connect(({ group, loading, }) => ({ group, loading, }))
class Group extends Component {

  render() {
    const { group, loading,  } = this.props;
    const { currPRowData, } = group;

    return (
      <PageWrapper loading={loading.global} className={cls(styles['container-box'])}>
        <CascadeLayout title={['群组', `${ currPRowData ? currPRowData.name : ''}`]} layout={[10, 14]}>
          <ParentTable slot="left" />
          { currPRowData ? (<ChildTable slot="right" />) : (<Empty slot="right" className={cls("empty-wrapper")} description="请选择左边的群组" />)}
        </CascadeLayout>
      </PageWrapper>
    );
  }
}

export default Group;
