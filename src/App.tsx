import "./App.scss";
import { Canvas } from "./components/Canvas";
import { Tools } from "./components/Tools";
import { TopMenu } from "./components/TopMenu";

function App() {
  return (
    <div className="Workspace-wrapper">
      <TopMenu />
      <div className="util_flex-row util_full-heigth">
        <Tools />
        <Canvas />
      </div>
    </div>
  );
}

export default App;
