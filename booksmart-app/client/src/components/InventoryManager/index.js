import React, { Component } from "react";


class InventoryManager extends Component {
    constructor(props) {
        super(props);
        this.callAPI = this.callAPI.bind(this);
        this.state = { inventory: [] };
    }

    callAPI() {
        // startDate/endDate/numberOfRecords
        fetch("/inventory/2013-01-02/2013-08-02/100")
            .then(res => res.json())
            .then(data => this.setState({ inventory: data }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
        console.log(this.state.inventory);
    }

    render() {
        const inventory = this.state.inventory.map( (inventory, index) => {
            return <tr key={ index }>
                <td>{inventory.TITLE}</td>
                <td>{inventory.ITEM_COUNT}</td>
                <td>{inventory.CHECKOUT_COUNT}</td>
            </tr>
        });
        return (
            <div>
                <table align="center">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Item Count</th>
                        <th>Checkout Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {inventory}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default InventoryManager;
