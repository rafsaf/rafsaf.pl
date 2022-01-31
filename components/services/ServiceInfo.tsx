import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SingleService } from "../../pages/services";
import { setColor } from "../../styles";
import Spinner from "../globals/Spinner";

const BaseInformation = styled.a`
  display: block;
  margin: 1.8rem 0;
  width: 100%;
  min-height: 3.2rem;
  background-color: ${setColor.light};
  font-size: 1.25rem;
  padding: 0.5rem;
  color: ${setColor.mainBlack};
`;

const SuccessInformation = styled(BaseInformation)`
  background-color: ${setColor.serviceLiveBg};
  color: ${setColor.serviceLiveText};
`;

const ErrorInformation = styled(BaseInformation)`
  background-color: ${setColor.serviceDeadBg};
  color: ${setColor.serviceDeadText};
`;

const ServiceInfo = (props: SingleService) => {
  const [isAlive, setIsAlive] = useState<boolean | null>(null);
  const {
    data: { name, url },
  } = props;
  useEffect(() => {
    let mounted = true;
    setTimeout(() => {
      fetch(url, { mode: "no-cors" })
        .then((r) => {
          if (mounted === true) {
            setIsAlive(true);
          }
        })
        .catch((e) => {
          if (mounted === true) {
            setIsAlive(false);
          }
        });
    }, 700);

    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div>
      {isAlive === null && (
        <BaseInformation href={url}>
          <Spinner />
        </BaseInformation>
      )}
      {isAlive === true && (
        <SuccessInformation href={url} target="_blank">
          {url} &nbsp;&nbsp;-&nbsp;&nbsp; {name}
        </SuccessInformation>
      )}
      {isAlive === false && (
        <ErrorInformation href={url} target="_blank">
          {url} &nbsp;&nbsp;-&nbsp;&nbsp; {name}
        </ErrorInformation>
      )}
    </div>
  );
};

export default ServiceInfo;
