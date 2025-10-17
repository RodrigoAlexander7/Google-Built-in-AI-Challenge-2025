import Image from "next/image";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/NavBar";
export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-10 sm:p-20">
      <Navbar></Navbar>
      <Footer></Footer>
    </div>
  );
}
