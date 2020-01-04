import React, { Component } from 'react'
import api from '../services/api';
import { Header } from 'react-navigation-stack';

import { StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import camera from '../../assets/camera.png';

export default class New extends Component {
    static navigationOptions = {
        headerTitle: 'Nova publicação'
    };

    state = {
        author: '',
        place: '',
        description: '',
        hashtags: '',
        preview: null,
        image: null
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

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        let localUri = result.uri;
        let filename = localUri.split('/').pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        const image = {
            uri: localUri,
            name: filename,
            type
        };

        this.setState({ image });

        if (!result.cancelled)
            this.setState({ preview: result.uri });
        else
            return;
    }

    takePicture = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.cancelled)
            this.setState({ preview: result.uri });
        else
            return;

        let localUri = result.uri;
        let filename = localUri.split('/').pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        const image = {
            uri: localUri,
            name: filename,
            type
        };

        this.setState({ image });
    }

    handleSubmit = async () => {
        const data = new FormData();

        data.append('image', this.state.image);
        data.append('author', this.state.author);
        data.append('place', this.state.place);
        data.append('description', this.state.description);
        data.append('hashtags', this.state.hashtags);

        await api.post('/posts', data);

        this.props.navigation.navigate('Feed');
    }

    render() {
        let { preview } = this.state;

        return (
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={Header.HEIGHT + 20} style={styles.container}>
                <ScrollView>
                    <TouchableOpacity style={styles.takePic} onPress={this.takePicture}>
                        <Image source={camera} />
                        <Text style={styles.selectButtonText}>Tirar foto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.selectButton} onPress={this.pickImage}>
                        <Text style={styles.selectButtonText}>Selecionar imagem</Text>
                    </TouchableOpacity>
                    {preview && <Image source={{ uri: preview }} style={{ width: 200, height: 200 }} />}

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
    takePic: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10
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