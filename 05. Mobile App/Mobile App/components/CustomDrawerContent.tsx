import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { getBackgroundColorAsync } from "expo-system-ui";
import { View } from "react-native";
import { ThemedText } from "./ThemedText";

export default function CustomDrawerContent(props: any) {
    const router = useRouter();

    return (
        <View style={{ flex: 1}}>
            <DrawerContentScrollView {...props}
                scrollEnabled={false}
                contentContainerStyle={{backgroundColor: '#ff7711'}}
            >
                <ThemedText type="drawerHeader">Hello User Name</ThemedText>
                <View style={{
                        backgroundColor: '#ffb925',
                        paddingTop: 20,
                    }}
                >
                    <DrawerItemList {...props} />
                    <DrawerItem
                        label={'logout'}
                        onPress={() => router.replace('/')} 
                    />
                </View>
            </DrawerContentScrollView>
        </View>
    );
}