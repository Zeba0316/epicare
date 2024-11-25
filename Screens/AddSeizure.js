import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
export default function AddSeizure({ route }) {
  const navigation = useNavigation();
  const { id } = route.params;
  const [formData, setFormData] = useState({
    date: new Date(),
    time: new Date(),
    type: "",
    feltItComing: null,
    duringSleep: null,
    duration: "",
    triggers: [],
    location: "",
    medications: [],
    remarks: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showTriggersModal, setShowTriggersModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showMedicationsModal, setShowMedicationsModal] = useState(false);

  const durationRef = useRef(null);

  const seizureTypes = [
    "Generalized tonic-clonic seizure",
    "Generalized absence seizure",
    "Generalized motor seizure",
    "Focal aware seizure",
    "Focal impaired awareness seizure",
    "Other",
  ];

  const triggerOptions = [
    "Stress",
    "Tired",
    "Lack of sleep",
    "Forgot to take meds",
    "Period",
    "Intense emotions",
    "Waking up",
    "Visual stimuli",
    "Alcohol",
    "Heat / Damp",
    "Sickness / Fever",
    "Other",
  ];

  const locationOptions = [
    "At home",
    "At work",
    "In transport / commute",
    "At school",
    "Other",
  ];

  const medicationOptions = [
    "Midazolam",
    "Diazepam",
    "Clobazam",
    "Vagus nerve stimulation",
    "Other",
  ];
  const handleSave = async () => {
    console.log("started");
    if (
      !formData.date ||
      !formData.time ||
      !formData.type ||
      formData.feltItComing === null ||
      formData.duringSleep === null||
      !formData.duration
    ) {
      Alert.alert("Please fill the required fields");
      return;
    }
    const body = {
      ...formData,
      seizure_type: formData.type,
      felt_it_coming: formData.feltItComing,
      during_sleep: formData.duringSleep,
      duration: formData.duration,
      triggers: formData.triggers,
      location: formData.location,
      medications: formData.medications,
      remarks: formData.remarks,
      id: id,
      date: formData.date.toISOString(),
      time: formData.time.toISOString(),
    };
    console.log("body", body);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/seizure/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (res.status == 200) {
        Alert.alert("Seizure saved", "Seizure saved successfully");
        setFormData({
          date: new Date(),
          time: new Date(),
          type: "",
          feltItComing: null,
          duringSleep: null,
          duration: "",
          triggers: [],
          location: "",
          medications: [],
          remarks: "",
        });
      } else {
        Alert.alert("Error", "Seizure not saved");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || formData.date;
    setShowDatePicker(Platform.OS === "ios");
    setFormData({ ...formData, date: currentDate });
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || formData.time;
    setShowTimePicker(Platform.OS === "ios");
    setFormData({ ...formData, time: currentTime });
  };

  const renderModal = (
    visible,
    title,
    options,
    onSelect,
    onClose,
    multiSelect = false
  ) => (
    <Modal isVisible={visible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        <ScrollView>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalOption}
              onPress={() => onSelect(option)}
            >
              <Text style={styles.modalOptionText}>{option}</Text>
              {(multiSelect
                ? formData[title.toLowerCase()].includes(option)
                : formData[title.toLowerCase()] === option) && (
                <Ionicons name="checkmark" size={24} color="#6B4CE6" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
          <Text style={styles.modalCloseButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6B4CE6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Seizure</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputText}>
              {formData.date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}

          <Text style={styles.label}>Time</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.inputText}>
              {formData.time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={formData.time}
              mode="time"
              display="default"
              onChange={onChangeTime}
            />
          )}

          <Text style={styles.label}>Type</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTypeModal(true)}
          >
            <Text style={styles.inputText}>
              {formData.type || "Select one option"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Felt it coming?</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                formData.feltItComing === true && styles.radioButtonSelected,
              ]}
              onPress={() => setFormData({ ...formData, feltItComing: true })}
            >
              <Text
                style={[
                  styles.radioButtonText,
                  formData.feltItComing === true &&
                    styles.radioButtonTextSelected,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                formData.feltItComing === false && styles.radioButtonSelected,
              ]}
              onPress={() => setFormData({ ...formData, feltItComing: false })}
            >
              <Text
                style={[
                  styles.radioButtonText,
                  formData.feltItComing === false &&
                    styles.radioButtonTextSelected,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>During sleep?</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                formData.duringSleep === true && styles.radioButtonSelected,
              ]}
              onPress={() => setFormData({ ...formData, duringSleep: true })}
            >
              <Text
                style={[
                  styles.radioButtonText,
                  formData.duringSleep === true &&
                    styles.radioButtonTextSelected,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                formData.duringSleep === false && styles.radioButtonSelected,
              ]}
              onPress={() => setFormData({ ...formData, duringSleep: false })}
            >
              <Text
                style={[
                  styles.radioButtonText,
                  formData.duringSleep === false &&
                    styles.radioButtonTextSelected,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Duration (in minutes)</Text>
          <TextInput
            ref={durationRef}
            style={styles.input}
            value={formData.duration}
            onChangeText={(text) => {
              setFormData({ ...formData, duration: text });
            }}
            placeholder="00:00"
            keyboardType="numeric"
            maxLength={5}
          />

          <Text style={styles.label}>Triggers (Optional)</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTriggersModal(true)}
          >
            <Text style={styles.inputText}>
              {formData.triggers.length > 0
                ? formData.triggers.join(", ")
                : "Select option(s)"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Location (Optional)</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowLocationModal(true)}
          >
            <Text style={styles.inputText}>
              {formData.location || "Select one option"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Medications (Optional)</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowMedicationsModal(true)}
          >
            <Text style={styles.inputText}>
              {formData.medications.length > 0
                ? formData.medications.join(", ")
                : "Select option(s)"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Remarks (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            value={formData.remarks}
            onChangeText={(text) => setFormData({ ...formData, remarks: text })}
            placeholder="Add any additional notes here"
          />
        </View>
      </ScrollView>

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            handleSave();
          }}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {renderModal(
        showTypeModal,
        "Type",
        seizureTypes,
        (option) => {
          setFormData({ ...formData, type: option });
        },
        () => setShowTypeModal(false)
      )}

      {renderModal(
        showTriggersModal,
        "Triggers",
        triggerOptions,
        (option) => {
          const updatedTriggers = formData.triggers.includes(option)
            ? formData.triggers.filter((item) => item !== option)
            : [...formData.triggers, option];
          setFormData({ ...formData, triggers: updatedTriggers });
        },
        () => setShowTriggersModal(false),
        true
      )}

      {renderModal(
        showLocationModal,
        "Location",
        locationOptions,
        (option) => {
          setFormData({ ...formData, location: option });
        },
        () => setShowLocationModal(false)
      )}

      {renderModal(
        showMedicationsModal,
        "Medications",
        medicationOptions,
        (option) => {
          const updatedMedications = formData.medications.includes(option)
            ? formData.medications.filter((item) => item !== option)
            : [...formData.medications, option];
          setFormData({ ...formData, medications: updatedMedications });
        },
        () => setShowMedicationsModal(false),
        true
      )}
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D1F4B",
  },
  headerRight: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  formSection: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2D1F4B",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#2D1F4B",
  },
  inputText: {
    fontSize: 16,
    color: "#2D1F4B",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  radioButtonSelected: {
    backgroundColor: "#6B4CE6",
  },
  radioButtonText: {
    fontSize: 16,
    color: "#2D1F4B",
    fontWeight: "500",
  },
  radioButtonTextSelected: {
    color: "#FFFFFF",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButtonContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  saveButton: {
    backgroundColor: "#6B4CE6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D1F4B",
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#2D1F4B",
  },
  modalCloseButton: {
    marginTop: 16,
    alignItems: "center",
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6B4CE6",
  },
});
