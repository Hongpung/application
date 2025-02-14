import React from 'react';
import { BannerDto } from '@src/entities/banner/type';
import { Pressable, Image, Linking } from 'react-native';

interface BannerItemProps {
    banner: BannerDto;
}

const BannerItem: React.FC<BannerItemProps> = ({ banner }) => {
    return (
        <Pressable style={{ flex: 1 }}
            onPress={() => { banner.href && Linking.openURL(banner.href) }}>
            <Image src={banner.bannerImgUrl} style={{ height: 120, width: '100%', alignItems: 'center' }} resizeMode="cover" />
        </Pressable>
    );
};

export default BannerItem;