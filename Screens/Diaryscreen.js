"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const generateDummyData = (year, month) => {
  const data = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDate = new Date(year, month, 1);
  for (let i = 0; i < daysInMonth; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    data.push({
      date: currentDate,
      mood: null,
      sleep: null,
      seizures: [],
    });
  }
  return data;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DiaryScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [diaryData, setDiaryData] = useState([]);
  const [seizureRecords, setSeizureRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const scrollViewRef = useRef(null);
  const horizontalScrollViewRef = useRef(null);
  const [entryHeight, setEntryHeight] = useState(0);

  const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const formatDate = (date, time) => {
    const validDate = new Date(date);
    const validTime = new Date(time);
    console.log(validDate);
    return `${validDate.getDate()}/${
      validDate.getMonth() + 1
    }/${validDate.getFullYear()}-${validTime.getHours()}:${validTime.getMinutes()}`;
  };
  const getSeizureRecords = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/seizure/get/${id}`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      if (res.status == 200) {
        setSeizureRecords(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getSeizureRecords();
    }
  }, [isFocused]);

  useEffect(() => {
    const newData = generateDummyData(selectedYear, selectedMonth);
    // Incorporate seizure data into diary data
    seizureRecords.forEach((seizure) => {
      const seizureDate = new Date(seizure.date);
      if (
        seizureDate.getFullYear() === selectedYear &&
        seizureDate.getMonth() === selectedMonth
      ) {
        const dayIndex = seizureDate.getDate() - 1;
        if (newData[dayIndex]) {
          newData[dayIndex].seizures.push(seizure);
        }
      }
    });
    setDiaryData(newData);
    setSelectedDate(new Date(selectedYear, selectedMonth, 1));
  }, [selectedYear, selectedMonth, seizureRecords]);

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const renderDayItem = (item, isSelected) => {
    const date = item.date;
    const hasSeizure = item.seizures.length > 0;
    const dots = isToday(date) ? (
      <View style={styles.dotsContainer}>
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    ) : hasSeizure ? (
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.seizureDot]} />
      </View>
    ) : null;

    return (
      <TouchableOpacity
        key={date.toString()}
        style={[styles.dayItem, isSelected && styles.selectedDayItem]}
        onPress={() => {
          setSelectedDate(date);
          scrollToSelectedDate(date);
        }}
      >
        <Text style={[styles.dayText, isSelected && styles.selectedText]}>
          {weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1]}
        </Text>
        <Text style={[styles.dateText, isSelected && styles.selectedText]}>
          {date.getDate()}
        </Text>
        {dots}
      </TouchableOpacity>
    );
  };

  const renderDiaryEntry = (item) => {
    const date = item.date;
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();

    return (
      <View
        key={date.toString()}
        style={styles.entryContainer}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          if (height > entryHeight) {
            setEntryHeight(height);
          }
        }}
      >
        <View style={styles.dateHeader}>
          <Text style={styles.entryDate}>{date.getDate()}</Text>
          <Text style={styles.entryDay}>{dayName}</Text>
        </View>
        <TouchableOpacity style={styles.entryButton}>
          <Ionicons name="sunny-outline" size={24} color="#0066FF" />
          <Text style={styles.entryButtonText}>Mood</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.entryButton}>
          <Ionicons name="moon-outline" size={24} color="#0066FF" />
          <Text style={styles.entryButtonText}>Sleep</Text>
        </TouchableOpacity>
        {item.seizures.map((seizure, index) => (
          <TouchableOpacity
            key={seizure.seizure_id}
            style={styles.seizureButton}
            onPress={() => navigation.navigate("SeizureDetails", { seizure })}
          >
            <Ionicons name="flash-outline" size={24} color="white" />
            <Text style={styles.seizureButtonText}>{seizure.seizure_type}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const scrollToSelectedDate = (date) => {
    const index = diaryData.findIndex(
      (item) => item.date.getDate() === date.getDate()
    );
    if (index !== -1 && scrollViewRef.current && entryHeight > 0) {
      scrollViewRef.current.scrollTo({
        y: index * entryHeight,
        animated: true,
      });
    }
  };

  const renderPickerItem = (item, onSelect) => (
    <TouchableOpacity
      style={styles.pickerItem}
      onPress={() => {
        onSelect(item);
        setShowMonthPicker(false);
        setShowYearPicker(false);
      }}
    >
      <Text style={styles.pickerItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Diary</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="filter" size={24} color="#6B4CE6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} 
          onPress={async()=>{
            const id = await AsyncStorage.getItem("id");
            navigation.navigate("addseizure",{id})}}
          >
            <Ionicons name="add-circle" size={24} color="#6B4CE6" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowMonthPicker(true)}
        >
          <Text style={styles.datePickerButtonText}>
            {months[selectedMonth]}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#6B4CE6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowYearPicker(true)}
        >
          <Text style={styles.datePickerButtonText}>{selectedYear}</Text>
          <Ionicons name="chevron-down" size={20} color="#6B4CE6" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekContainer}>
        <ScrollView
          ref={horizontalScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {diaryData.map((item) =>
            renderDayItem(
              item,
              item.date.toDateString() === selectedDate.toDateString()
            )
          )}
        </ScrollView>
      </View>

      <Text style={styles.monthText}>
        {selectedDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </Text>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {diaryData.map((item) => renderDiaryEntry(item))}
      </ScrollView>

      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <FlatList
              data={months}
              renderItem={({ item, index }) =>
                renderPickerItem(item, () => setSelectedMonth(index))
              }
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <FlatList
              data={Array.from(
                { length: 6 },
                (_, i) => currentDate.getFullYear() - 5 + i
              )}
              renderItem={({ item }) =>
                renderPickerItem(item.toString(), () => setSelectedYear(item))
              }
              keyExtractor={(item) => item.toString()}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 15,
  },
  headerButton: {
    padding: 5,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 10,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B4CE6",
    marginRight: 5,
  },
  weekContainer: {
    height: 70,
    paddingVertical: 5,
    backgroundColor: "#F8F8F8",
  },
  dayItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 15,
    width: SCREEN_WIDTH / 7 - 10,
    height: 60,
    marginHorizontal: 5,
  },
  selectedDayItem: {
    backgroundColor: "#6B4CE6",
  },
  dayText: {
    fontSize: 10,
    color: "#000000",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 2,
    gap: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#6B4CE6",
  },
  seizureDot: {
    backgroundColor: "#FF6B6B",
  },
  monthText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 10,
    marginLeft: 20,
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  entryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 10,
  },
  entryDate: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginRight: 8,
  },
  entryDay: {
    fontSize: 14,
    color: "#666666",
  },
  entryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#0066FF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  entryButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#0066FF",
  },
  seizureButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FF6B6B",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#FF6B6B",
  },
  seizureButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "white",
    fontWeight: "400",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    width: "80%",
    maxHeight: "60%",
  },
  pickerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  pickerItemText: {
    fontSize: 18,
    color: "#6B4CE6",
    textAlign: "center",
  },
});
