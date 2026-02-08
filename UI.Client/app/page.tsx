import Image from "next/image";
import { AuthProvider } from "./AuthContext";
import Navigation from "./Navigation";

export default function Home() {
  return (
    <AuthProvider>
      <div className="font-sans grid grid-rows-[60px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <header className="row-start-1 w-full flex justify-center mb-4">
          <Navigation />
        </header>
        <main className="flex flex-col gap-[32px] row-start-2">
         <p className="justify-center flex-col items-center text-center">
          Hi there! Welcome to the Student Financial Aid Portal. Use the navigation bar above to access different sections of the portal.
        <br/> 
          <span className="text-green-400 font-bold tracking-wide ">For administrators, please note that there's a real time integration between the Ethereum blockchain, Funder and Institution Databases to manage and verify funding conditions</span>
         </p>
         <p>This portal enables students to confirm their details to prevent fraud. We however, do not enable updating the entire information. Please make sure that your data from the institution and on the funder's database is accurate</p>
        </main>
      </div>
    </AuthProvider>
  );
}
