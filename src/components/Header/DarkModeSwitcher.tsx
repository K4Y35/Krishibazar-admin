import useColorMode from "@/hooks/useColorMode";
import Image from "next/image";

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <div className="mt-10 flex w-full rounded-2xl bg-[#18202F] p-1">
      <div
        className={`flex w-1/2 cursor-pointer items-center justify-center gap-2 rounded-lg p-1 transition-colors duration-300 ease-in-out ${
          colorMode === "dark" ? "bg-primaryGray text-gray-300" : "text-white"
        }`}
        onClick={() => {
          if (typeof setColorMode === "function") {
            setColorMode("dark");
          }
        }}
      >
        <Image
          width={20}
          height={20}
          src="/images/icon/night-mode.png"
          alt="night mode"
        />
        <p>Dark</p>
      </div>
      <div
        className={`flex w-1/2 cursor-pointer items-center justify-center gap-2 rounded-lg p-1 transition-colors duration-300 ease-in-out ${
          colorMode === "light" ? "bg-primaryGray text-gray-200" : "text-white"
        }`}
        onClick={() => {
          if (typeof setColorMode === "function") {
            setColorMode("light");
          }
        }}
      >
        <Image
          width={20}
          height={20}
          src="/images/icon/light-mode.png"
          alt="light mode"
        />
        <p>Light</p>
      </div>
    </div>
  );
};

export default DarkModeSwitcher;
