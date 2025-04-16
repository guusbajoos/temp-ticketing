import { Card, Typography } from "antd";

const PatientProfile = ({ labelCard, value, labelValue, labelNotFound }) => {
  return (
    <Card
      bodyStyle={{ borderRadius: 0, padding: 16 }}
      style={{ borderRadius: 0 }}>
      <div style={{ marginBottom: 10 }}>
        <Typography.Text strong>{labelCard}</Typography.Text>
      </div>
      <div>
        {value ? (
          <a
            href={value}
            rel="noopener noreferrer"
            target="_blank"
            style={{ color: "#1890ff", textDecoration: "underline" }}>
            {labelValue}
          </a>
        ) : (
          <Typography.Text>{labelNotFound}</Typography.Text>
        )}
      </div>
    </Card>
  );
};

export default PatientProfile;
