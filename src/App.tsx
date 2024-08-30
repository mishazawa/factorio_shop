import { useEffect } from "react";
import "./App.scss";
import { Canvas } from "./components/Canvas";
import { Tools } from "./components/Tools";
import { TopMenu } from "./components/TopMenu";
import { fetchApiDocs } from "./utils";
import { LayerParameters } from "./components/LayerParameters";

function App() {
  useEffect(() => {
    fetchApiDocs();
  }, []);

  return (
    <div className="Workspace-wrapper">
      <TopMenu />
      <div className="util_flex-row util_full-heigth util_pos-rel">
        <Tools />
        <Canvas />
        <LayerParameters />
      </div>
    </div>
  );
}

export default App;
