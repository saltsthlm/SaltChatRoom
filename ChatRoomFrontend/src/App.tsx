/* eslint-disable react/react-in-jsx-scope */
import { useRef, useState } from 'react';
import './App.css'
import DataTablesLayout from './components/dataTablesLayout';
import ObjectInspectorLayout from './components/objectInspectorLayout';

//Todo: No more than one table can be used at the same time
//Todo: Single tables don't work if there are no rows in that table on the server

type Tabs = "dataTables" | "objectInspector";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tabs>("dataTables");
  const tabDataTables = useRef<HTMLAnchorElement | null>(null);
  const tabObjectInspector = useRef<HTMLAnchorElement | null>(null);

  const handleClick = (newActiveTab: Tabs) => {
    if (activeTab != newActiveTab) {
      setActiveTab(newActiveTab);
      switch (newActiveTab) {
        case "dataTables":
          tabDataTables.current!.classList.add("tab-active");
          tabObjectInspector.current!.classList.remove("tab-active");
          break;
        case "objectInspector":
          tabObjectInspector.current!.classList.add("tab-active");
          tabDataTables.current!.classList.remove("tab-active");
          break;
      }
    }
  }

  return (
    <div className="flex-row">
      <div role="tablist" className="tabs tabs-boxed sticky -top-0 z-10">
        <a ref={tabDataTables} role="tab" onClick={() => handleClick("dataTables")} className="tab tab-active">Live Database Table</a>
        <a ref={tabObjectInspector} role="tab" onClick={() => handleClick("objectInspector")} className="tab">Object Inspector</a>
      </div>
      <br />
      <br />
      <div className="-z-20">
        <ObjectInspectorLayout visible={activeTab == "objectInspector"} />
        <DataTablesLayout visible={activeTab == "dataTables"} />
      </div>
    </div>
  );
}
