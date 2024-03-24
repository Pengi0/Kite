import { Key, MouseEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { send, toImg } from "../../lib/io";
import CreatePost from "./CreatePost";

var onChanging = false;
var gotNotifications = false;
interface plateProps {
  icon: string;
  name: string;
  action: MouseEventHandler<HTMLDivElement> | undefined;
}
interface searchPlateProps {
  pfp: string;
  key: Key;
  rname: string;
  uname: string;
}

interface searchProps {
  enabled: boolean;
}
interface moreMenuProps {
  enabled: boolean;
  setUser: any;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}
interface sidebarProps {
  setUser: any;
  user: any;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
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
export function SearchPlate(props: searchPlateProps) {
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
      }
      onChanging = false;
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
          return (
            <SearchPlate key={el[0]} pfp={el[2]} uname={el[0]} rname={el[1]} />
          );
        })}
      </div>
    </div>
  );
}
function NotificationPlate({ str }: { str: string }) {
  return (
    <div className="m-2 p-5 rounded-xl bg-gray-300 transition-all duration-200 overflow-clip">
      {str}
    </div>
  );
}
function NotificationMenu(props: { enabled: boolean; user: any }) {
  const [list, setList] = useState([]);

  async function fun() {
    if (!gotNotifications) {
      gotNotifications = true;

      const x = {
        type: "get-notifications",
        _id: props.user.uid,
      };
      console.log(x);
      const y = await send(x);
      setList(y._data);
      console.log(y._data);
    }
  }

  useEffect(() => {
    fun();
  });
  return (
    <div
      className={
        "absolute w-96 h-screen z-10 bg-gray-200 transition-all " +
        (props.enabled ? "left-80" : "-left-16")
      }
    >
      <div className="h-full w-0.5 bg-slate-600 absolute"></div>
      <div className="text-3xl mt-5 ml-4 mb-5">Notifications</div>
      <hr className="h-0.5 mx-2 bg-slate-600 mb-3" />
      <div>
        {list.map((el: any) => {
          return <NotificationPlate str={el[0]} key={el[0]} />;
        })}
      </div>
    </div>
  );
}
function MoreMenu(props: moreMenuProps) {
  return (
    <div
      className={
        "absolute w-72 bg-gray-200 rounded-xl z-40 left-2 bottom-28 overflow-hidden transition-all duration-100 " +
        (!props.enabled ? "h-0" : "h-auto")
      }
    >
      <SidebarPlate
        icon="logout"
        name="Log out"
        action={() => {
          props.setUser({
            uid: 0,
            pass: "",
          });
          props.setLoggedIn(false);
        }}
      />
    </div>
  );
}
export default function Sidebar(props: sidebarProps) {
  const navigate = useNavigate();
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [moreEnabled, setMoreEnabled] = useState(false);
  const [createNewEnabled, setCreateNewEnabled] = useState(false);

  return (
    <>
      <SearchMenu enabled={searchEnabled} />
      <MoreMenu
        enabled={moreEnabled}
        setUser={props.setUser}
        setLoggedIn={props.setLoggedIn}
      />
      <NotificationMenu enabled={notificationEnabled} user={props.user} />
      {createNewEnabled && (
        <CreatePost user={props.user} setEnabled={setCreateNewEnabled} />
      )}
      <span className="fixed bg-gray-100 z-20 w-80 text-3xl h-full">
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
        <SidebarPlate
          icon="add_box"
          name="Create"
          action={() => setCreateNewEnabled(true)}
        />
        <SidebarPlate
          icon={"notifications"}
          name="Notifications"
          action={() => {
            setNotificationEnabled(!notificationEnabled);
            gotNotifications = false;
          }}
        />
        <SidebarPlate
          icon="person"
          name="Profile"
          action={() => navigate("/profile")}
        />
        <div
          onClick={() => setMoreEnabled(!moreEnabled)}
          className="m-2 p-5 rounded-xl absolute w-72 bottom-0 hover:cursor-pointer hover:bg-gray-300 transition-all duration-200"
        >
          <span className="material-symbols-rounded mr-10 ml-3 text-4xl">
            Menu
          </span>
          <div className="inline-block relative -translate-y-2">More</div>
        </div>
      </span>
    </>
  );
}
