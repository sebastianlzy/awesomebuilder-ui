import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './App.css';
import {
    Grid, Paper, Container, Typography, Box, AppBar, Toolbar, IconButton,
    TableContainer, Table, TableHead, TableCell, TableBody, TableRow
} from '@material-ui/core'
import ComputerIcon from '@material-ui/icons/Computer';

import {withStyles} from '@material-ui/core/styles';
import ec2Icon from './ec2-icon.png'

const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    paperSecondary: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.disabled,
    },
    paperPrimary: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.success.dark,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    table: {
        minWidth: 650,
    },
    computeIconImg: {
        opacity: 0.5
    }
});

class App extends Component {
    state = {
        currHostName: '',
        instanceHostNames: [],
        previousHostNames: [],
        metricsImage: "",
        interval: undefined
    };

    componentDidMount() {
        this.fetchData()
        this.setState({interval:  setInterval(this.fetchData, 10000)})
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    fetchData = () => {
        this.fetch('/api/get-instance-hostname')
            .then(res => this.setState({currHostName: res.hostname}))
            .catch(err => this.setState({currHostName: JSON.stringify(err)}));

        this.fetch('/api/get-all-instance-hostnames')
            .then(res => this.setState({instanceHostNames: res.hostnames}))
            .catch(err => this.setState({instanceHostNames: [JSON.stringify(err)]}));

        this.fetch('/api/get-previous-instance-hostnames')
            .then(res => this.setState({previousHostNames: res.hostnames}))
            .catch(err => this.setState({previousHostNames: [JSON.stringify(err)]}));

        this.fetch('/api/cloudwatch-asg-image')
            .then(res => {
                console.log(res)
                this.setState({metricsImage: `data:image/png;base64, ${res.image}`})
            })
            .catch(err => this.setState({image: [JSON.stringify(err)]}));
    }

    fetch = async (url) => {
        const resp = await fetch(url);
        const body = await resp.json();
        if (resp.status !== 200) throw Error(body.message);
        return body;
    }

    renderGrids = (gridValues, currValue) => {
        const grids = []
        for (let i = 0; i < gridValues.length; i++) {
            grids.push(
                <Grid item xs key={`homepage-grid-${i}`}>
                    <Paper
                        className={gridValues[i] === currValue ? this.props.classes.paperPrimary : this.props.classes.paperSecondary}
                    >
                        <img
                            src={ec2Icon} alt="ec2 logo"
                            className={gridValues[i] === currValue ? "" : this.props.classes.computeIconImg}
                        />
                        <p>{gridValues[i]}</p>
                    </Paper>
                </Grid>
            )
        }
        return grids
    }

    renderTableData = () => {
        return this.state.previousHostNames.map((record, idx) => (
            <TableRow key={record.hostname}>
                <TableCell component="th" scope="row">
                    {idx + 1}
                </TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.created_at}</TableCell>
            </TableRow>
        ))
    }

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton edge="start" className={this.props.classes.menuButton} color="inherit" aria-label="menu">
                            <ComputerIcon/>
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            Awesomebuilder III - Dec 17, 2020
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container className="App">
                    <Typography component="div">
                        <Box fontSize="h6.fontSize" m={1}>
                            <h1>Hello from</h1>
                        </Box>
                    </Typography>
                    <Grid container spacing={6}>
                        {this.renderGrids(this.state.instanceHostNames, this.state.currHostName)}
                    </Grid>
                </Container>

                <Typography component="div">
                    <Box fontSize="h6.fontSize" m={1}>
                        <h1>Cloudwatch metrics</h1>
                    </Box>
                </Typography>

                <img src={this.state.metricsImage} />

                <Typography component="div">
                    <Box fontSize="h6.fontSize" m={1}>
                        <h1>Previous hostnames</h1>
                    </Box>
                </Typography>
                <TableContainer component={Paper}>
                    <Table className={this.props.classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Hostnames</TableCell>
                                <TableCell>Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.renderTableData()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(useStyles)(App);