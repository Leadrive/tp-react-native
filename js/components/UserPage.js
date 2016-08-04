import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ToolbarAndroid,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import * as Api from '../Api'
import DiaryPage from './DiaryPage'
import DiaryList from './DiaryList'
import SettingPage from './SettingPage'
import NavigationBar from 'NavigationBar'
import NotificationCenter from '../common/NotificationCenter'

export default class UserPage extends Component {

  constructor(props) {
    super(props);
    if (this.props.myself) {
      this._onWriteDiary = this._onWriteDiary.bind(this);
    }
  }

  componentDidMount() {
    console.log('componentDidMount');
    if (this.props.myself) {
      NotificationCenter. addLister('onWriteDiary', this._onWriteDiary)
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    if (this.props.myself) {
      NotificationCenter.removeLister('onWriteDiary', this._onWriteDiary)
    }
  }

  _onWriteDiary() {
    console.log('_onWriteDiary!!!!!!!!!!');
    this.refs.list.refresh();
  }



  _loadTodayDiaries(page, page_size) {
    return this.loadDiary(page, page_size);
  }

  async loadDiary(page, page_size) {
    let user = null;
    if (this.props.myself) {
      user = await Api.getSelfInfoByStore();
    } else {
      user = this.props.user;
    }
    const data = await Api.getUserTodayDiaries(user.id, page, page_size);
    //console.log(data);
    return {
      diaries: data,
      page: 1,
      more: false
    }
  }

  _toDiaryPage(diary) {
    this.props.navigator.push({
      name: 'DiaryPage',
      component: DiaryPage,
      params: {
        diary: diary
      }
    })
  }

  _toSettingPage() {
    this.props.navigator.push({
      name: 'SettingPage',
      component: SettingPage
    })
  }

  render() {
    const name = this.props.myself ? '我' : this.props.user.name;
    let navAttrs = this.props.myself
      ? { rightButton: { title: "设置", handler: this._toSettingPage.bind(this) } }
      : { leftButton: { title: "后退", handler: () => { this.props.navigator.pop() } } };

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <NavigationBar
          title={name + "的日记"}
          {...navAttrs}
          />
          <DiaryList ref="list"
            navigator={this.props.navigator}
                     deletable={this.props.myself}
                     editable={this.props.myself}
            getDiariesPage={this._loadTodayDiaries.bind(this)}
            onDiaryPress={this._toDiaryPage.bind(this)}/>
      </View>
    );
  }
}

//var STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : 25;
//var HEADER_HEIGHT = Platform.OS === 'ios' ? 44 + STATUS_BAR_HEIGHT : 56 + STATUS_BAR_HEIGHT;
var STATUS_BAR_HEIGHT = 20;
var HEADER_HEIGHT = 56;

const styles = StyleSheet.create({
  toolbar: {
    height: HEADER_HEIGHT,
  },
  toolbarContainer: {
    backgroundColor: '#39E',
    paddingTop: STATUS_BAR_HEIGHT,
    elevation: 2,
    borderRightWidth: 1,
    marginRight: -1,
    borderRightColor: 'transparent',
  },
});
