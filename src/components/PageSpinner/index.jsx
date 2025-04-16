import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import './style.scss';

export function PageSpinner(props) {
  const { className = '' } = props;

  return (
    <div className={`page-spinner ${className}`}>
      <Spin
        size="large"
        indicator={<LoadingOutlined style={{ fontSize: '24px' }} spin />}
      />
    </div>
  );
}

PageSpinner.propTypes = {
  className: PropTypes.string,
};

export default { PageSpinner };
