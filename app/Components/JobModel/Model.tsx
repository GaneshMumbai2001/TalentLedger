import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import Image from "next/image";
import payment from "../../../assets/payment.svg";

interface JobData {
  id?: number;
  name?: string;
  title?: string;
  role?: string;
  image?: any;
  rating?: string;
  description: string;
  location: string;
  skills: string[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobData;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, job }) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl h-full bg-white shadow-lg transition-transform transform duration-1000 ease-in-out py-5 px-10">
        <div onClick={onClose}>
          <FaArrowLeft />
        </div>
        <div className="flex space-x-3">
          <div className="py-4">
            <h2 className="text-xl font-bold">{job.title}</h2>
            <p className="text-[#747474]">Posted 1 hour ago </p>
            <p className="mt-5">{job.description}</p>
            <p className="text-xl mt-8 font-bold">Skills and Expertise</p>
            <div className=" px-3 py-2  flex flex-wrap gap-3 uppercase">
              {job?.skills?.map((skill: any, index: any) => (
                <span
                  key={index}
                  className="px-4 text-sm py-1 font-medium bg-[#E2E2E3] rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-xl mt-8 font-bold">Reviews</p>
          </div>
          <div className="bg-[#FBF4EE] w-full flex flex-col min-h-screen px-10  py-5 ">
            <div className="flex flex-col mx-5">
              <button className="bg-[#00CBA0] flex space-x-2 items-center  px-5 py-1 rounded-lg font-medium">
                <span>Apply Now</span> <FaArrowRight />
              </button>
              <button className="text-[#00CBA0] border-2 border-[#00CBA0] mt-4 flex space-x-2 items-center px-5 py-1 rounded-lg font-medium">
                <CiHeart /> <span>Save Job</span>
              </button>
            </div>
            <div>
              <p className="font-semibold text-xl mt-10">About the client</p>
              <div className="flex space-x-3 items-center">
                <Image src={payment} alt="" className="w-auto h-4" />{" "}
                <p className="text-[#747474] text-sm mt-3">
                  Payment method verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
