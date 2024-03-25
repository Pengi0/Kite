import { toImg } from "../../lib/io";
import Sidebar from "../components/Sidebar";

interface homeProps {
  setUser: React.Dispatch<
    React.SetStateAction<{
      uid: number;
      pass: string;
    }>
  >;
  user: {
    uid: number;
    pass: string;
  };
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface postProps {
  postId: number;
}

function Post(props: postProps) {
  const src =
    "https://t4.ftcdn.net/jpg/04/96/04/41/360_F_496044111_NtgcQqusPMz0AaxtBCDu5L8FifGQDkig.jpg";
  const text = "";

  return (
    <div className="w-96 p-3 rounded-xl bg-gray-400">
      <div className="mb-3">
        <img
          src={toImg("def/pfp")}
          className="w-20 h-20 mr-3 inline-block rounded-full object-cover"
        />
        <div className=" inline-block relative translate-y-2 text-white ">
          <div className="text-xl">User Name</div>
          <div>Date</div>
        </div>
      </div>
      <hr />
      <div className="text-white">
        {src && <img src={src} className="h-min w-96 mx-auto object-contain" />}
        <hr />
        {text}
      </div>
      <hr />
      <div className="mt-3 text-white">
        <div className="inline-block mx-5 px-4 py-2 rounded-xl hover:bg-gray-500 hover:cursor-pointer transition-all duration-100">
          <span className="material-symbols-rounded pr-3 text-3xl">
            thumb_up
          </span>
          <div className="inline-block relative -translate-y-2">Like</div>
        </div>
        <div className="inline-block mx-5 px-4 py-2 rounded-xl hover:bg-gray-500 hover:cursor-pointer transition-all duration-100">
          <span className="material-symbols-rounded pr-3 text-3xl">
            Bookmark
          </span>
          <div className="inline-block relative -translate-y-2">Save</div>
        </div>
      </div>
    </div>
  );
}

export default function Home(props: homeProps) {
  return (
    <>
      <Sidebar
        setUser={props.setUser}
        user={props.user}
        setLoggedIn={props.setLoggedIn}
      />
      <div className="ml-80">
        <div className="mx-auto flex w-[56rem] m-2 px-2 rounded-xl bg-gray-400">
          <div className="w-[10.5rem] h-[5.5rem] my-3 mx-1 rounded-2xl bg-gradient-to-tr from-teal-500 to-green-300">
            <img
              src={toImg("def/pfp")}
              className="w-40 h-20 m-1 rounded-xl object-cover"
            />
          </div>
        </div>
        <div className="mx-auto w-min mt-14">
          <Post postId={0} />
        </div>
      </div>
    </>
  );
}
