import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

export const copyToClipboard = async (text: string, showAlert: boolean = true) => {
  try {
    await Clipboard.setStringAsync(text);
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
    if (showAlert) {
      Alert.alert('오류', '텍스트 복사에 실패했습니다.');
    }
  }
};
