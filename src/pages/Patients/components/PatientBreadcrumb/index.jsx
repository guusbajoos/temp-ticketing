import { Breadcrumb, Typography } from "antd";
import { wordsCapitalize } from "utils/index";

const PatientBreadcrumb = ({ pageTitle, patient }) => {
  return (
    <div style={{ marginBottom: 38 }}>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: pageTitle,
          },
          {
            title: (
              <Typography.Text strong>
                {wordsCapitalize(patient) || "-"}
              </Typography.Text>
            ),
          },
        ]}
      />
    </div>
  );
};

export default PatientBreadcrumb;
