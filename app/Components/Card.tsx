import Image from 'next/image';

const Card = ({ number, title, description, imageSrc, isVisible }) => {
  return (
    <div className={`flex-col items-center vm text-white space-y-5 md:px-5 px-1 justify-center text-center pt-5 md:pt-10 pb-5 md:pb-40 ${isVisible ? 'animate' : ''}`}>
      <p className="text-sm md:text-2xl font-sans">{number}</p>
      <div className="flex pt-5 md:pt-12 mb-3 md:mb-5 justify-center">
        <Image src={imageSrc} className="md:w-auto md:h-auto h-8 w-8" alt="" />
      </div>
      <p className="text-sm text-center md:text-4xl font-semibold">{title}</p>
      <p className="text-sm text-center">{description}</p>
    </div>
  );
};

export default Card;
