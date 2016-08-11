import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ToolbarAndroid,
  Platform,
  RefreshControl,
  ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import TPTouchable from 'TPTouchable'
import RadiusTouchable from 'RadiusTouchable'
import TPColors from 'TPColors'
import Icon from 'react-native-vector-icons/Ionicons';
import PhotoPage from './PhotoPage'

var Lightbox = require('Lightbox');
var moment = require('moment');

export default class Diary extends Component {

  render() {
    var diary = this.props.data;
    const photoView = this.renderPhoto(diary);

    const icon = diary.user ? (
        <View style={styles.user_icon_box}>
          <RadiusTouchable onPress={() => this.props.onIconPress && this.props.onIconPress(diary)}>
            <View>
              <Image key={diary.id} style={styles.user_icon} source={{uri: diary.user.iconUrl}} />
            </View>
          </RadiusTouchable>
        </View>
      ) : null;

    const title = diary.user ? (
      <View style={styles.title}>
        <Text style={styles.title_name}>{diary.user.name}</Text>
        <Text style={[styles.title_text, {flex: 1}]} numberOfLines={1}>《{diary.notebook_subject}》</Text>
        <Text style={styles.title_text}>{moment(diary.created).format('H:m')}</Text>
      </View>
    ) : (
      <View style={styles.title}>
        <Text style={styles.title_h}>《{diary.notebook_subject}》</Text>
        <Text style={styles.title_text}>{moment(diary.created).format('H:m')}</Text>
      </View>
    );

    const lines = this.props.showAllContent ? 0 : 5;
    const view = (
        <View style={{backgroundColor: 'white'}}>
          <View style={styles.box}>
            {icon}
            <View style={styles.body}>
              {title}
              <Text style={styles.content} numberOfLines={lines}>{diary.content}</Text>
              {photoView}
              {this.renderActionBar(diary)}
            </View>
          </View>
          <View style={styles.line} />
        </View>
    );

    if (this.props.onPress) {
      return (
        <TPTouchable onPress={() => this.props.onPress && this.props.onPress(diary)} underlayColor="#efefef">
          {view}
        </TPTouchable>
      );
    } else {
      return view;
    }
  }

  renderActionBar(diary) {
    const comment = diary.comment_count > 0 && this.props.showComment
        ? (<View style={{flexDirection: "row"}}>
            <Icon name="ios-text-outline" size={14} color={TPColors.inactiveText} style={styles.button_icon} />
            <Text style={{fontSize: 12, color: TPColors.inactiveText}}>{diary.comment_count}</Text>
          </View>)
        : null;

    const action = (this.props.editable || this.props.deletable)
        ? (
            <TouchableOpacity onPress={() => this.props.onActionPress(diary)}>
              <Icon name="ios-more"
                    size={22}
                    color={TPColors.inactiveText}
                    style={{paddingVertical: 4, paddingHorizontal: 8}} />
            </TouchableOpacity>
          )
        : null;

    return comment != null || action != null
        ? (
            <View style={{flexDirection: 'row', alignItems: "center", height: 45}}>
              {comment}
              <View style={{flex: 1}} />
              {action}
            </View>
          )
        : (<View style={{height: 24}} />);
  }

  renderPhoto(diary) {
    const img = diary.photoUrl ?
      (
        <TouchableOpacity
            onPress={() => {
              this.props.navigator.push({
                name: 'PhotoPage',
                component: PhotoPage,
                params: {
                  source: {uri: diary.photoUrl}
                }
              });
            }}
          style={{ width: 160, marginTop: 15, backgroundColor: "#f8f8f8", padding: 0 }}
          >
          <Image style={styles.photo}
                 key={diary.id}
            resizeMode="cover"
            source={{uri: diary.photoThumbUrl.replace('w240-h320', 'w320-h320-c320:320-q75')}} />
        </TouchableOpacity>
      )
      : null;

      return img;
  }
}

Diary.propTypes = {
  showComment: React.PropTypes.bool,
  showAllContent: React.PropTypes.bool,
  diary: React.PropTypes.object,
  editable: React.PropTypes.bool,
  deletable: React.PropTypes.bool,
  onActionPress: React.PropTypes.func,
};

Diary.defaultProps = {
  showComment: true,
  showAllContent: false,
  editable: false,
  deletable: false,
};

const styles = StyleSheet.create({
  box: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    paddingBottom: 0,
    flexDirection: "row"
  },
  body: {
    flexDirection: "column",
    flex: 1 ,
    paddingTop: 2
  },
  title: {
    flexDirection: "row",
    paddingBottom: 5,
    alignItems: "flex-end"
  },
  title_name: {
    fontWeight: 'bold',
    color: TPColors.contentText,
    fontSize: 14
  },
  title_h: {
    fontWeight: 'bold',
    color: TPColors.contentText,
    fontSize: 14
  },
  title_text: {
    fontSize: 12,
    color: TPColors.inactiveText
  },
  user_icon_box: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor : TPColors.spaceBackground
  },
  user_icon: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  content: {
    flex: 1,
    lineHeight: 24,
    color: TPColors.contentText,
    fontSize: 15,
    textAlignVertical: 'bottom',
  },
  photo: {
    flex: 1,
    height: 160
  },
  button_icon: {
    marginRight: 8,
    marginLeft: 2
  },
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: TPColors.line,
    marginHorizontal: 16
  }
});
