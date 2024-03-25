import { useState } from "react";
import { send, toBase64, toImg } from "../../lib/io";

interface props {
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  user: {
    uid: number;
    pass: string;
  };
}
export default function CreatePost(props: props) {
  const [type, setType] = useState(0);
  const [postType, setPostType] = useState(1);
  const [src, setSrc] = useState("");

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function imageSubmit() {
    const img = document.getElementById("file") as HTMLInputElement;
    img.click();
  }

  async function submit() {
    const img = document.getElementById("file") as HTMLInputElement;
    console.log(img.files);

    if (img.files?.length) {
      let b64 = await toBase64(img.files[0]);

      const x = {
        type: "post-img",
        base64: b64 ? b64.replace(/^data:(.*,)?/, "") : "",
        img_type: img.files[0].type.replace("image/", ""),
      };

      var y = (await send(x)).loc;
    } else {
      if ((document.getElementById("Text") as HTMLInputElement).value == "") {
        console.log("can't send");
        return;
      }
      y = "";
    }

    const x1 = {
      type: "create-post",
      _id: props.user.uid,
      _img: y,
      _postType: postType,
      _text: (document.getElementById("Text") as HTMLInputElement).value,
    };

    await send(x1);
    props.setEnabled(false);
  }

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
        <div
          onClick={imageSubmit}
          className={
            (src ? "" : "border-dashed") +
            " border w-1/2 h-96 border-gray-600 mx-auto mt-10 flex justify-center rounded-xl"
          }
        >
          <input
            onChange={handleFileChange}
            type="file"
            id="file"
            className="hidden"
            accept="image/*"
          />
          {src != "" ? (
            <img src={src} className="object-contain" />
          ) : (
            <div>
              <span className="material-symbols-rounded block text-7xl mt-36 mx-8">
                photo_library
              </span>
              Click To Choose File
            </div>
          )}
        </div>
        <textarea
          id="Text"
          placeholder="Text"
          maxLength={255}
          className="relative translate-x-1/2 mt-5 p-3 w-1/2 h-40 text-xl resize-none rounded-xl bg-white hover:cursor-text hover:border-blue-500 border border-gray-500"
        />
        <div className="mx-auto w-64 flex mt-10 mb-10 rounded-full bg-gray-200 border-gray-400 border">
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
        {type ? (
          <div className="mx-auto w-64 flex mt-10 mb-20 rounded-full bg-gray-200 border-gray-400 border">
            <div
              onClick={() => setPostType(0)}
              className="w-32 px-9 py-3 text-2xl rounded-full hover:cursor-pointer"
            >
              Public
            </div>
            <div
              onClick={() => setPostType(1)}
              className="w-32 px-10 py-3 text-2xl rounded-full hover:cursor-pointer"
            >
              Private
            </div>
            <div
              className={
                "w-32 px-16 bg-opacity-10 bg-black relative rounded-full transition-all " +
                (postType ? "-translate-x-32" : "-translate-x-64")
              }
            ></div>
          </div>
        ) : (
          ""
        )}
        <br />
        <button
          onClick={submit}
          className="m-5 text-xl absolute right-24 -translate-y-24"
        >
          Save
        </button>
      </div>
    </div>
  );
}
