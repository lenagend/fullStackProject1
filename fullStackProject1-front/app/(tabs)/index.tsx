import { View, Text, Button, TouchableOpacity, StyleSheet, Image  } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { FlatList } from 'react-native-gesture-handler';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // 색상 배열

export default function HomeScreen() {
  const [helloMessage, setHelloMessage] = useState("버튼을 눌러 요청하세요");
  const [messages, setMessages] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const clientId = "client_123"; // 클라이언트 식별용 (UUID를 사용할 수도 있음)

  // ✅ "Say Hello" 버튼 클릭 시 백엔드에서 hello 메시지 가져오기
  const fetchHelloMessage = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/hello");
      const data = await response.text();
      setHelloMessage(data);
    } catch (error) {
      setHelloMessage("API 요청 실패 😢");
      console.error("🚨 API 요청 오류:", error);
    }
  };

  // ✅ "Start Process" 버튼 클릭 시 백엔드에서 5초마다 리스트 채우기 시작
  const startProcess = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/start?clientId=${clientId}`, {
        method: "POST",
      });
      const result = await response.text();
      console.log(result);
      setIsStarted(true);
    } catch (error) {
      console.error("🚨 Start Process 요청 오류:", error);
    }
  };

  // ✅ 1초마다 리스트 데이터를 가져와 렌더링
  useEffect(() => {
    if (!isStarted) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/messages?clientId=${clientId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("🚨 메시지 목록 가져오기 오류:", error);
      }
    };

    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, [isStarted]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image source={require("@/assets/images/partial-react-logo.png")} style={styles.reactLogo} />
      }
    >
      <Text style={styles.title}>React Native Web API 연동 테스트</Text>

      {/* "Say Hello" 버튼 */}
      <Button title="Say Hello" onPress={fetchHelloMessage} />

      {/* "Start Process" 버튼 */}
      <Button title="Start Process" onPress={startProcess} />

      {/* 현재 응답 메시지 표시 */}
      <Text style={styles.message}>{helloMessage}</Text>

      {/* 1초마다 업데이트되는 리스트 */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={{ fontSize: 18, marginVertical: 5 }}>{item}</Text>}
      />
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
