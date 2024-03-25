import { useEffect, useState } from "react";
import { send, toImg } from "../../lib/io";
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

interface postPros {
  src: string | number;
  pid: number;
  text: string;
  pfp: string;
  uname: string;
}

export function Post(props: postPros) {
  return (
    <div className="w-[32rem] p-3 m-3 rounded-xl top-10 bg-gray-400">
      <div className="mb-3">
        <img
          src={toImg(props.pfp)}
          className="w-20 h-20 mr-3 inline-block rounded-full object-cover"
        />
        <div className=" inline-block relative translate-y-2 text-white ">
          <div className="text-xl">{props.uname}</div>
          <div className="opacity-0">.</div>
        </div>
        <span className="material-symbols-rounded absolute right-3 pr-3 w-14 h-14 p-1 text-5xl text-white hover:cursor-pointer hover:bg-gray-800 rounded-full">
          close
        </span>
      </div>
      <hr />
      <div className="text-white">
        {props.src && (
          <img
            src={toImg(props.src as string)}
            className="h-min w-96 mx-auto object-contain"
          />
        )}
        <hr />
        {props.text}
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
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fun() {
      const x = {
        type: "get-home-post",
        _id: props.user.uid,
      };
      const y = await send(x);
      if (y.error == -2) {
        setTimeout(async () => await fun(), 100);
        return;
      }
      setData(y._data);
    }
    fun();
  }, []);

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
          {data.map((el: any) => {
            return (
              <Post
                pid={el[0]}
                key={el[0]}
                src={el[2]}
                text={el[3]}
                pfp={el[6]}
                uname={el[5]}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
