import { Typography } from "antd";
import { wordsCapitalize } from "utils/index";

const PatientInfo = ({ label, value, secondaryPhone }) => {
  return (
    <div
      style={{
        marginBottom: 12,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}>
      <div style={{ width: "20%" }}>
        <Typography.Text>{label}</Typography.Text>
      </div>
      <div style={{ width: "80%" }}>
        <Typography.Text strong>
          {wordsCapitalize(value) || "-"}
        </Typography.Text>
        {secondaryPhone && (
          <>
            , <Typography.Text>{secondaryPhone}.</Typography.Text>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientInfo;
