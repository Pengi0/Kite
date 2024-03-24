import { useState } from "react";

interface props {
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function CreatePost(props: props) {
  const [type, setType] = useState(0);
  return (
    <div className="absolute z-30 w-screen h-screen ">
      <div className="bg-gray-300 absolute rounded-xl border-2 border-gray-200  w-1/2 h-[40rem] right-1/4 top-10 overflow-y-auto">
        <span
          onClick={() => {
            props.setEnabled(false);
          }}
          className="material-symbols-rounded p-1 px-2 absolute right-5 top-3 text-3xl hover:cursor-pointer hover:bg-gray-400 rounded-full"
        >
          Close
        </span>
        <div className="text-2xl m-5">Create Post</div>
        <hr />
        <div className="border border-dashed w-1/2 h-96 border-gray-600 mx-auto mt-10 flex justify-center rounded-xl">
          <div>
            <span className="material-symbols-rounded block text-7xl mt-36 mx-8">
              photo_library
            </span>
            Click To Choose File
          </div>
        </div>
        <textarea
          id="EBio"
          placeholder="Bio"
          maxLength={255}
          className="relative translate-x-1/2 mt-5 p-3 w-1/2 h-40 text-xl resize-none rounded-xl bg-white hover:cursor-text hover:border-blue-500 border border-gray-500"
        />
        <div className="mx-auto w-64 flex mt-10 mb-20 rounded-full bg-gray-200 border-gray-400 border">
          <div
            onClick={() => setType(0)}
            className="w-32 px-9 py-3 text-2xl rounded-full hover:cursor-pointer"
          >
            Story
          </div>
          <div
            onClick={() => setType(1)}
            className="w-32 px-10 py-3 text-2xl rounded-full hover:cursor-pointer"
          >
            Post
          </div>
          <div
            className={
              "w-32 px-16 bg-opacity-10 bg-black relative rounded-full transition-all " +
              (type ? "-translate-x-32" : "-translate-x-64")
            }
          ></div>
        </div>
        <br />
        <button className="m-5 text-xl absolute right-24 -translate-y-24">
          Save
        </button>
      </div>
    </div>
  );
}
