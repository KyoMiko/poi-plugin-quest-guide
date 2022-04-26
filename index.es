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
                <InputGroup style={{ height: "30px" }} onChange={(event) => this.setState({ target: event.target.value })} placeholder="输入任务编码(查找前点击任务刷新已有任务，需配合任务信息2一起使用)" ></InputGroup>
                <Button onClick={this.getGuide}>
                    查找
                </Button>
                <div style={style}>当前可接取任务数量过少，请尝试打开任务加载任务信息</div>
                <div style={{ fontSize: "25px" }} onClick={() => { this.setState({ show: !show }) }}>任务简略信息<Icon icon={show ? "chevron-down" : "chevron-right"} iconSize="25" /></div>
                <Collapse isOpen={show}>
                    <h3>可接取</h3>
                    <TextArea style={{ height: "100px" }} placeholder="点击按钮加载" className=":readonly" fill={true} value={acceptable.join(",")} ></TextArea>
                    <h3>不可接取</h3>
                    <TextArea style={{ height: "100px" }} placeholder="点击按钮加载" className=":readonly" fill={true} value={unacceptable.join(",")} ></TextArea>
                    <h3>已完成</h3>
                    <TextArea style={{ height: "100px" }} placeholder="点击按钮加载" className=":readonly" fill={true} value={finished.join(",")} ></TextArea>
                </Collapse>
                <QuestList title="可接取任务列表" defaultShow={false} questList={acceptable} />
                <QuestList title="不可接取任务列表" defaultShow={false} questList={unacceptable} />
                <QuestList title="已完成任务列表" questList={finished} />

            </div>
        )
    }
})