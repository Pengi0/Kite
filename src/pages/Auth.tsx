import { Navigate, Outlet } from "react-router-dom"

interface props {
    condition: boolean,
    path: string
}

export default function Auth(props: props)
{
    return (
        props.condition ? <Navigate to={props.path}/> : <Outlet />
    );
}