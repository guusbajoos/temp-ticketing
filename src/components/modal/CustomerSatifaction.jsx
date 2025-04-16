import React, { useEffect } from 'react';

import { Button, Input, Modal } from 'antd';

import './style.scss';

const { TextArea } = Input;

const ModalCustomerSatifaction = ({
  patientSatisfactionStatus,
  handlePatientSatisfactionStatus,
  patientSatisfactionNote,
  handlePatientSatisfactionNote,
  isModalVisible = false,
  closeModal,
  onSubmit,
  defaultPatientSatisfactionNote,
  defaultPatientSatisfactionStatus,
}) => {
  const onChangePatientSatisfactionStatus = (status) => {
    if (status === patientSatisfactionStatus) {
      handlePatientSatisfactionStatus(null);
      handlePatientSatisfactionNote('');
      return;
    }

    handlePatientSatisfactionStatus(status);
  };

  const handleCancel = () => {
    closeModal();
    handlePatientSatisfactionStatus(null);
    handlePatientSatisfactionNote('');
  };

  useEffect(() => {
    if (patientSatisfactionStatus === defaultPatientSatisfactionStatus) {
      handlePatientSatisfactionStatus(defaultPatientSatisfactionStatus);
      handlePatientSatisfactionNote(defaultPatientSatisfactionNote);
    } else {
      handlePatientSatisfactionNote('');
    }
  }, [patientSatisfactionStatus]);

  const handleSubmit = () => {
    const payload = {
      patientSatisfactionStatus,
      patientSatisfactionNote: patientSatisfactionNote || null,
    };

    onSubmit(payload);
  };

  return (
    <Modal
      className="customer-satifaction"
      title="What does the patient say about our service?"
      visible={isModalVisible}
      onCancel={handleCancel}
      okText="Selesai"
      cancelButtonProps={{ disabled: true }}
      width={600}
      footer={[
        <Button key="btn-cancel__modal-link-text-editor" onClick={closeModal}>
          Cancel
        </Button>,
        <Button
          key="submit-link-text-editor"
          htmlType="submit"
          type="primary"
          disabled={patientSatisfactionStatus === undefined}
          form="form__modal-link-text-editor"
          onClick={handleSubmit}>
          Save
        </Button>,
      ]}>
      <div className="content">
        <div
          onClick={() => {
            onChangePatientSatisfactionStatus(true);
          }}
          className="good">
          {patientSatisfactionStatus ? (
            <img
              src="https://rata-web-staging-assets.s3.ap-southeast-1.amazonaws.com/thumb_good.svg"
              alt="good"
            />
          ) : (
            <img
              src="https://rata-web-staging-assets.s3.ap-southeast-1.amazonaws.com/thumb.svg"
              alt="good"
            />
          )}

          <p
            className={`${
              patientSatisfactionStatus ? 'text text--good' : 'text'
            } `}>
            Good
          </p>
        </div>
        <div
          onClick={() => {
            onChangePatientSatisfactionStatus(false);
          }}
          className="bad">
          {patientSatisfactionStatus === false ? (
            <img
              src="https://rata-web-staging-assets.s3.ap-southeast-1.amazonaws.com/thumb_bad.svg"
              alt="bad"
            />
          ) : (
            <img
              className="rotate"
              src="https://rata-web-staging-assets.s3.ap-southeast-1.amazonaws.com/thumb.svg"
              alt="bad"
            />
          )}

          <p
            className={`${
              patientSatisfactionStatus === false ? 'text text--bad' : 'text'
            } `}>
            Bad
          </p>
        </div>
      </div>

      {patientSatisfactionStatus !== null && (
        <div>
          <TextArea
            value={patientSatisfactionNote}
            rows={5}
            placeholder={
              patientSatisfactionStatus
                ? 'What went good?'
                : 'What could be improved?'
            }
            onChange={(e) => handlePatientSatisfactionNote(e.target.value)}
          />
        </div>
      )}
    </Modal>
  );
};

export default ModalCustomerSatifaction;
