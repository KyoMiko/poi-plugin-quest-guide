import React, { Component } from 'react'
import { Button, TextArea, InputGroup, Collapse, Icon } from "@blueprintjs/core";
import { connect } from 'react-redux'
import questData from './quests-scn.json'
import { questMap,lowerCaseMap } from './questHelper.es';
import { QuestList } from './QuestList.es';
export const windowMode = false;

export const reactClass = connect(state => ({
    questList: state.ext["poi-plugin-quest-info-2"]._.questList
}))(class view extends Component {

    state = { acceptable: [], unacceptable: [], finished: [], target: "", show: true, errorMsg: "" };

    getGuide = () => {
        let questList = this.props.questList;
        let { target } = this.state;
        let questnow = [];

        target = lowerCaseMap.get(target.toLowerCase());
        if(!target) {
            this.setState({errorMsg: "未检索到该任务，请确保任务编码正确"})
            return;
        }

        if(!questList) {
            this.setState({errorMsg: "当前无可接取任务，请尝试打开任务界面加载任务信息"})
            return;
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
        let errorMsg = "";
        if (questList.length <= 10) {
            errorMsg = `当前可接取任务仅${questList.length}条，请尝试打开任务界面加载任务信息`;
        }
        this.setState({ acceptable: [...acceptableSet], unacceptable: [...result], finished: [...finishedSet], errorMsg });
    }

    render() {
        const { acceptable, unacceptable, finished } = this.state;
        const { show, errorMsg } = this.state;
        const style = errorMsg ? { color: "red" }: { color: "red",display: "none" };
        return (
            <div style={{overflowY: "scroll"}}>
                <InputGroup style={{ height: "30px" }} onChange={(event) => this.setState({ target: event.target.value })} placeholder="输入任务编码(查找前点击任务刷新已有任务，需配合任务信息2一起使用)" ></InputGroup>
                <Button onClick={this.getGuide}>
                    查找
                </Button>
                <div style={style}>{errorMsg}</div>
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