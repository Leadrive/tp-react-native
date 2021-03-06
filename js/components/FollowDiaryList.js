import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import * as Api from 'Api'
import DiaryList from './DiaryList'
import NavigationBar from 'NavigationBar'
import DiaryPage from './DiaryPage'
import FollowUsersPage from './FollowUsersPage'
var PureRenderMixin = require('react-addons-pure-render-mixin');

export default class FollowDiaryList extends Component {

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    this.first_id = '';
  }

  _loadTodayDiaries(page, page_size) {
    return this.loadDiary(page, page_size);
  }

  async loadDiary(page, page_size) {
    if (page == 1) {
      this.first_id = ''
    }
    const data = await Api.getFollowDiaries(page, page_size, this.first_id);
    if (page == 1 && data && data.diaries && data.diaries.length > 0) {
      this.first_id = data.diaries[0].id
    }
    return {
      diaries: data.diaries,
      page: data.page,
      more: data.diaries.length === page_size,
    }
  }

  refresh() {
    this.refs.list.refresh();
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

  _openFollowUsersPage() {
    this.props.navigator.push({
      name: 'FollowUsersPage',
      component: FollowUsersPage,
    })
  }

  render() {
      const rightButton = <NavigationBar.Icon name="ios-contacts" onPress={this._openFollowUsersPage.bind(this)} />;

    return (
      <View style={{flex: 1, marginBottom: 49}}>
        <NavigationBar
            title="关注日记"
            rightButton={rightButton}
        />
        <DiaryList
            ref="list"
        style={{}}
          navigator={this.props.navigator}
          getDiariesPage={this._loadTodayDiaries.bind(this)}
          onDiaryPress={this._toDiaryPage.bind(this)}/>
      </View>
    )
  }
}
