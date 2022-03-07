import React from 'react'
import SplitPane from 'react-split-pane/lib/SplitPane';
import Pane from "react-split-pane/lib/Pane";
import { useSelector } from "react-redux";

export default function Profiles() {
    let profileDashboard = useSelector((state) => state.profileDashboard.tree);

    return (
        <SplitPane size={"100%"} split="horizontal">
            <Pane minSize={"20%"}>This is a Pane</Pane>
            <Pane minSize={"20%"}>This is a Pane</Pane>
        </SplitPane>
    )
}
