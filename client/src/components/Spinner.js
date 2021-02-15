import LoadingOverlay from "react-loading-overlay";
import BounceLoader from "react-spinners/BounceLoader";
import "./spinner.css";
import { css } from "@emotion/core";

const override = css`
  display: block;
  margin: -200px auto 0 auto;
`;

export default function Spinner({ isLoading, children } = props) {
  return (
    <LoadingOverlay
      spinner={<BounceLoader size={150} css={override} />}
      text="Please wait..."
      active={isLoading}
    >
      {children}
    </LoadingOverlay>
  );
}
