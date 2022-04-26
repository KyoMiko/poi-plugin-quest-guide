import React, { Component } from 'react'
import { Collapse, Icon } from "@blueprintjs/core";
import { QuestCard } from './QuestCard/card.es';
import questData from './quests-scn.json'
import { idMap } from './questHelper.es';
export const QuestList = class view extends Component {

    constructor(props) {
        super(props)
        if(props.defaultShow != undefined) {
            this.state = {show: props.defaultShow}
        } else {
            this.state = {show: false}
        }
    }

    render() {
        const {title, questList} = this.props
        const {show} = this.state   
        return (
            <div>
                <div style={{ fontSize: "25px" }} onClick={() => { this.setState({ show: !show }) }}>{title}<Icon icon={show ? "chevron-down" : "chevron-right"} iconSize="25" /></div>
                <Collapse isOpen={show}>
                    {
                        questList.map((quest) => {
                            console.log(quest);
                            return (
                                <li style={{ listStyleType: "none", margin: "5px" }}>
                                    <QuestCard quest={questData[idMap.get(quest)]}></QuestCard>
                                </li>)
                        })
                    }
                </Collapse>
            </div>
        )
    }
}