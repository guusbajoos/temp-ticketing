import { Button, Form, Input, Modal } from 'antd';
import React from 'react';
import { connect } from 'react-redux';

import { getTeamList } from 'store/action/TeamAction';

export const Mode = {
  LINK_WITH_TEXT: 'LINK_WITH_TITLE',
  LINK: 'LINK',
};

/**
 *ModalLinkTextEditor is responsible to manage state of link attachment
 * to a team (and agent)s
 * @param {boolean} showModalLink sets visibility of this modal (boolean)
 * @param {Mode} mode modal mode
 * @param {callback} withoutSaveCallback callback if data is not saved
 * @param {callback} saveCallback callback if data is saved
 * @param {object} quillInstance
 * @param {object} selectedText has prop
 * {
 *     index: ?
 *     length: ?
 * }
 * @constructor
 */
export const ModalLinkTextEditor = ({
  showModalLink,
  mode,
  withoutSaveCallback,
  saveCallback,
  quillInstance,
  selectedText,
}) => {
  const [form] = Form.useForm();

  // internal function
  const handlePreventWithoutSave = () => {
    document.getElementById('form__modal-link-text-editor').reset();
    withoutSaveCallback();
  };

  const handleFormSubmission = async (formData) => {
    const quillEditor = quillInstance.getEditor();
    if (mode === Mode.LINK) {
      quillInstance.setEditorSelection(quillEditor, selectedText);
      quillEditor.format('link', formData.mdl_link_text_editor__link);
    } else if (mode === Mode.LINK_WITH_TEXT) {
      const text = formData.mdl_link_text_editor__text;
      const link = formData.mdl_link_text_editor__link;
      addLink(quillEditor, text, link);
    }
    document.getElementById('form__modal-link-text-editor').reset();
    saveCallback();
  };

  const addLink = (quillEditor, text, url) => {
    const position = selectedText ? selectedText.index : 0;
    quillEditor.insertText(position, text, 'user');
    quillEditor.setSelection(position, text.length);
    quillEditor.theme.tooltip.edit('link', url);
    quillEditor.theme.tooltip.save();
    quillEditor.setSelection(position + text.length, 0);
  };

  return (
    <Modal
      title="Add Link"
      centered
      className="modal-link-text-editor"
      visible={showModalLink}
      onCancel={handlePreventWithoutSave}
      maskClosable={false}
      footer={[
        <Button
          key="btn-cancel__modal-link-text-editor"
          onClick={handlePreventWithoutSave}>
          Cancel
        </Button>,
        <Button
          key="submit-link-text-editor"
          htmlType="submit"
          type="primary"
          form="form__modal-link-text-editor">
          Ok
        </Button>,
      ]}>
      <Form
        form={form}
        layout="vertical"
        id={'form__modal-link-text-editor'}
        onFinish={handleFormSubmission}>
        {mode === Mode.LINK_WITH_TEXT ? (
          <Form.Item
            label="Text"
            name="mdl_link_text_editor__text"
            rules={[{ required: true, message: 'Please specify text' }]}>
            <Input size="large" placeholder={'Text'} />
          </Form.Item>
        ) : undefined}
        <Form.Item
          label="Link"
          name="mdl_link_text_editor__link"
          rules={[{ required: true, message: 'Please specify link' }]}>
          <Input size="large" placeholder={'Link'} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const mapStateToProps = ({ teamList }) => ({
  teamList,
});

export default connect(mapStateToProps, {
    getTeamList,
  })(ModalLinkTextEditor)
