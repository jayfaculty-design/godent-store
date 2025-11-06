import NewCollection from "@/components/NewCollection";
import { ToastContainer } from "react-toastify";

const Index = () => {
  return (
    <div>
      <ToastContainer autoClose={1000} />
      <NewCollection />
    </div>
  );
};

export default Index;
