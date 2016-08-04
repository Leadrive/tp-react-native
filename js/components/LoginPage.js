import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ToolbarAndroid,
  Platform,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import * as Api from '../Api'
import TPButton from 'TPButton'
import TPColors from '../common/TPColors'
import HomePage from './HomePage'
import Icon from 'react-native-vector-icons/Ionicons';

export default class LoginPage extends Component {

  constructor() {
    super();
    this.state = ({
      username: '',
      password: '',
      loading: false,
    });
  }

  _usernameSubmit() {
      this.refs.inputPw.focus();
  }

  _passwordSubmit() {
      this._login()
  }

  _cancel() {

  }

  async _login() {
    //TODO:loading
    this.setState({ loading: true })
    const result = await Api.login(this.state.username, this.state.password)
    this.setState({ loading: false })
    if (result) {
        this.props.navigator.resetTo({
            name: 'HomePage',
            component: HomePage
        });
    } else {
      console.warn('登录失败'); //TODO:展示具体失败原因
    }
  }


  render() {
    return (
        <Image source={require('./img/login_bg.jpg')} resizeMode='cover'
        style={{flex: 1, width: undefined, height: undefined}}>
      <View style={{flex: 1, paddingTop: 100, paddingHorizontal: 20}}>
        <Modal
          visible={this.state.loading}
          transparent={true}
          onRequestClose={this._cancel.bind(this)}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
              <ActivityIndicator animating={true} color={TPColors.light} />
          </View>
        </Modal>
        <Text style={{fontSize: 28, paddingBottom: 25, color: '#333', textAlign:'center'}}>欢迎来到胶囊日记</Text>
         <View style={{flexDirection: 'row'}}>
             <View style={styles.icon_box}>
                 <Icon name="ios-mail-outline" size={30} color={TPColors.inactiveText} style={{paddingTop:2}} />
             </View>
              <TextInput
                style={styles.input1}
                onChangeText={(text) => this.setState({ username: text })}
                value={this.state.username}
                onSubmitEditing={this._usernameSubmit.bind(this)}
                keyboardType="email-address"
                autoCorrect={false}
                autoFocus={false}
                autoCapitalize="none"
                returnKeyType="next"
                placeholder="邮箱"/>
         </View>
          <View style={{flexDirection: 'row', marginTop: 10,}}>
              <View style={styles.icon_box}>
                  <Icon name="ios-medical-outline" size={25} color={TPColors.inactiveText} style={{paddingTop:1}}/>
              </View>
             <TextInput
                 ref="inputPw"
                 style={styles.input2}
                onChangeText={(text) => this.setState({ password: text })}
                value={this.state.password}
                onSubmitEditing={this._passwordSubmit.bind(this)}
                autoCorrect={false}
                placeholder="密码"
                secureTextEntry={true}
                 returnKeyType="done"
                selectTextOnFocus={true}/>
          </View>
          <TPButton
              caption="登陆"
              onPress={this._login.bind(this)}
              type="bordered"
              style={{ marginTop: 25, marginHorizontal: 20}}/>

      </View>
        </Image>
    );
  }
}

const styles = StyleSheet.create({
    input1: {
        flex: 1,
        height: 40,
        padding: 10,
        paddingLeft: 48,
        marginLeft: -40,
        borderColor: TPColors.inactiveText,
        borderWidth: 1,
        borderRadius: 5,
    },
    input2: {
        flex: 1,
        height: 40,
        padding: 10,
        paddingLeft: 48,
        marginLeft: -40,
        borderColor: TPColors.inactiveText,
        borderWidth: 1,
        borderRadius: 5,
    },
    icon_box: {
        width: 40,
        backgroundColor: '#efefef',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7,
    }
});
