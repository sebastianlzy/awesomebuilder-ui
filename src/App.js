import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './App.css';
import {Grid, Paper, Container, Typography, Box, AppBar, Toolbar, IconButton} from '@material-ui/core'
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
        color: theme.palette.secondary.main,
    },
    paperPrimary: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.primary.main,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
});

class App extends Component {
    state = {
        currHostName: '',
        instanceHostnames: [],
    };

    componentDidMount() {
        this.getCurrHostName()
            .then(res => this.setState({currHostName: res.hostname}))
            .catch(err => this.setState({currHostName: JSON.stringify(err)}));

        this.getHostNames()
            .then(res => this.setState({instanceHostnames: res.hostnames}))
            .catch(err => this.setState({instanceHostnames: [JSON.stringify(err)]}));
    }

    getCurrHostName = async () => {
        const currHostName = await fetch('/api/get-instance-hostname');
        const body = await currHostName.json();
        if (currHostName.status !== 200) throw Error(body.message);
        console.log(body)
        return body;
    };

    getHostNames = async () => {
        const currHostName = await fetch('/api/get-all-instance-hostnames');
        const body = await currHostName.json();
        if (currHostName.status !== 200) throw Error(body.message);
        console.log(body)
        return body;
    };

    renderGrids = (gridValues, currValue) => {
        const grids = []
        for (let i = 0; i < gridValues.length; i++) {
            grids.push(
                <Grid item xs key={`homepage-grid-${i}`}>
                    <Paper
                        className={gridValues[i] === currValue ? this.props.classes.paperPrimary : this.props.classes.paperSecondary}>
                        <img src={ec2Icon} alt="ec2 logo"/>
                        <p>{gridValues[i]}</p>
                    </Paper>
                </Grid>
            )
        }
        return grids
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
                            Awesomebuilder III
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
                        {this.renderGrids(this.state.instanceHostnames, this.state.currHostName)}
                    </Grid>
                </Container>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(useStyles)(App);