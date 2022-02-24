import React from 'react'
import SplitPane from 'react-split-pane/lib/SplitPane';
import Pane from "react-split-pane/lib/Pane";

export default function Profiles() {
    return (
        <SplitPane size={"100%"} split="horizontal">
            <Pane minSize={"20%"}>This is a Pane</Pane>
            <Pane minSize={"20%"}>This is a Pane</Pane>
        </SplitPane>
    )
}
