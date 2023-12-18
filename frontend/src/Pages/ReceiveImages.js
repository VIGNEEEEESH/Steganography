import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Shared/Context/Auth-context";
import JSEncrypt from "jsencrypt";
import cryptoJs from "crypto-js";
import { Card, Avatar, Button } from "antd";
import "./SendMessage.css";
import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
const { Meta } = Card;
const ReceiveImages = () => {
  let extractedTextandKey;
  let encryptedText;
  let encryptedKey;
  const handleDownload = (imageUrl, imageName) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageName;
    link.target = "_blank"; // Add this line to open the link in a new tab/window
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const decryptedTextPre = document.getElementById("decrypted-text");
  const [userData, setUserData] = useState("");
  const [imageData, setImageData] = useState("");
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://steganography.onrender.com/api/hiddenwhisper/user/getuser/byid/${auth.userId}`
        );
        const jsonData = await response.json();
        setUserData(jsonData);
        console.log(jsonData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserData();
  }, []);
  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch(
          `https://steganography.onrender.com/api/hiddenwhisper/message/getmessage/byemail/${userData.user.email}`
        );
        const jsonData = await response.json();
        setImageData(jsonData);
        console.log(jsonData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchImageData();
  }, [userData]);
  function showDiv2() {
    var step2 = document.getElementById("step2");
    step2.style.display = "block";
  }
  let recipientRsa = null;

  if (userData != 0) {
    recipientRsa = new JSEncrypt();
    recipientRsa.setPrivateKey(userData.user.privateKey);
  }

  function Imageset(e) {
    const input = e.target;
    const image = input.files[0];

    if (image) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function () {
          const canvas = document.getElementById("original-canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0, img.width, img.height);
        };
      };

      reader.readAsDataURL(image);
    }
  }
  function extractTextFromLLSubband() {
    const llCanvas = document.getElementById("original-canvas");
    if (!llCanvas) {
      alert(
        "LL subband not found. Please apply Haar wavelet transformation first."
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

    let binaryText = "";
    for (let i = 0; i < llData.length; i++) {
      const lsb = llData[i] & 0x01; // Extract the least significant bit
      binaryText += lsb;
    }

    extractedTextandKey = binaryToText(binaryText);

    const parts = extractedTextandKey.split(";end");

    encryptedText = parts[0].split(":")[1];
    encryptedKey = parts[1].split(":")[1];

    console.log("Encrypted Text:", encryptedText);
    console.log("Encrypted Key:", encryptedKey);
    var step3 = document.getElementById("step3");
    step3.style.display = "block";
  }

  function binaryToText(binary) {
    const binaryArray = binary.match(/.{8}/g);
    const text = binaryArray
      .map((chunk) => String.fromCharCode(parseInt(chunk, 2)))
      .join("");
    return text;
  }
  const decryptButtonn = async () => {
    if (!encryptedText) {
      alert("Please check with the encrypted text");
      return;
    }

    if (!encryptedKey) {
      alert("Please check with the encrypted key");
      return;
    }
    const keyContent = encryptedKey;
    const rsa = recipientRsa;

    let aesKey;
    try {
      aesKey = await rsa.decrypt(keyContent);
    } catch (error) {
      console.error("Error decrypting AES key:", error);
      alert("Failed to decrypt the AES key. Please check the private key.");
      return;
    }

    if (!aesKey) {
      alert("Failed to decrypt the AES key. Please check the private key.");
      return;
    }

    console.log("AES Key:", aesKey);

    const textContent = encryptedText;

    try {
      const encryptedTextContent = textContent;
      const decryptedTextContent = cryptoJs.AES.decrypt(
        encryptedTextContent,
        aesKey
      ).toString(cryptoJs.enc.Utf8);
      console.log("Decrypted Content:", decryptedTextContent);
      decryptedTextPre.textContent = decryptedTextContent;
    } catch (error) {
      console.error("Error decrypting file content:", error);
      alert(
        "Failed to decrypt the file content. Please check the private key or the file format."
      );
    }
  };
  return (
    <div>
     <center> <h1>Received Messages</h1></center>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          overflowX: "auto",
          padding: "100px",
        }}
      >
        {imageData?.messages?.map((message, index) => (
          <Card
            key={index}
            style={{ width: `calc(25% - 16px)`, marginBottom: 16 }}
            cover={
              <img
                alt="Stego Image"
                src={`https://steganography.onrender.com/${message.image}`}
              />
            }
            actions={[
              <Button
                icon={<DownloadOutlined />}
                onClick={() =>
                  handleDownload(
                    `https://steganography.onrender.com/${message.image}`,
                    `download-${index}`
                  )
                }
              >
                Download
              </Button>,
            ]}
          >
            <Meta
              avatar={
                <Avatar
                  src={`https://steganography.onrender.com/${message.image}`}
                />
              }
              title={message.senderName}
              description={`Sender Email: ${message.senderEmail}, Sender Name: ${message.senderName}`}
            />
          </Card>
        ))}
      </div>

      <div className="step1 box arrow-left" id="step1">
        <h3>Step 1</h3>
        <label>Select a stegnographed image: </label>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          onInput={showDiv2}
          onChange={Imageset}
        />
        <canvas id="original-canvas" style={{ display: "none" }}></canvas>
      </div>
      <br />
      <div
        className="step2 box arrow-left"
        id="step2"
        style={{ display: "none" }}
      >
        <h3>Step 2</h3>
        <button onClick={extractTextFromLLSubband}>
          Extract content from the image
        </button>
      </div>
      <br />
      <div
        className="step3 box arrow-left"
        id="step3"
        style={{ display: "none" }}
      >
        <h3>Step 3</h3>
        <button id="decrypt-button" onClick={decryptButtonn}>
          Decrypt
        </button>
        <br />
        <p>Decrypted Text:</p>
        <pre id="decrypted-text"></pre>
      </div>
    </div>
  );
};
export default ReceiveImages;
