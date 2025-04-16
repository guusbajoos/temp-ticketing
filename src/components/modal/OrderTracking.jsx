import React from 'react';
import moment from 'moment';

import { Button, Modal, Steps } from 'antd';

import './style.scss';

const { Step } = Steps;

const OrderTracking = ({
  data = [],
  isModalVisible = false,
  closeModal,
  pagination,
  onSeeMore,
  selectedOrderTrackingSOnumber,
}) => {
  const handleOk = () => {
    closeModal();
  };

  return (
    <Modal
      title="Order Tracking"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleOk}
      okText="Selesai"
      cancelButtonProps={{ disabled: true }}
      width={600}
      footer={[<></>]}>
      <h3>{selectedOrderTrackingSOnumber}</h3>

      <Steps progressDot direction="vertical" current={0}>
        {data.map((item, index) => (
          <Step
            key={index}
            title={item.currentState}
            subTitle={moment(item.updatedDate).utc().format('YYYY-MM-DD HH:mm')}
            description={item.note}
          />
        ))}
      </Steps>

      {pagination.currentPage !== pagination.totalPage && (
        <Button onClick={onSeeMore} type="link">
          See More
        </Button>
      )}
    </Modal>
  );
};

export default OrderTracking;
