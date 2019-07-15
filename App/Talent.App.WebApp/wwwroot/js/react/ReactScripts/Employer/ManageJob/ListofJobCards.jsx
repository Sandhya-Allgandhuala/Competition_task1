import React, { Component } from 'react';
import { Card } from 'semantic-ui-react'

export class ListofJobCards extends React.Component {

    constructor(props) {
        super(props);
    };

    render() {

        return (
            <div className="field">
                <Card>
                    <Card.Content>
                    <Card.Header>{this.props.Title}</Card.Header>
                        <Card.Meta>{this.props.Summary}</Card.Meta>
                    <Card.Description>
                        {this.props.Description}
                    </Card.Description>
                    </Card.Content>
                </Card>

            </div>
        )

    }
}