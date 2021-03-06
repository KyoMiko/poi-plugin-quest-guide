import React, { Component } from 'react'
import { Button, TextArea, InputGroup, Collapse, Icon } from "@blueprintjs/core";
import { connect } from 'react-redux'
import questData from './quests-scn.json'
import { questMap } from './questHelper.es';
import { QuestList } from './QuestList.es';
export const windowMode = false;

export const reactClass = connect(state => ({
    questList: state.ext["poi-plugin-quest-info-2"]._.questList
}))(class view extends Component {

    state = { acceptable: [], unacceptable: [], finished: [], target: "", show: true, error: false };

    getGuide = () => {
        let questList = this.props.questList;
        let { target } = this.state;
        let questnow = [];

        if(!questList) {
            this.setState({error: true})
        }

        questList.forEach(quest => {
            if (questData[quest.api_no]) {
                questnow.push(questData[quest.api_no].code)
            }
        });

        let stack = new Set(questMap.get(target));
        let result = new Set()
        result.add(target)
        for (const iterator of stack) {
            if (questMap.get(iterator)) {
                questMap.get(iterator).forEach(value => {
                    stack.add(value)
                });
            }
            result.add(iterator)
            stack.delete(iterator)
        }

        stack = new Set(questnow);
        let acceptableSet = new Set();
        let finishedSet = new Set();
        for (const iterator of stack) {
            if(questMap.get(iterator)) {
                questMap.get(iterator).forEach(value => {
                    stack.add(value)
                });
            }
            if (questnow.includes(iterator) && result.has(iterator)) {
                acceptableSet.add(iterator);
                result.delete(iterator);
            } else if (!questnow.includes(iterator) && result.has(iterator)) {
                finishedSet.add(iterator);
                result.delete(iterator);
            }
        }
        let error = false;
        if (questList.length <= 10) {
            error = true;
        }
        this.setState({ acceptable: [...acceptableSet], unacceptable: [...result], finished: [...finishedSet], error });
    }

    render() {
        const { acceptable, unacceptable, finished } = this.state;
        const { show, error } = this.state;
        const style = error ? { color: "red" }: { color: "red",display: "none" };
        return (
            <div style={{overflowY: "scroll"}}>
                <InputGroup style={{ height: "30px" }} onChange={(event) => this.setState({ target: event.target.value })} placeholder="??????????????????(???????????????????????????????????????????????????????????????2????????????)" ></InputGroup>
                <Button onClick={this.getGuide}>
                    ??????
                </Button>
                <div style={style}>???????????????????????????????????????????????????????????????????????????</div>
                <div style={{ fontSize: "25px" }} onClick={() => { this.setState({ show: !show }) }}>??????????????????<Icon icon={show ? "chevron-down" : "chevron-right"} iconSize="25" /></div>
                <Collapse isOpen={show}>
                    <h3>?????????</h3>
                    <TextArea style={{ height: "100px" }} placeholder="??????????????????" className=":readonly" fill={true} value={acceptable.join(",")} ></TextArea>
                    <h3>????????????</h3>
                    <TextArea style={{ height: "100px" }} placeholder="??????????????????" className=":readonly" fill={true} value={unacceptable.join(",")} ></TextArea>
                    <h3>?????????</h3>
                    <TextArea style={{ height: "100px" }} placeholder="??????????????????" className=":readonly" fill={true} value={finished.join(",")} ></TextArea>
                </Collapse>
                <QuestList title="?????????????????????" defaultShow={false} questList={acceptable} />
                <QuestList title="????????????????????????" defaultShow={false} questList={unacceptable} />
                <QuestList title="?????????????????????" questList={finished} />

            </div>
        )
    }
})