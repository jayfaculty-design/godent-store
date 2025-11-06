import AllCollections from "@/components/AllCollections";
import CallToAction from "@/components/CallToAction";
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
      <CallToAction />
    </div>
  );
};

export default Index;
