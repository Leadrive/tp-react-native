import React, {Component} from 'react';
import {
    StyleSheet,
    Platform,
    RefreshControl,
    ActivityIndicator,
    InteractionManager,
    Alert,
    View,
} from 'react-native';
import * as Api from '../Api'
import { TPColors, GridView, NotificationCenter } from '../common'
import NotebookPage from './NotebookPage'
import Notebook from './Notebook'

const EmptyBook = "EmptyBook";

export default class NotebookList extends Component {

    static propTypes = {
        userId: React.PropTypes.number,
        mySelf: React.PropTypes.bool,
    };

    static defaultProps = {

    };

    constructor(props) {
        super(props);
        this.state = {
            books: [],
            refreshing: false,
        };
        this._onAddNotebook = this._onAddNotebook.bind(this);
    }

    componentDidMount(){
        //InteractionManager.runAfterInteractions(() => {
            this._loadBooks();
        //});
        if (this.props.mySelf) {
            NotificationCenter.addLister('onAddNotebook', this._onAddNotebook)
        }
    }

    componentWillUnmount() {
        if (this.props.mySelf) {
            NotificationCenter.removeLister('onAddNotebook', this._onAddNotebook)
        }
    }

    _onAddNotebook() {
        InteractionManager.runAfterInteractions(() => {
            this._loadBooks().done();
        });
    }

    // init() {
    //     if (!this.loadingOnes) {
    //         this._onRefresh();
    //     }
    //     this.loadingOnes = true;
    // }

    _onRefresh() {
        this._loadBooks();
    }

    async _loadBooks() {
        this.setState({
            refreshing: true
        });
        let books;
        try {
            books = this.props.mySelf
                ? await Api.getSelfNotebooks()
                : await Api.getUserNotebooks(this.props.userId);
        } catch(err) {
            Alert.alert('加载失败', err.message);
            this.setState({
                refreshing: false,
            });
        }

        if (books.length % 2 == 1) {    //为了向左对齐，插入一个空日记本
            books.push(EmptyBook);
        }

        this.setState({
            books: books,
            refreshing: false,
        });
        //console.log(books);
    }

    _bookPress(book) {
        this.props.navigator.push({
            name: 'NotebookPage',
            component: NotebookPage,
            params: {
                notebook: book
            }
        })
    }

    render() {
        //console.log('render books')
        return (
            <GridView
                itemsPerRow={2}
                renderFooter={null}
                onEndReached={null}
                scrollEnabled={true}
                renderSeparator={null}
                items={this.state.books}
                fillIncompleteRow={false}
                renderItem={this._renderBook.bind(this)}
                //renderSectionHeader={this._renderHeader}
                automaticallyAdjustContentInsets={false}
                removeClippedSubviews={false}
                style={this.props.style}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        colors={[TPColors.refreshColor]}
                        tintColor={TPColors.refreshColor} />
                }
            />
        );
    }

    _renderBook(book) {
        if (EmptyBook != book) {
            return <Notebook key={book.id} book={book} style={{marginBottom: 15}} onPress={() => this._bookPress(book)} />
        } else {
            return <View key="EmptyBook" style={{width: 140}} />
        }
    }
}