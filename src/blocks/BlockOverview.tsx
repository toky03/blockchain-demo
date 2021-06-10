import {Tab, Tabs} from "@material-ui/core";
import React from "react";
import PowBlockList from "./PowBlockList";
import PosBlockList from "./PosBlockList";
import {logoBackground} from "../theming/theme";

function BlockOverview() {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div style={logoBackground}>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="Proof of work"  />
                <Tab label="Proof of stake"  />
            </Tabs>
            {value === 0 ? <PowBlockList/>: <PosBlockList/>}
        </div>

    )
}

export default BlockOverview


