import {Tab, Tabs} from "@material-ui/core";
import React from "react";
import {TabPanel} from "@material-ui/lab";
import PowBlockList from "./PowBlockList";
import PosBlockList from "./PosBlockList";

function BlockOverview() {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="Proof of work"  />
                <Tab label="Proof of stake"  />
            </Tabs>
            {value === 0 ? <PowBlockList/>: <PosBlockList/>}
        </React.Fragment>

    )
}

export default BlockOverview


