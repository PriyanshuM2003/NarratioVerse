import Image from "next/image";
import React from "react";

const Collage = () => {
  return (
    <>
      <div className="grid grid-cols-2">
        <div>
          <Image src="./narratioverse1.jpg" alt="1" width={347} height={347} />
        </div>
        <div>
          <Image src="./narratioverse2.jpg" alt="2" width={347} height={347} />
        </div>
        <div>
          <Image src="./narratioverse3.jpg" alt="3" width={347} height={347} />
        </div>
        <div>
          <Image src="./narratioverse4.jpg" alt="4" width={347} height={347} />
        </div>
      </div>
    </>
  );
};

export default Collage;
