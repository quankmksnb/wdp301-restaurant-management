import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center flex-col justify-center w-full h-lvh">
      <h1>Front Inter</h1>
      <Link href={"/dashboard"}>To Dashboard</Link>
      <Link href={"/kitchen"}>To kitchen</Link>
      <Link href={"/waiter"}>To waiter</Link>

      <div className="flex gap-[8px]">
        primary <div className="w-[20px] h-[20px] bg-primary"></div>
        secondary <div className="w-[20px] h-[20px] bg-secondary"></div>
        dark <div className="w-[20px] h-[20px] bg-dark"></div>
        light <div className="w-[20px] h-[20px] bg-light"></div>
      </div>
    </div>
  );
}
