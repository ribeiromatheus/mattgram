import React, { Component } from 'react'
import api from '../services/api';
import { Header } from 'react-navigation-stack';

import { StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default class New extends Component {
    static navigationOptions = {
        headerTitle: 'Nova publicação'
    };

    state = {
        author: '',
        place: '',
        description: '',
        hashtags: '',
        image: null,
    };

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        const image = {
            uri: result.uri,
            type: result.type
        };

        if (!result.cancelled) {
            this.setState({ image });
        }

        console.log(result)
    };

    handleSubmit = async () => {
        const data = new FormData();

        data.append('image', this.state.image);
        data.append('author', this.state.author);
        data.append('place', this.state.place);
        data.append('description', this.state.description);
        data.append('hashtags', this.state.hashtags);

        await api.post('/posts', data)

        this.props.navigation.navigate('Feed');
    }

    render() {
        let { image } = this.state;

        return (
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={Header.HEIGHT + 20} style={styles.container}>
                <ScrollView>
                    <TouchableOpacity style={styles.selectButton} onPress={this._pickImage}>
                        <Text style={styles.selectButtonText}>Selecionar imagem</Text>
                    </TouchableOpacity>
                    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

                    <TextInput
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize='none'
                        placeholder="Nome do autor"
                        placeholderTextColor='#999'
                        value={this.state.author}
                        onChangeText={author => this.setState({ author })}
                    />
                    <TextInput
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize='none'
                        placeholder="Local da foto"
                        placeholderTextColor='#999'
                        value={this.state.place}
                        onChangeText={place => this.setState({ place })}
                    />
                    <TextInput
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize='none'
                        placeholder="Descrição"
                        placeholderTextColor='#999'
                        value={this.state.description}
                        onChangeText={description => this.setState({ description })}
                    />
                    <TextInput
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize='none'
                        placeholder="Hashtags"
                        placeholderTextColor='#999'
                        value={this.state.hashtags}
                        onChangeText={hashtags => this.setState({ hashtags })}
                    />

                    <TouchableOpacity style={styles.shareButton} onPress={this.handleSubmit}>
                        <Text style={styles.shareButtonText}>Compartilhar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    selectButton: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectButtonText: {
        fontSize: 16,
        color: '#666',
    },
    input: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginTop: 10,
        fontSize: 16,
    },
    shareButton: {
        backgroundColor: '#7159c1',
        borderRadius: 4,
        height: 42,
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff',
    }
});
