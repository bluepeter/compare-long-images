import React, { useEffect, useState } from "react";
import { MobXProviderContext, observer } from "mobx-react";
import CenteredBigRefresher from "../CenteredBigRefresher";
import { track } from "../../../utils/helpers";
import { s3URL } from "../../../utils/helpers";
import ReactCompareImage from "react-compare-image";
import SizeAware from "../SizeAware";

const Component = observer(() => {
  useEffect(() => {
    track("opened sliderviewer");
  }, []);

  const { captureStore } = React.useContext(MobXProviderContext);
  const {
    currentCapture,
    previousCaptures,
    compareToEarlierVersion,
    inProgress,
  } = captureStore;
  let s3Current;
  let s3Previous;
  const [maxHeight, setHeight] = useState(0);
  const onSize = size => {
    if (size.height > maxHeight) {
      setHeight(size.height);
      console.log(size.height);
    }
  };

  if (!inProgress) {
    s3Previous = s3URL(
      previousCaptures[compareToEarlierVersion].result.path,
      "compareTarget"
    );
    s3Current = s3URL(currentCapture.path, "compareTarget");
  }

  return inProgress ? (
    <CenteredBigRefresher />
  ) : (
    <div style={{ position: "relative" }}>
      {/* Following two images are used to set height of page based on height of images. */}
      <div>
        <table style={{ width: "100%", height: "100%" }}>
          <tbody>
            <tr>
              <td style={{ height: "1px", overflow: "hidden" }}>
                <SizeAware onSize={onSize}>
                  <div>
                    <img src={s3Previous} style={{ width: "100%" }} alt="" />
                    <img src={s3Current} style={{ width: "100%" }} alt="" />
                  </div>
                </SizeAware>
              </td>
            </tr>
            <tr>
              <td>
                <ReactCompareImage
                  leftImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  leftImageCss={{
                    background: `no-repeat top/100% url("${s3Previous}") #fff`,
                    height: maxHeight + "px",
                  }}
                  rightImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  rightImageCss={{
                    background: `no-repeat top/100% url("${s3Current}") #fff`,
                    height: maxHeight + "px",
                  }}
                  skeleton={<CenteredBigRefresher />}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});