import AllCollections from "@/components/AllCollections";
import NewCollection from "@/components/NewCollection";
import NewThisWeek from "@/components/NewThisWeek";
import { ToastContainer } from "react-toastify";

const Index = () => {
  return (
    <div>
      <ToastContainer autoClose={1000} />
      <NewCollection />
      <NewThisWeek />
      <AllCollections />
      
    </div>
  );
};

export default Index;
