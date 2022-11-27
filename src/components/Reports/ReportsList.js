import React, {Fragment} from "react";
import NavBar from "../shared/components/NavBar/NavBar";

export default class ReportList extends React.Component {

    render() {
        return (
            <Fragment>
            <NavBar/>
            <h2 style={{marginTop:"2rem"}}>Извештаи</h2>
            </Fragment>
        )
    }

}