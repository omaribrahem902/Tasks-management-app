import { useEffect } from "react";

import {fetchUser} from "./stores/slices/userSlice";
import { useAppDispatch } from "./stores/hooks";

export default function UserInitializer() {

const dispatch = useAppDispatch();
  
useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
    return null;
}