import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View, Image, Modal, Button, Alert, PermissionsAndroid, Dimensions, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Color } from '../../ColorSet'
import * as MediaLibrary from 'expo-media-library';
import LongButton from '../../components/buttons/LongButton';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';


//채팅 스크린
//socket.io 연결 필요

const { width } = Dimensions.get('window');

type MessageState = {
    user: string,
    time: string;
} & (
        | { message: string; image?: never; images?: never }
        | { message?: never; image: { id: string, uri: string, originHeight: number, originWidth: number }; images?: never }
        | { message?: never; image?: never; images: { id: string, uri: string, originHeight: number, originWidth: number }[] }
    );

const ChatMessage = React.memo(({ message, timestamp, isUser }: { message: string, timestamp: string, isUser: boolean }) => {
    return (
        <View style={[styles.formalZone]}>
            <View style={[isUser ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }, { alignItems: 'flex-end' }]}>
                <Text style={isUser ? styles.MyMessage : styles.PartnerMessage}>{message}</Text>
                <View>
                    <Text style={styles.timeStamp}>{timestamp}</Text>
                </View>
            </View>
        </View>
    );
});



const ChatScreen: React.FC = () => {
    const [isTyped, setType] = useState(false);
    const [typedMessage, setMessage] = useState<string>("");
    const [inputHeight, setInputHeight] = useState<number>(48);
    const [chatLog, setChatLog] = useState<MessageState[]>([]);
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false)
    const [ModalVisible, setModalVisible] = useState<boolean>(false)
    const [isLoading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const flatListRef = useRef<FlatList>(null);

    const [photos, setPhotos] = useState<(MediaLibrary.Asset & { originUri: string, originHeight: number, originWidth: number })[]>([]);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
    const [selectedAlbum, setAlbum] = useState<MediaLibrary.Album | null>(null);
    const [isSelectingAlbum, setSelctingState] = useState(false);

    const [selectedImages, setSelectedImages] = useState<{ originUri: string, originHeight: number, originWidth: number }[]>([]);

    const fileUri = `${FileSystem.documentDirectory}chatLog.json`;

    // 대화 내용 저장
    const saveChatLogToFile = async (chatLog: MessageState[]) => {
        try {
            const jsonValue = JSON.stringify(chatLog);
            await FileSystem.writeAsStringAsync(fileUri, jsonValue);
        } catch (error) {
            console.error('Error saving chat log to file:', error);
        }
    };

    const loadChatLogFromFile = async () => {
        try {
            const fileExists = await FileSystem.getInfoAsync(fileUri);
            if (!fileExists.exists) return []; // 파일이 존재하지 않으면 빈 배열 반환

            const jsonValue = await FileSystem.readAsStringAsync(fileUri);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (error) {
            console.error('Error loading chat log from file:', error);
            return [];
        }
    };

    const clearChatLogFile = async () => {
        try {
            const fileExists = await FileSystem.getInfoAsync(fileUri);
            if (fileExists.exists) {
                await FileSystem.deleteAsync(fileUri);
                console.log('Chat log file deleted');
                setChatLog([]);
            } else {
                console.log('Chat log file does not exist');
            }
        } catch (error) {
            console.error('Error deleting chat log file:', error);
        }
    };

    useEffect(() => {
        const fetchChatLog = async () => {
            const savedChatLog = await loadChatLogFromFile();
            setChatLog(savedChatLog);
        };

        fetchChatLog();

        return () => {
            saveChatLogToFile(chatLog);
        };

    }, []);

    ;
    useEffect(() => {
        const getPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: "Access to Photos",
                        message: "We need access to your photos to show them in the app.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('Permission denied', 'We need access to your photos.');
                    return;
                }
            }

            const { status } = await MediaLibrary.requestPermissionsAsync();
            setHasPermission(status === 'granted');

            if (status !== 'granted') {
                Alert.alert('Permission not granted', 'Please enable photo access in your settings.');
            }
        };

        getPermission();

    }, []);

    useEffect(() => {

        setPhotos([]);
        setHasMore(true);
        fetchPhotos();

    }, [selectedAlbum])

    const getAlbums = async () => {
        try {
            const albumList = await MediaLibrary.getAlbumsAsync();
            setAlbums(albumList);
        } catch (e) {
            console.error('앨범을 불러오는 중 오류가 발생했습니다:', e);
        }
    };


    const addImage = (item: { originUri: string, originHeight: number, originWidth: number }) => {
        if (selectedImages.length < 10)
            setSelectedImages([...selectedImages, item])
    }

    const removeImage = (item: { originUri: string, originHeight: number, originWidth: number }) => {
        setSelectedImages(selectedImages.filter(element => element.originUri !== item.originUri));
    };

    const fetchPhotos = async () => {
        if (!hasPermission || isLoading) return;
        
        setLoading(true);

        try {
            const media = await MediaLibrary.getAssetsAsync({
                album: selectedAlbum?.id,
                first: 21,  // 가져올 사진의 개수s
                mediaType: ['photo', 'video'],
                sortBy: [[MediaLibrary.SortBy.creationTime, false]],
                after: photos!.length > 0 ? photos![photos!.length - 1].id : undefined, // 마지막 로드된 항목 이후로 로드
            });

            const resizedPhotos = await Promise.all(
                media.assets.map(async (asset) => {
                    const manipResult = await ImageManipulator.manipulateAsync(
                        asset.uri,
                        [],
                        { compress: 0.4 }
                    );
                    const Origin = await ImageManipulator.manipulateAsync(
                        asset.uri
                    );
                    return { ...asset, uri: manipResult.uri, originUri: Origin.uri, originHeight: asset.height, originWidth: asset.width };
                })
            );

            if (media.assets.length > 0) {

                setPhotos(prevPhotos => [...prevPhotos, ...resizedPhotos]);

                if (media.endCursor === null || media.assets.length < 20) {
                    setHasMore(false); // 모든 사진을 불러온 경우
                }
            } else {
                setHasMore(false); // 더 이상 불러올 사진이 없는 경우
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAllImages = (): { id: string, uri: string, originHeight: number, originWidth: number }[] => {
        return chatLog
            .filter(item => item.image || item.images)  // 이미지가 있는 항목만 필터링
            .flatMap(item => item.images ? item.images : [item.image!]);  // 단일 이미지와 다중 이미지 모두를 포함
    };

    useEffect(() => {
        if (ModalVisible) {
            getAlbums();
            setPhotos([]);
            fetchPhotos();
        }
    }, [ModalVisible]);

    const TimeFormat = (time: Date): string => {
        const localDate = new Date(time.getUTCHours());
        const Hours = localDate.getHours();
        const Minnutes = localDate.getMinutes();

        if (Hours == 0) return '오전 12:00'
        if (Hours < 12) return `오전 ${Hours.toString().padStart(2, "0")}:${Minnutes.toString().padStart(2, "0")}`
        if (Hours == 12) return `오후 12:00`
        return `오후 ${(Hours - 12).toString().padStart(2, "0")}:${Minnutes.toString().padStart(2, "0")}`
    }

    const rederLogItem = ({ item }: { item: MessageState }) => {
        const username = item.user;
        const isUser = username === 'user';

        const madeTime = new Date(item.time)
        const timeStamp = TimeFormat(madeTime)

        if (item.image) {

            return (
                <View style={styles.formalZone}>
                    <View key={item.image.id} style={[isUser ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }, { alignItems: 'flex-end' }]}>
                        <Pressable
                            onPress={() => console.log(item.image.uri)}>
                            <Image
                                source={{ uri: item.image.uri }}
                                style={{ width: 200, height: item.image.originHeight / item.image.originWidth * 200, borderRadius: 10 }}
                            />
                        </Pressable>
                        <Text style={styles.timeStamp}>{timeStamp}</Text>
                    </View>
                </View>)

        }
        if (item.images) {

            const columns: any[] = [];
            let rows: any[] = [];
            const imgLenth = item.images.length;
            const division = imgLenth % 2 == 0 ? imgLenth <= 4 ? 2 : 3 : 3;

            item.images.forEach((image: { id: string, uri: string }, index: number) => {

                rows.push(
                    <Pressable key={image.id}>
                        <Image
                            source={{ uri: image.uri }}
                            style={[{ width: division == 2 ? 100 : imgLenth % 3 == 2 ? (imgLenth - index <= 2 ? 122 : 80) : (imgLenth % 3 == 1 ? (imgLenth - index == 1 ? 248 : 80) : 80), height: division == 2 ? 100 : 80, borderRadius: 10, }, index % division != 0 && { marginLeft: 4 }]}
                        />
                    </Pressable>
                )
                if ((index + 1) % division == 0) {
                    columns.push(<View style={[{ flexDirection: 'row' }, index < imgLenth - 1 && { marginBottom: 4 }]}>{rows}</View>)
                    rows = [];
                }
            })
            if (rows.length > 0) {
                columns.push(<View key={`row-${item.images.length}`} style={{ flexDirection: 'row' }}>{rows}</View>);
            }

            return (
                <View style={[styles.formalZone]}>
                    <View style={[isUser ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }, { alignItems: 'flex-end' }]}>
                        <View style={{ flexDirection: 'column' }}>{columns}</View>
                        <Text style={styles.timeStamp}>{timeStamp}</Text>
                    </View>
                </View>
            )

        }
        if (item.message) {

            const message = item.message;
            return <ChatMessage message={message} timestamp={timeStamp} isUser={isUser} />;

        }
        return <View></View>;
    }

    const renderModalItem = useCallback(({ item }: { item: (MediaLibrary.Asset & { originUri: string, originHeight: number, originWidth: number }) }) => {
        const imageScale = (width - 48) / 3
        const selectedIndex = selectedImages.indexOf(item)

        const isSelect = selectedIndex != -1;

        return (
            <Pressable style={{ margin: 4, borderRadius: 5, overflow: 'hidden' }} onPress={() => { isSelect ? removeImage(item) : addImage(item) }}>
                {isSelect && <View style={{ position: 'absolute', width: imageScale, height: imageScale, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1 }}></View>}
                {isSelect && <View style={[{ position: 'absolute', width: 24, height: 24, borderColor: '#FFF', zIndex: 4, top: 8, right: 8, borderRadius: 100, borderWidth: 1 }, isSelect && { backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={{ textAlign: 'center' }}>{selectedIndex + 1}</Text>
                </View>}
                <Image
                    style={{ width: imageScale, height: imageScale, }}
                    source={{ uri: item.uri }}
                />
            </Pressable>
        )
    }, [selectedImages]);


    const handleSendImagesViaSocket = async () => {
        if (selectedImages.length === 0) {
            Alert.alert('No images selected', 'Please select at least one image to send.');
            return;
        }

        try {
            const base64Images = await Promise.all(
                selectedImages.map(async (item, index) => {
                    const base64 = await FileSystem.readAsStringAsync(item.originUri, {
                        encoding: FileSystem.EncodingType.Base64,
                    }).catch(error => {
                        console.error(`Failed to read file at ${item.originUri}:`, error);
                        return null;
                    });
                    if (base64) {
                        return { id: index + 'image', uri: base64 };
                    }
                })
            );

            // 소켓을 통해 서버로 이미지 전송
            // socket.emit('sendImages', { user: user, images: base64Images });

            const images = selectedImages.map((item, index) => { return { id: index + 'image', uri: item.originUri, originHeight: item.originHeight, originWidth: item.originWidth } })

            // 전송 후 선택된 이미지 초기화

            const now = new Date();
            if (selectedImages.length == 1)
                setChatLog([...chatLog, { user: 'user', image: images[0], time: now.toISOString() }]);
            else
                setChatLog([...chatLog, { user: 'user', images: images, time: now.toISOString() }]);

            setSelectedImages([]);
            setModalVisible(false);
        } catch (error) {
            console.error('Error sending images via socket:', error);
        }
    };

    const handleSend = () => {

        if (typedMessage.trim()) {
            const now = new Date();
            setChatLog([...chatLog, { user: 'user', message: typedMessage, time: now.toISOString() }]);
            setMessage('');
        }
    };
    const selectAlbum = (item: MediaLibrary.Album) => {
        setAlbum(item);
        setSelctingState(false);
    }

    return (
        <KeyboardAvoidingView
            style={{ backgroundColor: '#FFF', flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={inputHeight + 80} // 필요에 따라 조정
        >
            <FlatList
                ref={flatListRef}
                data={chatLog}
                keyExtractor={(item, index) => index.toString()}
                renderItem={rederLogItem}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
            <View style={{ justifyContent: 'center', height: inputHeight + 40, backgroundColor: `#FFF` }}>
                <View style={{ marginHorizontal: 12, paddingHorizontal: 2, paddingVertical: 2, borderWidth: 1, borderRadius: 20, borderColor: Color['grey200'], flexDirection: 'row', height: inputHeight, maxHeight: 78, minHeight: 48, backgroundColor: '#FFF' }}>
                    {typedMessage == "" && !isTyped && <Pressable
                        style={{ backgroundColor: Color['blue500'], marginVertical: 2, marginHorizontal: 2, width: 50, height: 40, borderRadius: 16, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => { setMenuOpen(!isMenuOpen); setAlbum(null); }}>
                        <Text style={{ color: '#FFF', fontSize: 24, textAlignVertical: 'center' }}>{isMenuOpen ? `x` : `+`}</Text>
                    </Pressable>
                    }
                    {isMenuOpen && <View style={{ position: 'absolute', top: -48, height: 40, flexDirection: 'row', }}>
                        <Pressable
                            style={{ height: 40, width: 50, borderRadius: 16, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', borderColor: Color['grey200'], borderWidth: 1, marginHorizontal: 4, backgroundColor: `#FFF` }}
                            onPress={() => { setModalVisible(true) }}>
                            <View style={{ backgroundColor: Color['blue500'], width: 20, height: 20 }} />
                        </Pressable>
                        <Pressable
                            style={{ height: 40, width: 50, borderRadius: 16, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', borderColor: Color['grey200'], borderWidth: 1, backgroundColor: `#FFF` }}
                            onPress={clearChatLogFile}>
                            <View style={{ backgroundColor: Color['red500'], width: 20, height: 20 }} />
                        </Pressable>
                    </View>}
                    <TextInput
                        onChangeText={(text) => setMessage(text)}
                        value={typedMessage}
                        multiline={true}
                        numberOfLines={3}
                        textAlign='right'
                        style={{ paddingHorizontal: 8, paddingVertical: 12, fontSize: 16, flex: 1, minHeight: 16 }}
                        onFocus={() => setType(true)}
                        onBlur={() => setType(false)}
                        onContentSizeChange={(event) => {
                            setInputHeight(event.nativeEvent.contentSize.height);  // +16은 패딩이나 마진을 고려한 값
                        }} />
                    {(typedMessage != "" || isTyped) && <Pressable
                        style={{ backgroundColor: Color['blue500'], marginVertical: 2, marginHorizontal: 2, width: 50, height: 40, alignSelf: 'center', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
                        onPress={handleSend}>
                        <View style={{ backgroundColor: '#FFF', width: 20, height: 20 }} />
                    </Pressable>
                    }
                </View>

            </View>
            <Modal visible={ModalVisible}
                transparent
                animationType="slide"
            >
                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
                    onPress={() => { }}>
                    <View style={{ height: 420, padding: 12, backgroundColor: "#FFF", paddingBottom: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 120, alignSelf: 'center', marginVertical: 12, paddingBottom: 8 }}
                            onPress={() => setSelctingState(true)}>
                            <Text style={{ alignSelf: 'center', fontSize: 20, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey800'] }}>{selectedAlbum?.title ?? '전체'}</Text>
                            <View style={{ width: 24, height: 24, backgroundColor: Color['blue200'] }} />
                        </Pressable>
                        {isSelectingAlbum && <View style={{
                            display: 'flex', position: 'absolute', right: width / 2 - 72, top: 20, zIndex: 10, backgroundColor: '#FFF', alignItems: 'flex-end', paddingHorizontal: 14, borderRadius: 5, shadowColor: Color['grey700'],
                            shadowOffset: { width: -2, height: 2 }, // 그림자 오프셋 (x, y)
                            shadowOpacity: 0.1,         // 그림자 투명도 (0에서 1)
                            shadowRadius: 5,          // 그림자 반경
                            elevation: 5,
                            maxHeight: 160,
                        }}>
                            <FlatList
                                contentContainerStyle={{ flex: 1 }}
                                data={albums}
                                renderItem={({ item }) => {
                                    return (
                                        <Pressable style={{ flexDirection: 'row-reverse', width: 120, paddingVertical: 8, marginVertical: 4, alignItems: 'center', justifyContent: 'space-between' }}
                                            onPress={() => { selectAlbum(item) }}>
                                            <Text style={{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, textAlign: 'right', color: selectedAlbum == item ? Color['blue500'] : Color['grey400'] }}>{item.title}</Text>
                                        </Pressable>
                                    )
                                }}
                            />
                        </View>}
                        {photos?.length > 0 ? <FlatList
                            data={photos}
                            renderItem={renderModalItem}
                            keyExtractor={(item, index) => item.id + index}
                            numColumns={3}  // 3열로 이미지 배치
                            initialNumToRender={12} // 처음 렌더링할 아이템 수
                            windowSize={21} // 메모리 최적화를 위한 window size
                            removeClippedSubviews={true} // 화면 밖 아이템 제거
                            showsVerticalScrollIndicator={false}
                            onEndReached={() => {
                                if (!isLoading && hasMore) {
                                    fetchPhotos();
                                }
                            }}
                            onEndReachedThreshold={0.85} // 여전히 이 값을 유지하여 기본 동작을 추가
                            ListFooterComponent={isLoading ? <View style={{ height: 120, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#0000ff" /></View> : null}
                        /> : isLoading ?
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View> :
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 24, color: Color['grey400'], paddingVertical: 8 }}>이 앨범엔 사진이 없어요</Text>
                                <Pressable onPress={() => setAlbum(null)}>
                                    <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 16, color: Color['grey300'], paddingVertical: 6 }}>다른앨범 보러가기</Text>
                                </Pressable>
                            </View>}
                    </View>
                    <View style={{ backgroundColor: "#FFF" }}>
                        <View style={{ height: 8 }} />
                        <LongButton color='red' isAble={true} innerText="닫기" onPress={() => { setModalVisible(false), setSelectedImages([]), setAlbum(null) }} />

                        <View style={{ height: 8 }} />
                        <LongButton color='blue' isAble={selectedImages.length > 0} innerText={selectedImages.length > 0 ? `사진 전송 (${selectedImages.length})` : '사진 선택'} onPress={handleSendImagesViaSocket} />

                        <View style={{ height: 24 }} />
                    </View>
                </Pressable>
            </Modal>
        </KeyboardAvoidingView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    formalZone: {
        marginHorizontal: 24,
    },
    PartnerMessage: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontFamily: 'NanumSquareNeo-Regular',
        fontSize: 16,
        maxWidth: 240,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Color['grey100'],
        overflow: 'hidden'
    },
    timeStamp: {
        fontFamily: 'NanumSquareNeo-Regular',
        fontSize: 12,
        color: Color['grey300'],
        marginHorizontal: 6,
        marginVertical: 4
    },
    MyMessage: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontFamily: 'NanumSquareNeo-Regular',
        fontSize: 16,
        maxWidth: 240,
        borderRadius: 10,
        backgroundColor: Color['blue500'],
        color: Color['blue100'],
        overflow: 'hidden'
    },
    chatDate: {
        fontFamily: 'NanumSquareNeo-Regular',
        fontSize: 14,
    },
})