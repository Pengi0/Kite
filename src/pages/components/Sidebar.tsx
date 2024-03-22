import { MouseEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { send, toImg } from "../../lib/io";

var onChanging = false;

interface plateProps {
  icon: string;
  name: string;
  action: MouseEventHandler<HTMLDivElement> | undefined;
}
interface searchPlateProps {
  pfp: string;
  rname: string;
  uname: string;
}

interface searchProps {
  enabled: boolean;
}

function SidebarPlate(props: plateProps) {
  return (
    <div
      onClick={props.action}
      className="m-2 p-5 rounded-xl hover:cursor-pointer hover:bg-gray-300 transition-all duration-200"
    >
      <span className="material-symbols-rounded mr-10 ml-3 text-4xl">
        {props.icon}
      </span>
      <div className="inline-block relative -translate-y-2">{props.name}</div>
    </div>
  );
}
function SearchPlate(props: searchPlateProps) {
  const navigate = useNavigate();
  function onClick() {
    navigate("/usr/" + props.uname);
  }

  return (
    <div
      key={props.uname}
      className="m-2 p-5 rounded-xl hover:cursor-pointer hover:bg-gray-300 transition-all duration-200"
      onClick={onClick}
    >
      <img
        src={toImg(props.pfp)}
        className="w-14 h-14 mr-7 rounded-full inline object-cover"
      />
      <div className="inline-block relative -translate-y-3 text-xl">
        {props.uname}
      </div>
      <div className="inline-block relative -translate-x-14 translate-y-3">
        {props.rname}
      </div>
    </div>
  );
}

function SearchMenu(props: searchProps) {
  const [list, setList] = useState([]);

  async function onChange() {
    if (!onChanging) {
      onChanging = true;

      const sb = document.getElementById("searchBar") as HTMLInputElement;
      if (sb.value.length != 0) {
        const x = {
          type: "search-accounts",
          _name: sb.value,
        };
        const y = await send(x);
        setList(y._data);
        console.log(y._data);

        onChanging = false;
      }
    }
  }

  return (
    <div
      className={
        "absolute w-80 h-screen z-10 bg-gray-200 transition-all " +
        (props.enabled ? "left-80" : "left-0")
      }
    >
      <div className="h-full w-0.5 bg-slate-600 absolute"></div>
      <div className="text-3xl mt-5 ml-4 mb-5">Search</div>
      <hr className="h-0.5 mx-2 bg-slate-600 mb-3" />
      <input
        type="text"
        id="searchBar"
        className="ml-4 w-72"
        placeholder="Search..."
        onChange={onChange}
      />
      <div>
        {list.map((el: any) => {
          return <SearchPlate pfp={el[2]} uname={el[0]} rname={el[1]} />;
        })}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const [searchEnabled, setSearchEnabled] = useState(false);

  return (
    <>
      <SearchMenu enabled={searchEnabled} />
      <div className="fixed bg-gray-100 z-20 w-80 text-3xl h-full">
        <span className="material-symbols-rounded text-4xl w-full py-7 pl-5 hover:cursor-pointer bg-gray-300">
          KITE
        </span>
        <SidebarPlate
          icon="Home"
          name="Home"
          action={() => {
            navigate("/");
          }}
        />
        <SidebarPlate
          icon="Search"
          name="Search"
          action={() => setSearchEnabled(!searchEnabled)}
        />
        <SidebarPlate icon="Explore" name="Explore" action={undefined} />
        <SidebarPlate icon="add_box" name="Create" action={undefined} />
        <SidebarPlate
          icon="person"
          name="Profile"
          action={() => navigate("/profile")}
        />
      </div>
    </>
  );
}
