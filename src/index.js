import React, {Component} from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import moment from 'moment'
import _ from 'lodash'
import inspect from 'util-inspect'

import {textStyle} from './config'

export default class LogMonitor extends Component {
  static update = function() {
    return {
      initialScrollTop: ()=>{},
      consecutiveToggleStartId: ()=>{}
    }
  }
  componentWillMount(){
    const actions = Object.keys(this.props.actionsById).reduce((a,n)=>{
      a[n] = {action: 1, state: 1}
      return a
    }, {})
    this.state = {actions}
  }
  componentWillReceiveProps(props){
    const newActionKeys = Object.keys(props.actionsById)
    if (newActionKeys.length !== this.state.actions.length) {
      const newActions = newActionKeys.reduce((a,n)=>{
        if (!a[n]){
          a[n] = {action: 1, state: 1}
        }
        return a
      }, this.state.actions)
      this.setState({actions: newActions})
    }
  }
  _decAction(action){
    const {actions} = this.state
    --actions[action.key].action
    this.setState(actions)
  }
  _incAction(action){
    const {actions} = this.state
    ++actions[action.key].action
    this.setState(actions)
  }
  _decState(action){
    const {actions} = this.state
    --actions[action.key].state
    this.setState(actions)
  }
  _incState(action){
    const {actions} = this.state
    ++actions[action.key].state
    this.setState(actions)
  }
  render(){
    const actions = _.orderBy(Object.keys(this.props.actionsById), null, ['desc'])
      .map(k=>({...this.props.actionsById[k], key: k, state: this.props.computedStates[k].state, config: this.state.actions[k]}))
    return (
      <View style={styles.container}>
        <ScrollView>
          {actions.map((a, i)=>(
            <View style={styles.line} key={i}>
              <Text style={styles.textSmallRight}>{moment(a.timestamp).toISOString()}</Text>
              <Text style={styles.text}>{a.key}: {a.action.type}</Text>
              <View>
                <Text style={styles.textSmall}>{inspect(a.action, {depth: a.config.action})}</Text>
                <View style={styles.foregroundRow}>
                  <TouchableHighlight style={styles.flex} underlayColor='#0005' onPress={()=>this._decAction(a)}>
                    <View style={styles.flex} />
                  </TouchableHighlight>
                  <TouchableHighlight style={styles.flex} underlayColor='#0005' onPress={()=>this._incAction(a)}>
                    <View style={styles.flex} />
                  </TouchableHighlight>
                </View>
              </View>
              <View>
                <Text style={styles.textSmall}>{inspect(a.state, {depth: a.config.state})}</Text>
                <View style={styles.foregroundRow}>
                  <TouchableHighlight style={styles.flex} underlayColor='#0005' onPress={()=>this._decState(a)}>
                    <View style={styles.flex} />
                  </TouchableHighlight>
                  <TouchableHighlight style={styles.flex} underlayColor='#0005' onPress={()=>this._incState(a)}>
                    <View style={styles.flex} />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    backgroundColor: '#333'
  , paddingTop: 20
  , flex: 1
  },
  foregroundRow: {
    position: 'absolute'
  , top: 0
  , left: 0
  , right: 0
  , bottom: 0
  , flexDirection: 'row'
  },
  line: {
    margin: 10
  },
  text: {
    ...textStyle
  , color: 'white'
  },
  textSmall: {
    ...textStyle
  , fontSize: 14
  , color: 'white'
  },
  textSmallRight: {
    ...textStyle
  , fontSize: 12
  , color: 'white'
  , alignSelf: 'flex-end'
  , textAlign: 'right'
  },
})
