import Lottie from "lottie-react";
import loadingAnimation from "@/assets/lottie/Loading-Lottie.json"

const FullPageLoader = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-48">
        <Lottie
          animationData={loadingAnimation}
          loop
        />
      </div>
    </div>
  );
};

export default FullPageLoader;
