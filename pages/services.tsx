import React from "react";
import Head from "next/head";
import styled from "styled-components";
import { setColor } from "../styles";
import ServicesJSON from "../data/Services.json";
import ServiceInfo from "../components/services/ServiceInfo";

export interface SingleService {
  data: {
    url: string;
    name: string;
  };
}

const services: SingleService[] = ServicesJSON;

const Services = () => {
  return (
    <>
      <Head>
        <title>Rafał Safin | Projects</title>
        <meta name="description" content="Rafał Safin portfolio services" />
      </Head>
      <Wrapper>
        <h2>My services</h2>

        <p>
          I host my projects, domains, storage on many different environments,
          including some of most popular public clouds out there: Google Cloud,
          AWS, Oracle Cloud, OVH Cloud and my own self hosted Proxmox server
          with couple of VMs inside and Kubernetes K3s cluster among them. Also
          using GitHub-pages, Netlify, Readthedocs.
          <br />
          <br />
          You can check availability of each below.
        </p>
        <ServicesWrapper>
          {services.map((service) => (
            <ServiceInfo data={service.data} key={service.data.url} />
          ))}
        </ServicesWrapper>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  width: 90vw;
  margin: 0 auto;
  color: ${setColor.mainBlack};
  padding: 2rem 0;
  padding-top: 0.3rem;
  max-width: 1278px;
  @media (min-width: 768px) {
    padding-top: 2.5rem;
    width: 60vw;
  }
  p {
    padding-top: 1rem;
    font-size: 1.3rem;
    margin-bottom: 2rem;
  }
`;

const ServicesWrapper = styled.div`
  margin: 1rem 0 7rem 0;
`;

export default Services;
