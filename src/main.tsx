import ReactDOM from "react-dom/client";
import { App } from "./app";
import { SettingProvider } from "./contexts";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <SettingProvider>
    <App />
  </SettingProvider>,
);
