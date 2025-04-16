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
  disablePlugins: ["paste", "stat", "video"],
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
      const field = "files";
      if (data[field] && data[field].length) {
        const jodit = this?.s?.jodit;
        const image = jodit.createInside.element("img");
        image.src = data.baseurl;
        image.style.width = "100%";
        this?.s?.insertImage(image);
      }
    },
    error: function (e) {
      this?.message?.message(e.getMessage(), "error", 4000);
    },
  },
  placeholder: "Insert Comment...",
  showXPathInStatusbar: false,
};
