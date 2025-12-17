import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface AppLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'dark';
    showText?: boolean;
}

const logoImage = require('../../assets/images/logo/logo.jpeg');

export default function AppLogo({ size = 'md', variant = 'default', showText = false }: AppLogoProps) {
    const sizeStyles = {
        sm: { width: 32, height: 32 },
        md: { width: 48, height: 48 },
        lg: { width: 96, height: 96 },
        xl: { width: 150, height: 150 }
    };

    return (
        <View style={[styles.container, {
            width: sizeStyles[size].width,
            height: sizeStyles[size].height,
        }]}>
            <Image
                source={logoImage}
                style={[styles.image, {
                    width: sizeStyles[size].width,
                    height: sizeStyles[size].height,
                }]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        borderRadius: 24,
    },
});
