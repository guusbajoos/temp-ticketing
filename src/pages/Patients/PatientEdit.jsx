/* eslint-disable no-unused-vars */
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { usePatients } from "./hooks";
import { Content } from "antd/es/layout/layout";
import PatientBreadcrumb from "./components/PatientBreadcrumb";
import { useEffect } from "react";
import { PageSpinner } from "components/PageSpinner";
import { Button, Col, Form, Input, Row, Typography, notification } from "antd";

const PatientEdit = () => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const { phoneNumber } = useParams();

  const {
    getPatientByPhoneNumber,
    patients,
    updatePatientProfileExtra,
    resetStatus,
  } = usePatients();
  const { getPatientByPhone, updatePatientProfile } = patients;

  const handleSubmitPatient = (values) => updatePatientProfileExtra(values);

  useEffect(() => {
    if (phoneNumber) getPatientByPhoneNumber(phoneNumber);
  }, [phoneNumber]);

  useEffect(() => {
    if (getPatientByPhone.status === "FAILED") {
      api.error({
        message: getPatientByPhone.error.message,
        description: getPatientByPhone.error.description,
        duration: 3,
      });
    }
  }, [getPatientByPhone.status]);

  useEffect(() => {
    if (updatePatientProfile.status === "SUCCESS") {
      resetStatus();
      api.success({
        message: "Success",
        description: "Patient profile updated successfully",
        duration: 3,
      });
      setTimeout(() => {
        navigate(
          searchParams.get("from") === "detail-patient"
            ? `/patients/detail/${phoneNumber}`
            : `/patients`
        );
      }, 1500);
    }
    if (updatePatientProfile.status === "FAILED") {
      api.error({
        message: updatePatientProfile.error.message,
        description: updatePatientProfile.error.description,
        duration: 3,
      });
    }
  }, [updatePatientProfile.status, searchParams]);

  if (getPatientByPhone.status === "LOADING") return <PageSpinner />;

  return (
    <>
      {contextHolder}
      <Content>
        <PatientBreadcrumb
          pageTitle="Edit Patient Detail"
          patient={getPatientByPhone?.detail?.patient?.patient_name}
        />
        <Row>
          <Col xs={12}>
            <Form
              layout="vertical"
              onFinish={handleSubmitPatient}
              initialValues={{
                patientPhone:
                  getPatientByPhone?.detail?.patient?.phone?.main_phone || "",
                anotherPhone:
                  getPatientByPhone?.detail?.patient?.phone?.secondary_phone ||
                  "",
                infoBipAccountUrl:
                  getPatientByPhone?.detail?.profile?.infobip || "",
              }}
              scrollToFirstError
            >
              <Form.Item label="Name">
                <Input
                  size="large"
                  placeholder="Input name"
                  value={getPatientByPhone?.detail?.patient?.patient_name}
                  disabled
                />
              </Form.Item>
              <Form.Item label="Phone" name="patientPhone">
                <Input
                  size="large"
                  placeholder="Input main phone number"
                  disabled
                  // maxLength={13}
                />
              </Form.Item>
              <Form.Item
                label="Secondary Phone"
                name="anotherPhone"
                rules={[
                  {
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Please enter valid phone number",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Input secondary phone number"
                  // maxLength={13}
                />
              </Form.Item>
              <Form.Item label="BE Profile Address">
                <Input
                  size="large"
                  placeholder="Input be profile address"
                  value={getPatientByPhone?.detail?.profile?.be}
                  disabled
                />
              </Form.Item>
              <Form.Item label="Medical Record">
                <Input
                  size="large"
                  placeholder="Input medical record address"
                  value={getPatientByPhone?.detail?.profile?.emr}
                  disabled
                />
              </Form.Item>
              <div style={{ marginBottom: 24 }}>
                <Form.Item
                  label="Infobip Profile Address"
                  name="infoBipAccountUrl"
                  rules={[
                    {
                      pattern: new RegExp(
                        /^(http|https):\/\/portal.infobip.com\/people\/persons\/\d+\/overview$/
                      ),
                      message: "Please enter valid infobip address",
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    size="large"
                    placeholder="Input infobip profile address"
                  />
                </Form.Item>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  <i>
                    e.g:
                    https://portal.infobip.com/people/persons/763376/overview
                  </i>
                </Typography.Text>
              </div>

              <div style={{ textAlign: "right" }}>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{ width: 115, borderRadius: 2 }}
                  loading={updatePatientProfile.status === "LOADING"}
                >
                  Save Data
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default PatientEdit;
