import React, {useEffect, useState} from 'react';
import './App.css';
import {
    AppBar, createStyles, IconButton,
    Link, makeStyles, Menu, MenuItem, MuiThemeProvider, Theme, Toolbar,
    Typography
} from "@material-ui/core";
import theme from "./theming/theme";
import PowBlockList from "./blocks/PowBlockList";
import Overview from "./overview/Overview";
import {BrowserRouter as Router} from 'react-router-dom';
import {Route} from 'react-router';
import Contact from "./contact/Contact";
import {
    IconFlagDE, IconFlagUK, IconFlagFR
} from 'material-ui-flags';
import Footer from "./Footer";
import {useTranslation} from "react-i18next";
import BlockOverview from "./blocks/BlockOverview";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

function App() {

    const classes = useStyles();

    const [langIcon, setLangIcon] = useState<any>(null);
    const {t, i18n} = useTranslation();

    useEffect(() => {
        console.log('language', i18n.language)
        if (i18n.language) {
            setLangIcon(() => i18n.language === 'de' ? <IconFlagDE/> : <IconFlagUK/>)
        }
    }, [i18n, i18n.language])


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const setLanguage = (lang: string | null) => {
        if (lang) {
            i18n.changeLanguage(lang)
        }
        setAnchorEl(null);
    };

    return (
        <div className="App">
            <MuiThemeProvider theme={theme}>
                <AppBar position="sticky" style={{opacity: '80%'}}>
                    <Toolbar>

                        <div className={classes.title}>
                            <Typography variant="h6">
                                {t('title')}
                            </Typography>
                            <Link href="/" color={'textPrimary'}>
                                {t('bar.overviewLabel')}
                            </Link>
                            <Link href="/block-demo" color={'textPrimary'}>
                                {t('bar.demoLabel')}
                            </Link>
                            <Link href={"/contact"} color={'textPrimary'}>{t('bar.contactLabel')}</Link>
                        </div>
                        {t('language')}
                        <IconButton
                            aria-label="current language"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="primary"
                        >
                            {langIcon}
                        </IconButton>
                    </Toolbar>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={open}
                        onClose={() => setLanguage(null)}
                    >
                        <MenuItem onClick={() => setLanguage('de')}><IconButton><IconFlagDE/></IconButton></MenuItem>
                        <MenuItem onClick={() => setLanguage('en')}><IconButton><IconFlagUK/></IconButton></MenuItem>
                    </Menu>
                </AppBar>
                <div style={{display: 'flex', flexFlow: 'column', height: '100vh'}}>
                    <div style={{
                        flex: '1 1 auto', backgroundColor: '#4f9eef2e',
                    }}>
                        <Router>
                            <Route path={'/'} exact component={() =>
                                <React.Suspense fallback={<span>... loading</span>}><Overview/> </React.Suspense>}
                            />
                            <Route path={'/block-demo'} exact
                                   component={() => <React.Suspense fallback={<span>... loading</span>}><BlockOverview/>
                                   </React.Suspense>}/>
                            <Route path={'/contact'} exact
                                   component={() => <React.Suspense fallback={<span>... loading</span>}><Contact/>
                                   </React.Suspense>}/>
                        </Router>
                    </div>
                    <div style={{flex: '1 1 auto'}}>
                        <Footer/>
                    </div>
                </div>

            </MuiThemeProvider>

        </div>
    );
}

export default App;
