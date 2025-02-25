import { View, Text, Button, TouchableOpacity, StyleSheet, Image } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useState } from 'react';

export default function HomeScreen() {

  const [message, setMessage] = useState("버튼을 눌러 요청하세요");

  // ✅ API 요청 함수 (백엔드 연동)
  const handlePress = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/hello"); // 백엔드 주소
      const data = await response.text(); // 응답을 텍스트로 변환
      setMessage(data); // 화면에 표시
    } catch (error) {
      setMessage("API 요청 실패 😢");
      console.error("API 요청 오류:", error);
    }
  };


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
        <Text style={styles.title}>React Native Web API 연동 테스트</Text>

        {/* 현재 응답 메시지 표시 */}
        <Text style={styles.message}>{message}</Text>

        {/* 기본 버튼 (웹 & 안드로이드) */}
        <Button title="백엔드에서 데이터 가져오기" onPress={handlePress} />

     </ParallaxScrollView>
          );
        }

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },

});
