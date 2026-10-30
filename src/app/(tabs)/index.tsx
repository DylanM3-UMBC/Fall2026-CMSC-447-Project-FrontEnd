import { useEffect, useState } from 'react';
import { FlatList, Image, ImageStyle, ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, useWindowDimensions, View, ViewStyle } from 'react-native';
import { EmptyPlaceholder, FileCard, PickerWrapper, UploadedFile } from '../../components/pdfprojectItemComponent';

interface DashboardStyles {
  screenContainer: ViewStyle;
  stickyHeaderWrapper: ViewStyle;
  topNavbar: ViewStyle;
  innerNavbar: ViewStyle;
  navLogo: TextStyle;
  mainScroll: ViewStyle;
  scrollContent: ViewStyle;
  centerLayoutWrapper: ViewStyle;
  heroSection: ViewStyle;
  dateText: TextStyle;
  gridRow: ViewStyle;
  leftCommunityColumn: ViewStyle;
  rightGroupsColumn: ViewStyle;
  sidebarContainer: ViewStyle;
  sectionTitle: TextStyle;
  groupCardItem: ViewStyle;
  groupCardText: TextStyle;
  profileBannerImage: ImageStyle
  scrollBoxWrapper: ViewStyle
  tabBar: ViewStyle
  tabButton: ViewStyle
  activeTabButton: ViewStyle
  tabText: TextStyle
  activeTabText: TextStyle
  placeholderText: TextStyle
  createProjectButton: ViewStyle;
  createProjectText: TextStyle;
}

