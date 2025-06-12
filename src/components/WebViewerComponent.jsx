import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";

const WebViewerComponent = () => {
  const [instance, setInstance] = useState();
  console.log("instance", instance);

  const viewer = useRef(null);

  const initWebviewer = () => {
    WebViewer(
      {
        path: "./webviewer/lib",
        initialDoc: "./files/PDFTRON_about.pdf",
        ui: "legacy",
        licenseKey: 'Linde GmbH:OEM:Linde Engineering Redlining and Comparis::B+:AMS(20270128):333A7DFBE786BE2368D2194F615F486DBDFCA14E241509872CC9D65A8ABEF5C7',
      },
      viewer.current
    ).then((instance) => {
      setInstance(instance);
      const { Feature } = instance.UI;

      instance.UI.enableFeatures([Feature.FilePicker, Feature.MultiViewerMode]);
    })
  }
  useEffect(() => {
    initWebviewer();
  }, []);

  return (
    <div className="App">
      <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>
    </div>
  );
};

export default WebViewerComponent;
