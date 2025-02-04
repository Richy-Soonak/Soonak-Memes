"use client";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

import Dropzone from "react-dropzone";
import useNotification from "@/hooks/useNotification";
import { Preview } from "@/types/share";
// import { WebIrys } from "@irys/sdk";

const acceptables = ["image/png", "image/jpg"];

interface IProps {
  isInvalid: boolean;
  preview?: Preview;
  setPreview: React.Dispatch<React.SetStateAction<Preview | undefined>>;
  setFile:any;
}

const Uploader: React.FC<IProps> = ({ isInvalid, preview, setPreview, setFile }) => {
  const [selected, setSelected] = React.useState<string>("");
  const [uploadedUrl, setUploadedUrl] = React.useState<string>('');
  const { showNotification } = useNotification();
  const onDrop = async (files: File[]) => {
    try {
      const file: File = files[0]; 
      if (!file) throw "Emptry file";
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg" &&
        file.type !== "image/png"
      ) {
        throw "Image file must be jpeg, jpg or png";
      }
      if (file.size > 1024 * 1024 * 2)
        throw "Overflow maximum file size (1GB).";
      const img = new Image();
      img.src = URL.createObjectURL(file);

      // Wait for the image to load and check its dimensions
      await new Promise((resolve, reject) => {
        img.onload = () => {
          if (img.width === 1600 && img.height === 900) {
            resolve(null); // Dimensions are correct
          } else {
            reject("Image must be exactly 1600x900 pixels.");
          }
        };
        img.onerror = () => reject("Failed to load image.");
      });
      setSelected(file.name);
      setFile(file);
      const reader = new window.FileReader();
      const dataurl = reader.readAsDataURL(file);
      console.log("dataurl", dataurl)
      reader.onloadend = async (e) => {
        const _file: Preview = { type: file.type, data: String(reader.result) };
        setPreview(_file);
        console.log(_file, "filename")
      };
    } catch (err) {
      showNotification(String(err), "warning");
      setPreview(undefined);
    }
  };

  
  return (
    <Dropzone onDrop={onDrop} multiple={false}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div>
          <div
            {...getRootProps({ className: "dropzone" })}
            id="upload"
            className={`bg-[#F0F8FF] cursor-pointer ${
              isDragActive && "!border-[#98bdea52] border-dashed"
            } dark:bg-[#3e8ed42f] border-2 border-[#3E8ED4] border-dashed py-4 rounded-2xl mt-3 flex justify-center items-center`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col gap-3 cursor-pointer hover:opacity-60 items-center">
              <div className="dark:text-white text-xs flex flex-col items-center justify-center">
                <Icon
                  icon="solar:gallery-wide-bold-duotone"
                  className="text-5xl"
                />
                <p>
                  drop your image here, or{" "}
                  <span className="text-blue-500">Browse</span>
                </p>
                {/* {selected ? selected : "JPG, PNG. Max 2MB."} */}
              </div>
            </div>
          </div>
          <p className="text-red-800 text-[11px] px-2 h-3">
            {isInvalid && !preview ? "Select logo Image for your project" : ""}
          </p>
        </div>
      )}
    </Dropzone>
  );
};

export default Uploader;