const SIDEBAR_DATA = [
  { title: 'Academics', icon: '🎓' },
  { title: 'Campus Life', icon: '🛡️' },
  { title: 'Classifieds', icon: '📢' },
  { title: 'Current Events', icon: '📅' },
  { title: 'Current Events', icon: '📅' },
  { title: 'Current Events', icon: '📅' },
  { title: 'Current Events', icon: '📅' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('Your Projects');
  // 1. All hook dependencies execute unconditionally at the top level
  const { width } = useWindowDimensions(); 
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // 2. Generate styles safely
  const styles = createStyles(width);
  
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const addFile = (f: any) => setFiles((p) => [...p, {
    id: Math.random().toString(36).substring(2, 9),
    name: f.name || 'Unnamed PDF',
    uri: f.uri,
    size: f.size,
    uploadedAt: new Date().toLocaleTimeString(),
  }]);

  return (
    <View style={styles.screenContainer}>
      {!hasHydrated ? (
        // Render a basic layout shell matching the server tree size
        <View style={{ flex: 1, backgroundColor: '#fff' }} />
      ) : (
        <>
          {/* 1. STICKY MOUNT LAYER: Keeps header pinned at the top naturally */}
          <View style={styles.stickyHeaderWrapper}>
            <View style={styles.topNavbar}>
              <View style={styles.innerNavbar}>
                <Text style={styles.navLogo}>myUMBC</Text>
              </View>
            </View>
          </View>

          {/* 2. MAIN SCROLL CONTAINER */}
          <ScrollView 
            style={styles.mainScroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}
          >
            <View style={styles.centerLayoutWrapper}>
              
              {/* UPPER ZONE: Events & Dates */}
              <View style={styles.heroSection}>
                <Image source={require("../../assets/images/umbc_day_sign.png")} style={styles.profileBannerImage}/>
                <Text style={styles.dateText}>FRIDAY, OCTOBER 30, 2026</Text>
              </View>

              {/* LOWER ZONE: 2-Column Side-by-Side Content Grid */}
              <View style={styles.gridRow}>
                
                {/* LOWER LEFT: Community Feed Section */}
                <View style={styles.leftCommunityColumn}>
                  <Text style={styles.sectionTitle}>Projects</Text>

                  <PickerWrapper onFilePicked={addFile}>
                    {(openPicker) => (
                    <View>
                      {/* The touch layer isolates strictly around the text boundaries */}
                      <TouchableOpacity style={styles.createProjectButton}  onPress={openPicker}>
                        <Text style={styles.createProjectText}>Create Project +</Text>
                      </TouchableOpacity>
                    </View>
                    )}
                  </PickerWrapper>

                  
                  <View style={styles.tabBar}>
                    <TouchableOpacity 
                      onPress={() => setActiveTab('Your Projects')}
                      style={[styles.tabButton, activeTab === 'Your Projects' && styles.activeTabButton]}
                    >
                      <Text style={[styles.tabText, activeTab === 'Your Projects' && styles.activeTabText]}>
                        Your Projects
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => setActiveTab('Shared Projects')}
                      style={[styles.tabButton, activeTab === 'Shared Projects' && styles.activeTabButton]}
                    >
                      <Text style={[styles.tabText, activeTab === 'Shared Projects' && styles.activeTabText]}>
                        Shared Projects
                      </Text>
                    </TouchableOpacity>
                  </View>


                  {activeTab === 'Your Projects' ? (
                    <FlatList
                      data={files}
                      keyExtractor={(item) => item.id}
                      ListEmptyComponent={<EmptyPlaceholder />}
                      renderItem={({ item }) => <FileCard item={item} onDelete={(id) => setFiles((p) => p.filter(x => x.id !== id))} />}
                      nestedScrollEnabled={true} 
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={true}
                      
                    />
                  ) : (
                    /* Render your shared projects list view here */
                    <Text style={styles.placeholderText}>No Shared Projects...</Text>
                  )}  
                </View>

                {/* LOWER RIGHT: Sidebar Layout */}
                <View style={styles.rightGroupsColumn}>
                  
                  {/* FIRST MODULE: Upper Discussion Groups */}
                  <View style={styles.sidebarContainer}>
                    <Text style={styles.sectionTitle}>Task Summary Reports</Text>
                  </View>

                  {/* SECOND MODULE: Duplicated Discussion Groups underneath */}
                  <View style={styles.sidebarContainer}>
                    <Text style={styles.sectionTitle}>Comments</Text>
                    
                    <View style={styles.scrollBoxWrapper}>
                      {/* Clean, error-free alternative to FlatList that uses your exact dynamic properties */}
                      <ScrollView 
                        nestedScrollEnabled={true} 
                        showsVerticalScrollIndicator={true}
                      >
                        {SIDEBAR_DATA.map((singleItem, index) => (
                          <View key={index}>
                            {/* This acts exactly like your renderItem body, passing down your item object parameter natively */}
                            <View style={styles.groupCardItem}>
                              <Text style={styles.groupCardText}>
                                {singleItem.icon}  {singleItem.title}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  </View>

                </View>

              </View>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
}

const createStyles = (width: number): DashboardStyles => {
  const isWebWide = width > 1200;
  const contentWidth = isWebWide ? 1160 : width * 0.95;

  return StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: '#fff',
    },
    stickyHeaderWrapper: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
    },
    topNavbar: {
      width: '100%',
      height: 56,
      backgroundColor: '#000',
      borderBottomWidth: 4,
      borderBottomColor: '#F8B125', 
      justifyContent: 'center',
      alignItems: 'center',
    },
    innerNavbar: {
      width: contentWidth,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
    },
    scrollBoxWrapper: {
      height: 210, 
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 8,
    },
    navLogo: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
    mainScroll: {
      flex: 1,
    },
    scrollContent: {
      alignItems: 'center',
      paddingBottom: 60,
    },
    centerLayoutWrapper: {
      width: contentWidth,
      paddingTop: 24, 
      borderWidth: 0,
    },
    heroSection: {
      width: '100%',
      bottom: 30,
      marginBottom: 12,
      paddingHorizontal: 15,
      borderWidth: 0,
    },
    profileBannerImage: {
      width: "100%",
      resizeMode: 'cover',
    },


    dateText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#007BFF', 
      marginBottom: 8,
    },
    gridRow: {
      width: '100%',
      flexDirection: 'row', 
      paddingHorizontal: 15,
    },
    leftCommunityColumn: {
      flex: 7.2, 
      paddingRight: 24,
      borderWidth: 0,
    },
    rightGroupsColumn: {
      flex: 2.8, 
      flexDirection: 'column', // Stacks the modules vertically below each other
    },
    sidebarContainer: {
      width: '100%',
      marginBottom: 32, // Spacing gap separating the top widget block from the bottom widget block
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      paddingBottom: 8,
    },
    groupCardItem: {
      width: '100%',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#F9F9F9',
      borderRadius: 6,
      marginBottom: 8,
      borderWidth: 0,
      borderColor: '#EAEAEA',
    },
    groupCardText: {
      fontSize: 14,
      color: '#444',
      fontWeight: '500',
    },


    // Start of Tab bar For Project Container
    tabBar: {
      position: "absolute",
      top: "0%",
      left: "25%",

      flexDirection: 'row',
      marginBottom: 16,
      gap: 24,
    },
    tabButton: {
      paddingBottom: 8,
      borderBottomWidth: 3,
      borderBottomColor: 'transparent', // Invisible line when inactive
    },
    activeTabButton: {
      borderBottomColor: '#fdb515', // Solid black line indicator when active
    },
    tabText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#9e9e9e', // Faded gray for inactive text
    },
    activeTabText: {
      color: '#000000', // Bold black text for active state
    },
    placeholderText: {
      flex: 1,
      margin: "26%",
      alignItems: 'center',
      justifyContent: "center",
      textAlign: 'center',
      marginTop: "28%",
      color: '#333',
      fontSize: 14,
    },

    textLinkSpacing: {
      // Only apply layout margins to separate items, avoid adding padding!
      marginBottom: 12, 
      // This forces the touch boundary box to collapse tightly around the font glyphs
      alignSelf: 'flex-start', 
    },

    createProjectButton: {
      // Zero internal padding ensures only the explicit text area responds to clicks
      alignSelf: 'flex-end', 
      padding: 8,
      paddingHorizontal: 20,
      paddingVertical: 6,
      marginBottom: 2,
      marginTop: -60,
      borderRadius: 6,
      borderColor: "#10B981",
      borderWidth: 3,           
    },
    createProjectText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#10B981',             
    },
  });
};
