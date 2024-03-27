import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Post } from "./Home";
import { send } from "../../lib/io";

interface savedProps {
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

export default function Saved(props: savedProps) {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fun() {
      const x = {
        type: "get-saved",
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
        <div className="text-5xl mt-6 ml-6">Saved Posts -</div>
        <hr className="border-gray-700" />
        <div className="mx-auto w-min mt-14">
          {data.map((el: any, index: number, arr: never[]) => {
            return (
              <Post
                pid={el[0]}
                key={index}
                src={el[2]}
                text={el[3]}
                pfp={el[6]}
                uname={el[5]}
                user={props.user}
                saved={true}
                liked={el[7]}
                alert={0}
                data={data}
                setData={setData}
                mid={false}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
