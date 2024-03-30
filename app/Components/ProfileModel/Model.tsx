import Image from "next/image";
import React from "react";
import star from "../../../assets/star.svg";
import send from "../../../assets/send.svg";
import Link from "next/link";

interface GigData {
  id?: number;
  name?: string;
  designation?: string;
  profileImage?: any;
  rating?: string;
  description: string;
  location: string;
  skills: string[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: GigData;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-2xl">
        <button
          onClick={onClose}
          className="float-right text-white bg-black rounded-full px-3 py-1 font-bold"
        >
          X
        </button>
        <div className="">
          <div className="flex items-center px-10 justify-between">
            <div className="flex space-x-5  items-center">
              <Image
                src={data.profileImage}
                alt="img"
                width="100"
                height="100"
                className="rounded-full"
              />
              <div>
                <p className="text-lg font-bold">{data.name}</p>
                <p>{data.designation}</p>
                <div className="flex  items-center space-x-2">
                  <Image src={star} alt="home" className="h-4  w-auto" />
                  <p>{data.rating}/5 </p>
                </div>
              </div>
            </div>
            <div>
              <button className="bg-[#00CBA0] font-semibold text-md px-5 py-2 rounded-lg ">
                More about me
              </button>
            </div>
          </div>
          <div className="px-10">
            <p className="text-lg font-bold pt-5 pb-2">About me</p>
            <div className="flex space-x-20">
              <p className="w-[650px] ">{data.description}</p>
              <div className="bg-[#FBF4EE] px-6 py-4 rounded-lg">
                <div className="flex  space-x-5  items-center">
                  <Image
                    src={data.profileImage}
                    alt="img"
                    width="50"
                    height="50"
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-lg font-bold">{data.name}</p>
                    <p>{data.designation}</p>
                    <div className="flex  items-center space-x-2">
                      <Image src={star} alt="home" className="h-4  w-auto" />
                      <p>{data.rating}/5 </p>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/Dashboard/${data.name}/Connect?user=${data.name}?designation=${data.designation}`}
                >
                  <button className="bg-black items-center flex space-x-3 mt-3 text-lg font-semibold text-white px-20 py-2 rounded-lg">
                    <Image src={send} alt="" />
                    <p> Contact me</p>
                  </button>
                </Link>
              </div>
            </div>
            <p className="text-lg font-bold pt-5 pb-2">Skills</p>
            <div className=" px-3 py-2  flex flex-wrap gap-4 uppercase">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-6 py-1 font-medium bg-[#E2E2E3] rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
