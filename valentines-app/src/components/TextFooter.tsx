import { Playfair_Display } from "next/font/google";

const playfairDisplay = Playfair_Display({
  display: "swap",
  subsets: ["latin"],
});

export default function TextFooter() {
  return (
    <h1
      className={`absolute left-1/2 bottom-5 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl lg:text-5xl font-bold text-center ${playfairDisplay.className}`}
    >
      Fill the heart out
    </h1>
  );
}
