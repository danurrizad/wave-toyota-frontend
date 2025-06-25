/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

// Qr Scanner
import QrScanner from "qr-scanner";
import { useNavigate } from "react-router-dom";

const QRtoLink = ({setShowModal}) => {
  // QR States
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  const audioRef = useRef(null)

  const navigate = useNavigate()

  // Success
  const onScanSuccess = (result) => {
     // Play the success sound
    if (audioRef.current) {
        audioRef.current.play().catch((err) => console.error("Audio play error:", err));
    }

    // ✅ Handle success.
    navigate(result.data)
    setShowModal(false)
  };

  // Fail
  const onScanFail = (err) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className="container-qr-scanner">
        <div className="scanner-border">
            <div className="corner-top-left"></div>
            <div className="corner-top-right"></div>
            <div className="corner-bottom-left"></div>
            <div className="corner-bottom-right"></div>
        </div>


        <video className="qr-scanner" ref={videoEl}></video>
        <div ref={qrBoxEl} className="qr-"></div>

        <audio ref={audioRef} src="/src/assets/sounds/scanned.mp3" preload="auto"></audio>
    </div>
  );
};

export default QRtoLink;