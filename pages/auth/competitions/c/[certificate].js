import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import { AppPageHeader } from "../../../../components";
import CertificateSideBar from "../../../../components/modules/CertificatesModule/CertificateSidebar";
import CertificateContent from "../../../../components/modules/CertificatesModule/CertificateContent";
import PreHeaderNavBarCertificates from "../../../../components/modules/CertificatesModule/PreHeaderNavBarCertificates";
import BrandingFooter from "../../../../components/modules/profileModule/brandingFooter";
import { useRouter } from "next/router";
import Api from "../../../../services";
import { useSelector } from "react-redux";

const CertificatesPage = () => {
  const [screen, setScreen] = useState("TEXT");
  const router = useRouter();
  const { certificate } = router.query;

  const [certificateDetail, setCertificateDetail] = useState(null);
  const [cInstitute, setCInstitute] = useState(null);
  const [cSignees, setCSignees] = useState(null);
  const [certificateDetails, setCertificateDetails] = useState(null);
  const [placementsData, setPlacementsData] = useState(null);

  useEffect(() => {
    const getPlacements = async () => {
      try {
        const resp = await Api.get(`/placements/${certificate}`);
        if (resp.code && resp.result) {
          setPlacementsData(resp.result);
        }
      } catch (error) {
        throw new Error(error);
      }
    };

    if (certificate) {
      getPlacements();
    }
  }, [certificate]);

  useEffect(() => {
    if (certificate) {
      try {
        const getCertificateDetails = async () => {
          const resp = await Api.get(`/certificate/${certificate}`);
          if (resp.code && resp.result) {
            setCertificateDetails(resp.result);
            setCertificateDetail(resp.result);
            setCInstitute(resp.result.institute);
            setCSignees(resp.result.signees);
          }
        };

        getCertificateDetails();
      } catch (error) {
        console.log("Get Certificate Error: ", error);
      }
    }
  }, [certificate]);

  return (
    <div className="certificatesPage">
      <Layout>
        {/* <Layout.Header><AppPageHeader /></Layout.Header> */}
        <div className="certificatesPageWrapper">
          <PreHeaderNavBarCertificates
            screen={screen}
            certificateDetails={certificateDetails}
            setCertificateDetails={setCertificateDetails}
            certificateDetail={certificateDetail}
            setCertificateDetail={setCertificateDetail}
            institute={cInstitute}
            setInstitute={setCInstitute}
            signees={cSignees}
            setSignees={setCSignees}
            competitionCode={certificate}
          />
          <div className="certificatesPageScroller">
            <div className="certificatesPageContainer">
              <Layout className="certificatesPageHolder">
                <Layout.Sider className="certificatesPageSidebar">
                  <CertificateSideBar setScreen={setScreen} screen={screen} />
                </Layout.Sider>
                <Layout.Content className="certificatesPageContent">
                  <CertificateContent
                    screen={screen}
                    certificateCode={certificate}
                    certificateDetail={certificateDetail}
                    setCertificateDetail={setCertificateDetail}
                    institute={cInstitute}
                    setInstitute={setCInstitute}
                    signees={cSignees}
                    setSignees={setCSignees}
                    placementsData={placementsData}
                  />
                </Layout.Content>
              </Layout>
            </div>
            <BrandingFooter />
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default CertificatesPage;
