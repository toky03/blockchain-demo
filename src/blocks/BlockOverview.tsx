import {Card, CardContent, Grid, Link, Tab, Tabs, Typography} from "@material-ui/core";
import React from "react";
import PowBlockList from "./PowBlockList";
import PosBlockList from "./PosBlockList";
import {cardStyle, logoBackground} from "../theming/theme";
import {Trans, useTranslation} from "react-i18next";

function BlockOverview() {

    const [value, setValue] = React.useState(0);
    const {t} = useTranslation();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div style={logoBackground}>
            <Grid container spacing={0} justify={'center'}
            >
                <Card style={{...cardStyle, width: undefined, marginTop: '.5em'}}>
                    <Typography id="discrete-slider" variant="h6">
                        {t('demo.comparison.title')}
                    </Typography>
                    <CardContent>
                        <Trans i18nKey={'demo.comparison.content'}>
                            text<Link href={'https://andersbrownworth.com/blockchain/'}>link text</Link>text
                        </Trans>
                    </CardContent>
                </Card>
            </Grid>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="Proof of work"/>
                <Tab label="Proof of stake"/>
            </Tabs>
            {value === 0 ? <PowBlockList/> : <PosBlockList/>}
        </div>

    )
}

export default BlockOverview


