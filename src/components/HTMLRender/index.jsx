import DOMPurify from "isomorphic-dompurify";

export default function HtmlRender({ content }) {
  return (
    <div
      className="html-render"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}></div>
  );
}
