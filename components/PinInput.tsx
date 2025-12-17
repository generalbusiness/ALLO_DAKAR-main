import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface PinInputProps {
    length?: number;
    onComplete: (pin: string) => void;
    error?: boolean;
    disabled?: boolean;
}

export function PinInput({ length = 4, onComplete, error = false, disabled = false }: PinInputProps) {
    const [pin, setPin] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const onCompleteRef = useRef(onComplete);
    const hasCalledComplete = useRef(false);

    // Update ref when onComplete changes
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        const isComplete = pin.every(digit => digit !== '');
        if (isComplete && !hasCalledComplete.current) {
            hasCalledComplete.current = true;
            onCompleteRef.current(pin.join(''));
        } else if (!isComplete) {
            hasCalledComplete.current = false;
        }
    }, [pin]);

    const handleChange = (index: number, value: string) => {
        if (disabled) return;

        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto-focus next input
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (index: number, e: any) => {
        if (disabled) return;

        if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const getInputStyle = (digit: string) => {
        if (error) {
            return [styles.input, styles.inputError];
        }
        if (digit) {
            return [styles.input, styles.inputFilled];
        }
        return [styles.input, styles.inputEmpty];
    };

    return (
        <View style={styles.container}>
            {pin.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    style={[
                        ...getInputStyle(digit),
                        disabled && styles.inputDisabled
                    ]}
                    value={digit}
                    onChangeText={value => handleChange(index, value)}
                    onKeyPress={e => handleKeyPress(index, e)}
                    keyboardType="numeric"
                    maxLength={1}
                    editable={!disabled}
                    autoFocus={index === 0}
                    selectTextOnFocus
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
    },
    input: {
        width: 56,
        height: 56,
        textAlign: 'center',
        fontSize: 24,
        borderRadius: 12,
        borderWidth: 2,
        backgroundColor: '#ffffff',
    },
    inputEmpty: {
        borderColor: '#d1d5db',
    },
    inputFilled: {
        borderColor: '#facc15',
        backgroundColor: '#fefce8',
    },
    inputError: {
        borderColor: '#ef4444',
        backgroundColor: '#fef2f2',
    },
    inputDisabled: {
        opacity: 0.5,
    },
});
