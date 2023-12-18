import React, { useContext, useEffect, useState } from "react";
import { JSEncrypt } from "jsencrypt";
import CryptoJS from "crypto-js";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Shared/Context/Auth-context";
import { message } from "antd";
import "./SendMessage.css"
const SendMessage = () => {
  let imageData;
  let encryptedKeyandText;
  const { id } = useParams();
  const auth = useContext(AuthContext);
  const [userData, setUserData] = useState("");
  const [senderData, setSenderData] = useState("");

  function showDiv5() {
    var step5 = document.getElementById("step5");
    step5.style.display = "block";
  }
  const handleCombinedClick = () => {
    encryptButton();
    showDiv5();
    hideTextInLLSubband();
  };
  const handleSend = () => {
    applyInverseHaarTransform();
    handleSubmit();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://steganography.onrender.com/api/hiddenwhisper/user/getuser/byid/${id}`
        );
        const jsonData = await response.json();
        setUserData(jsonData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserData();
    const fetchSenderData = async () => {
      try {
        const response = await fetch(
          `https://steganography.onrender.com/api/hiddenwhisper/user/getuser/byid/${auth.userId}`
        );
        const jsonData = await response.json();
        setSenderData(jsonData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSenderData();
  }, []);
  // Assuming stegoCanvas is defined somewhere in your component or file

  const handleSubmit = async (event) => {
    const stegoCanvas = document.getElementById("original-canvas");
    try {
      const formData = new FormData();
      formData.append("senderEmail", senderData.user.email);
      formData.append("senderName", senderData.user.name);
      formData.append("receiverEmail", userData.user.email);

      // Get the canvas data as a Blob
      stegoCanvas.toBlob((blob) => {
        // Create a File from the Blob and append it to FormData
        const file = new File([blob], "stego_image.png", { type: "image/png" });
        formData.append("image", file);

        // Send the request
        fetch(`https://steganography.onrender.com/api/hiddenwhisper/message/createmessage`, {
          method: "POST",
          body: formData,
          // No need to set Content-Type header for FormData
        }).then((response) => response.json());

        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      });

      message.success("Message successfully sent");
    } catch (err) {
      console.error(err);
    }
  };

  const encryptButton = async () => {
    const fileInput = document.getElementById("file-upload");

    // Check if required elements are found
    if (!fileInput) {
      alert("Required elements not found.");
      return;
    }

    const file = fileInput.files[0];
    if (!file) {
      alert("Please select a text file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileContent = event.target.result;
      let recipientPublicKey;
      if (userData != 0) {
        recipientPublicKey = userData.user.publicKey;
      }
      console.log(recipientPublicKey);
      if (!recipientPublicKey) {
        alert("Please enter the recipient's public key.");
        return;
      }

      const rsa = new JSEncrypt();
      rsa.setPublicKey(recipientPublicKey);

      const aesKey = await generateAesKey();

      const encryptedText = CryptoJS.AES.encrypt(
        fileContent,
        aesKey
      ).toString();

      const aesKeyEncrypted = rsa.encrypt(aesKey);

      const encryptedBlobText = new Blob([encryptedText], {
        type: "text/plain",
      });

      const encryptedBlobKey = new Blob([aesKeyEncrypted], {
        type: "text/plain",
      });

      let encryptedRealText = "encryptedText:" + encryptedText + ";end";
      let encryptedRealKey = "encryptedKey:" + aesKeyEncrypted + ";end";
      encryptedKeyandText = textToBinary(encryptedRealText + encryptedRealKey);
      console.log(encryptedKeyandText);
    };

    reader.readAsText(file);
  };

  async function generateAesKey() {
    try {
      const key = await crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );

      const keyData = await crypto.subtle.exportKey("raw", key);

      const aesKey = Array.from(new Uint8Array(keyData))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      return aesKey;
    } catch (error) {
      console.error("Error generating AES key:", error);
      throw error;
    }
  }
  function convertToGrayscale(imageData) {
    const grayscaleData = new Uint8Array(imageData.width * imageData.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      grayscaleData[i / 4] =
        (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    }
    return grayscaleData;
  }

  function applyHaarTransform(data, width, height) {
    const llCanvas = document.getElementById("original-canvas");
    llCanvas.style.display = "block";
    llCanvas.width = width / 2;
    llCanvas.height = height / 2;
    const llContext = llCanvas.getContext("2d");

    for (let y = 0; y < height / 2; y++) {
      for (let x = 0; x < width / 2; x++) {
        const index = y * (width / 2) + x;
        const llValue = data[2 * y * width + 2 * x];
        llContext.fillStyle = `rgb(${llValue}, ${llValue}, ${llValue})`;
        llContext.fillRect(x, y, 1, 1);
      }
    }
  }
  function applyInverseHaarTransform() {
    const llCanvas = document.getElementById("original-canvas");
    if (!llCanvas) {
      alert(
        "Please select an image and apply Haar wavelet transformation first."
      );
      return;
    }

    const llContext = llCanvas.getContext("2d");
    const llImageData = llContext.getImageData(
      0,
      0,
      llCanvas.width,
      llCanvas.height
    );
    const llData = new Uint8Array(llImageData.data.buffer);

    for (let i = 0; i < encryptedKeyandText.length; i++) {
      llData[i] = (llData[i] & 0xfe) | parseInt(encryptedKeyandText[i], 2);
    }

    llContext.putImageData(llImageData, 0, 0);

    const stegoCanvas = llCanvas;
    const downloadLinkStego = document.getElementById("download-link-stego");

    downloadLinkStego.href = stegoCanvas.toDataURL("image/png");
    downloadLinkStego.style.display = "block";
  }

  function applySteganography() {
    const imageInput = document.getElementById("image-input");
    const originalCanvas = document.getElementById("original-canvas");
    const context = originalCanvas.getContext("2d");

    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
          originalCanvas.style.display = "block";
          originalCanvas.width = img.width;
          originalCanvas.height = img.height;
          context.drawImage(img, 0, 0);
          imageData = context.getImageData(0, 0, img.width, img.height);
          applyHaarTransform(
            convertToGrayscale(imageData),
            img.width,
            img.height
          );
        };
      };
      reader.readAsDataURL(imageInput.files[0]);
      var step2 = document.getElementById("step2");
      step2.style.display = "block";
    } else {
      originalCanvas.style.display = "none";
    }
  }

  function textToBinary(text) {
    return text
      .split("")
      .map((char) => {
        const binary = char.charCodeAt(0).toString(2);
        return "0".repeat(8 - binary.length) + binary;
      })
      .join("");
  }

  function hideTextInLLSubband() {
    if (encryptedKeyandText) {
      if (!encryptedKeyandText) {
        alert("Please enter text and convert it to binary.");
        return;
      }

      const llCanvas = document.getElementById("original-canvas");
      if (!llCanvas) {
        alert(
          "Please select an image and apply Haar wavelet transformation first."
        );
        return;
      }

      const llContext = llCanvas.getContext("2d");
      const llImageData = llContext.getImageData(
        0,
        0,
        llCanvas.width,
        llCanvas.height
      );
      const llData = new Uint8Array(llImageData.data.buffer);

      for (let i = 0; i < encryptedKeyandText.length; i++) {
        llData[i] = (llData[i] & 0xfe) | parseInt(encryptedKeyandText[i], 2);
      }

      llContext.putImageData(llImageData, 0, 0);
      var step6 = document.getElementById("step6");
      step6.style.display = "block";
    }
  }

  return (
    <div>
      
      <div className="step1 box arrow-left">
      
        <h3>Step 1</h3>
        <label>
          Select an image (The higher the resolution of the image the higher the
          data that you can save )
        </label>
        <input
          type="file"
          id="image-input"
          accept="image/*"
          onChange={applySteganography}
        />
        <br />
        <br />
        <canvas id="original-canvas" style={{ display: "none" }}></canvas>
        <canvas id="stego-canvas" style={{ display: "none" }}></canvas>
      </div>
      <br />
      <div className="step2 box arrow-left" id="step2" style={{ display: "none" }}>
        <h3>Step 2</h3>
        <label>Select an text file</label>
        <input
          type="file"
          id="file-upload"
          accept=".txt"
          onChange={handleCombinedClick}
        />
      </div>
      <br />

      <br />
      <div className="step5 box arrow-left" id="step5" style={{ display: "none" }}>
        <h3>Step 3</h3>
        <button onClick={hideTextInLLSubband}>Embed Text</button>
      </div>
      <br />
      <div className="step6 box arrow-left" id="step6" style={{ display: "none" }}>
        <h3>Step 4</h3>
        <button onClick={handleSend}>Reconstruct Stego Image</button>

        <a
          id="download-link-stego"
          style={{ display: "none" }}
          download="stego_image.png"
        >
          Download Stego Image
        </a>
      </div>
    </div>
  );
};
export default SendMessage;
