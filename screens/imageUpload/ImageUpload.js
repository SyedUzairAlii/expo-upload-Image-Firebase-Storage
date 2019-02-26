import React from 'react';
import { View,   ScrollView,   StyleSheet, Button} from 'react-native';
//config your firebase
import firebase from '../../config/Firebase';
import { ImagePicker } from 'expo';
import { Avatar } from 'react-native-elements';
import {  Header } from 'react-native-elements';
import { Constants, Location, Permissions, Contacts } from 'expo';
import uuid from 'uuid';


class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    _pickImage = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
        });
        this._handleImagePicked(pickerResult);
    };


    _handleImagePicked = async (pickerResult) => {
        try {
            this.setState({ uploading: true });
            if (!pickerResult.cancelled) {
                uploadUrl = await uploadImageAsync(pickerResult.uri);
                console.log(uploadUrl, 'url>>>>>>>>>>>>>')
                this.setState({ image: uploadUrl });
            }
        } catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            console.log('finally');
        }
    };

    render() {
        const { image, } = this.state;
        return (
            <ScrollView>
                    <View style={{ flex: 1, alignItems: 'center', }}>
                        <Header
                            containerStyle={{
                                backgroundColor: '#075e54',
                                justifyContent: 'space-around',
                            }}
                            centerComponent={{ text: 'Wellcome', style: { color: '#fff' } }}
                        />
                        <View style={{ marginTop: 30 }}  >
                            <Avatar
                                size="xlarge"
                                rounded
                                title="CR"
                                // onPress={() => this._pickImage}
                                activeOpacity={0.7}
                                source={{
                                    uri:
                                        image ? image : 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                                }}
                            />
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30, marginBottom: 30 }}>
                            <Button
                                title="Pick an image from camera roll"
                                onPress={() => this._pickImage()}
                            />
                        </View>
                    </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#7FB3D5',
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 20,
        // opacity:0.9
    },
    statusBar: {
        backgroundColor: "#C2185B",
        height: Constants.statusBarHeight,
    },

});

async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const ref = firebase
        .storage()
        .ref()
        .child(uuid.v4());
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
}

export default ImageUpload;
