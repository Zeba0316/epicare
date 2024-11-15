import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Homescreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#E9DEFA", "#FBFCDB", "#E9DEFA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Home</Text>
            <TouchableOpacity style={styles.addButton}>
              <LinearGradient
                colors={["#6B4CE6", "#9D7BEA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>Add Seizure</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My notifications</Text>
            <NotificationItem
              icon="sun"
              text="How do you feel today?"
              action="Answer"
            />
            <NotificationItem
              icon="moon"
              text="Hi! How well did you sleep last night?"
              action="Answer"
            />
            <NotificationItem
              icon="bell"
              text="Welcome! You'll find your day notifications here. They're here to help you."
              action="Ok"
            />
            <NotificationItem
              icon="cog"
              text="You can configure or deactivate your notifications in the Settings."
              action="Go"
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My seizures</Text>
              <TouchableOpacity>
                <Text style={styles.moreGraphs}>More graphs</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.graphTabs}>
              <Text style={[styles.graphTab, styles.activeGraphTab]}>Week</Text>
              <Text style={styles.graphTab}>Month</Text>
              <Text style={styles.graphTab}>Year</Text>
            </View>
            <View style={styles.graph}>
              {['F', 'S', 'S', 'M', 'T', 'W', 'T'].map((day, index) => (
                <View key={index} style={styles.graphBar}>
                  <View style={styles.graphBarFill} />
                  <Text style={styles.graphBarLabel}>{day}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My treatments</Text>
            <Text style={styles.noTreatment}>No current treatment yet</Text>
          </View>
        </ScrollView>

        <View style={styles.tabBar}>
          <TabBarIcon name="home" active />
          <TabBarIcon name="book" />
          <TabBarIcon name="prescription-bottle-alt" />
          <TabBarIcon name="cog" />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const NotificationItem = ({ icon, text, action }) => (
  <View style={styles.notificationItem}>
    <FontAwesome5 name={icon} size={20} color="#6B4CE6" style={styles.notificationIcon} />
    <Text style={styles.notificationText}>{text}</Text>
    <TouchableOpacity style={styles.notificationAction}>
      <Text style={styles.notificationActionText}>{action}</Text>
    </TouchableOpacity>
  </View>
);

const TabBarIcon = ({ name, active }) => (
  <View style={styles.tabBarItem}>
    <FontAwesome5 name={name} size={20} color={active ? "#6B4CE6" : "#BDBDBD"} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D1F4B',
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D1F4B',
    marginBottom: 10,
  },
  moreGraphs: {
    color: '#6B4CE6',
    fontWeight: '600',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationIcon: {
    marginRight: 15,
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    color: '#34495E',
  },
  notificationAction: {
    backgroundColor: 'rgba(107, 76, 230, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  notificationActionText: {
    color: '#6B4CE6',
    fontWeight: '600',
  },
  graphTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(107, 76, 230, 0.1)',
    borderRadius: 20,
    padding: 5,
    marginBottom: 15,
  },
  graphTab: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 5,
    color: '#6B4CE6',
  },
  activeGraphTab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
  graph: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
    alignItems: 'flex-end',
  },
  graphBar: {
    width: 30,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  graphBarFill: {
    width: '100%',
    height: '70%',
    backgroundColor: 'rgba(107, 76, 230, 0.2)',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  graphBarLabel: {
    marginTop: 5,
    color: '#6B4CE6',
  },
  noTreatment: {
    color: '#6B4CE6',
    fontStyle: 'italic',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(107, 76, 230, 0.1)',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  tabBarItem: {
    alignItems: 'center',
  },
});
