import React from "react";

const AboutAndPrivacy: React.FC = () => {
  return (
    <>
      <div className="absolute z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.5),rgba(255,255,255,0))]"></div>

      <div className="flex flex-col items-center text-gray-800 ">
        <section className="max-w-3xl sm:w-full my-20 mx-10">
          <h1 className="text-3xl font-bold mb-4">About</h1>
          <p className="text-lg leading-relaxed">
            Welcome to DSA Stats! My mission is to bring all your coding and DSA
            stats across multiple platforms into one beautifully designed
            interface. Stay organized and focused as you track your progress and
            share your achievements effortlessly.
          </p>
          <p className="text-lg leading-relaxed">
            Track your progress across LeetCode, GeeksForGeeks, Codeforces, and
            more. Get insights, track improvements, and showcase your coding
            journey.
          </p>
        </section>

        <section
          id="privacy"
          className="max-w-3xl w-full text-white bg-zinc-900 mb-20 p-10">
          <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
          <p className="text-lg leading-relaxed">
            We respect your privacy and are committed to protecting your data.
            All information provided is used solely for displaying your stats
            and is never shared with third parties. For any questions, feel free
            to contact{" "}
            <a
              className=" text-blue-500"
              href="https://x.com/nischalshetty02"
              target="_blank">
              me
            </a>
          </p>
        </section>
      </div>
    </>
  );
};

export default AboutAndPrivacy;
