import {createMuiTheme} from "@material-ui/core";
import {CSSProperties} from "@material-ui/styles";

const fontHeading = [
    '-apple-system',
    'BlinkMacSystemFont',
    'Pattaya',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
].join(',');

export default createMuiTheme({
    palette: {
        primary: {
            light: '#6AE6C4',
            main: '#3D70F4',
            dark: '#E3E1A1'
        },
        secondary: {
            light: '#6EF0A8',
            main: '#6EF0A8',
            dark: '#6EF0A8'
        },
        error: {
            light: '#E34C02',
            main: '#FFAE3B',
            dark: '#AD03FB'
        },
        warning: {
            light: '#FBA589',
            main: '#FFCB47',
            dark: '#FB7EF4'
        },
        success: {
            light: '#3BE38A',
            main: '#ADE33B',
            dark: '#0AFFFA'
        }
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        h1: {
            fontFamily: fontHeading,
            fontSize: '3em',
            paddingTop: '100px',
            paddingBottom: '50px'
        },
        h2: {
            fontFamily: fontHeading
        },
        h3: {
            fontFamily: fontHeading
        },
        h4: {
            fontFamily: fontHeading
        },
        h5: {
            fontFamily: fontHeading
        },
        h6: {
            fontFamily: fontHeading
        }
    },
});

export const cardStyle: CSSProperties = {
    width: '500px',
    backgroundColor: '#70DA81',
    borderRadius: '20px',
    opacity: '90%',
    margin: '10px',
    textAlign: "center"
};

export const logoBackground: CSSProperties = {
    backgroundImage: 'url(./ssp_logo_light.svg)',
    backgroundSize: "100vh auto",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0 10vh',
    backgroundAttachment: "fixed",
    backgroundPositionX: 'center',
}

export const minerCard = {
    ...cardStyle,
    width: undefined,
    backgroundColor: '#FFFFFF',
    opacity: '100%',
    margin: '5px',
    padding: '10px'

}
