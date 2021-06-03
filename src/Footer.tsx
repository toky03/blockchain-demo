import {Typography} from "@material-ui/core";

function Footer() {
    return (
        <footer style={{
            bottom: '0', height: '100%', color: '#5eb16a',
            paddingTop: '20px',
            backgroundColor: '#1a2642',
            display: 'flex',
            alignContent: 'center',
            flexWrap: 'nowrap',
            flexDirection: 'row',
            justifyContent: 'center',
        }}>
            <Typography>Copyright Marco Jakob</Typography>
        </footer>
    )

}

export default Footer
