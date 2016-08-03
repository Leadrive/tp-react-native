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
      <View style={{flex: 1, paddingTop: 120, paddingHorizontal: 20, backgroundColor: 'white'}}>
        <Modal
          visible={this.state.loading}
          transparent={true}
          onRequestClose={this._cancel.bind(this)}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
              <ActivityIndicator animating={true} color={TPColors.light} />
          </View>
        </Modal>
         <TextInput
            style={styles.input1}
            onChangeText={(text) => this.setState({ username: text })}
            value={this.state.username}
            onSubmitEditing={this._usernameSubmit.bind(this)}
            keyboardType="email-address"
            autoCorrect={false}
            autoFocus={true}
            returnKeyType="next"
            placeholder="邮箱"/>
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
          <TPButton
              caption="登陆"
              onPress={this._login.bind(this)}
              type="bordered"
              style={{ marginTop: 20}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    input1: {
        height: 40,
        padding: 10,
        borderColor: TPColors.inactive,
        borderWidth: 1,
        borderRadius: 5,
    },
    input2: {
        height: 40,
        padding: 10,
        borderColor: TPColors.inactive,
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
    }
});
