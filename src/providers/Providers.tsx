
import { Provider } from "react-redux";
import { store } from "../stores/store";
import UserInitializer from "../UserInitializer";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <UserInitializer />
      {children}
    </Provider>
  );
}