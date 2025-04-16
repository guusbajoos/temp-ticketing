import React, { useEffect, useRef } from "react";
import JoditEditor from "jodit-react";
import "./index.scss";
import { message } from "antd/lib";
import { notification } from "antd";

export default function EditorJodit({
  isCreateTicket = false,
  value,
  setValue,
  config,
}) {
  const [api, contextHolder] = notification.useNotification();

  const editor = useRef(null);

  const internalHandleChange = (newContent) => {
    setValue(newContent);
    const maxSize = 5 * 1024 * 1024;

    if (newContent.length > maxSize) {
      message.open({
        type: "error",
        content: `image exceeds maximum size 5 mb!`,
        duration: 5,
      });
      return false;
    }
    if (newContent.length < maxSize) {
      setValue(newContent);
    }
  };

  useEffect(() => {
    setValue(value || "");
  }, [value]);

  const openNotificationMaxSizeLimit = () => {
    api.info({
      message: "Info",
      description: `image exceeds maximum size 5 mb!`,
    });
  };

  return (
    <>
      {contextHolder}

      <JoditEditor
        ref={editor}
        value={value}
        config={{
          ...config,
          uploader: {
            ...config.uploader,
            prepareData: (formData) => {
              // Cek ukuran file
              if (
                formData.get("files") &&
                formData.get("files").size > 5 * 1024 * 1024
              ) {
                openNotificationMaxSizeLimit();
                return false;
              }

              formData.append(
                "object_purpose",
                `${
                  isCreateTicket
                    ? `image_description_ticket-${Date.now()}`
                    : `image_comment-${Date.now()}`
                } `
              );
              formData.append("object_file", formData.get("files"));
              formData.delete("path");
              formData.delete("source");
              formData.delete("files");
              return formData;
            },
            getMessage: function (resp) {
              if (resp) {
                api.info({
                  message: "Failed Upload!",
                  description: resp?.message,
                });
              }
              return resp.msg;
            },
          },
        }}
        onBlur={(e) => internalHandleChange(e)}
      />
    </>
  );
}
