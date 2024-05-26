import { Component } from "react";
import handleSearchApi from './services/getSearchProduct';

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {
        let response = await handleSearchApi("low")
        console.log("Test api search: ", response)
    }

    render() {
        return (
            <div>test</div>
        );
    }
}

export default Test;