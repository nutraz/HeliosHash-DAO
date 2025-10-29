import dynamic from "next/dynamic";

const Web3App = dynamic(() => import("./Web3App"), { ssr: false });

export default function SplashPage() {
  return <Web3App />;
}
