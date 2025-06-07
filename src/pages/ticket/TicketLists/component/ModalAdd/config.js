export const config = {
  toolbarAdaptive: false,
  lang: "id",
  enableDragAndDropFileToEditor: true,
  height: 350,
  tabIndex: 1,
  removeButtons: [
    "video",
    "source",
    "fullsize",
    "about",
    "outdent",
    "indent",
    "print",
    "table",
    "fontsize",
    "superscript",
    "subscript",
    "file",
    "cut",
    "selectall",
  ],
  disablePlugins: ["stat", "video"],
  textIcons: false,
  uploader: {
    url: `${import.meta.env.VITE_APP_API_URL}/api/objects`,
    method: "POST",
    filesVariableName() {
      return `files`;
    },
    withCredentials: false,
    pathVariableName: "path",
    format: "json",
    insertImageAsBase64URI: false,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    imagesExtensions: ["jpg", "png", "jpeg", "webp"],
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    isSuccess: function (resp) {
      return !resp.error;
    },
    process: function (resp) {
      return {
        files: resp.filename || [],
        baseurl: resp.url,
      };
    },
    defaultHandlerSuccess: function (data) {
      const url = data.baseurl || data.url;
      if (url) {
        const imgHtml = `<img src="${url}" style="width:100%" />`;
        if (this.selection && typeof this.selection.insertNode === "function") {
          const imageNode = this.ownerDocument.createElement("img");
          imageNode.src = url;
          imageNode.style.width = "100%";
          this.selection.insertNode(imageNode);
        } else if (
          this.jodit &&
          typeof this.jodit.selection?.insertHTML === "function"
        ) {
          this.jodit.selection.insertHTML(imgHtml);
        } else if (this.jodit && typeof this.jodit.value === "string") {
          this.jodit.value += imgHtml;
        }
      }
    },
    error: function (e) {
      this?.message?.message(e.getMessage(), "error", 4000);
    },
  },
  placeholder:
    "Insert description, image maximum size is 5 mb and maximum resolution is 2048x1084...",
  showXPathInStatusbar: false,
};
