import "./App.css";
import { Canvas } from "./components/Canvas";
import { PropsMenu } from "./components/PropsMenu";
import { TopMenu } from "./components/TopMenu";

function App() {
  return (
    <div className="Workspace-wrapper">
      <TopMenu />
      <div className="util_flex-row util_full-heigth">
        <PropsMenu />
        <Canvas />
      </div>
    </div>
  );
}

export default App;
