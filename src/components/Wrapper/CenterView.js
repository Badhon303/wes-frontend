import React from 'react';

export default class CenterView extends React.Component {
    render() {
        return (

            <div className="containers">
                <div className="centers">
                    {this.props.children}
                </div>
            </div>

        )
    }
}
