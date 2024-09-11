import { ThemedText } from "@/components/CommonModules/ThemedText";
import { ThemedView } from "@/components/CommonModules/ThemedView";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faArrowRight,
  faChevronRight,
  faC,
} from "@fortawesome/free-solid-svg-icons";
import { Href, router } from "expo-router";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Ticket } from "@/controller/Ticket";
import { TicketView } from "@/components/UIComponents/TicketView";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAppContext } from "@/context/AppContext";

var ticketsAvailable = true;
const ticket = new Ticket();

export default function Dashboard() {
  const { myTickets } = useAppContext();
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "dark" ? "#eee" : "#777";
  const iconSize = 15;

  const credits = 500.25;

  return (
    <ScreenWrapper>
      <View style={styles.mainBody}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 20,
            paddingVertical: 3,
            paddingHorizontal: 5,
            marginHorizontal: "10%",
          }}
        >
          <ThemedText
            type={"h4"}
            lightColor={"#fff"}
            darkColor={"#fff"}
            style={{ marginLeft: 5 }}
          >
            Rs. {credits}
          </ThemedText>
          <Pressable
            style={[
              styles.rechargeButton,
              {
                borderColor: "#fff",
                borderWidth: 2,
              },
            ]}
            onPress={() => router.replace("/index" as Href<string>)}
          >
            <ThemedText type="h6" lightColor={"#fff"} darkColor={"#fff"}>
              Recharge
            </ThemedText>
          </Pressable>
        </View>

        <ThemedText
          type={"h4"}
          style={styles.cardHeader}
          lightColor="#fff"
          darkColor="#fff"
        >
          Available Tickets
        </ThemedText>

        <ScrollView>
          {[...myTickets.values()].map((ticket) => (
            <TicketView key={ticket.id} ticket={ticket} />
          ))}
          {/* <FlatList
            style={styles.flatList}
            data={myTickets}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <TicketView ticket={item} />}
          /> */}
          {/* {ticketsAvailable && <TicketView ticket={ticket} />}
          {ticketsAvailable && <TicketView ticket={ticket} />}
          {ticketsAvailable && <TicketView ticket={ticket} />} */}
          {!ticketsAvailable && (
            <ThemedText
              type="s5"
              lightColor="#fff"
              style={{ alignSelf: "center", marginBottom: 20 }}
            >
              No tickets are available
            </ThemedText>
          )}

          {ticketsAvailable && (
            <Pressable
              style={{
                backgroundColor: "#1cde",
                borderWidth: 0,
                borderRadius: 10,
                marginHorizontal: 10,
                padding: 10,
                marginTop: 20,
              }}
              onPress={() =>
                router.replace(
                  "@/components/TicketComponents/Booking" as Href<string>
                )
              }
            >
              <ThemedText
                type={"s5"}
                style={{ textAlign: "center" }}
                lightColor="#fff"
                darkColor="#fff"
              >
                Find my bus
              </ThemedText>
            </Pressable>
          )}
          <Pressable
            style={{
              backgroundColor: "#a8f",
              borderWidth: 0,
              borderRadius: 10,
              marginHorizontal: 10,
              padding: 10,
              marginTop: 10,
            }}
            onPress={() =>
              router.replace(
                "@/components/TicketComponents/Booking" as Href<string>
              )
            }
          >
            <ThemedText
              type={"s5"}
              style={{ textAlign: "center" }}
              lightColor="#fff"
              darkColor="#fff"
            >
              Buy Tickets
            </ThemedText>
          </Pressable>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    padding: 10,
    flex: 1,
  },
  flatList: {
    margin: 10,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  rechargeButton: {
    alignItems: "center",
    backgroundColor: "#fff2",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },
  cardBody: {
    borderWidth: 0,
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 3,
  },
  cardHeader: {
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 15,
    backgroundColor: "transparent",
  },
  drawerHeader: {
    flexDirection: "row",
    backgroundColor: "transparent",
    gap: 10,
  },
  logo: {
    height: 60,
    width: 60,
    borderRadius: 15,
  },
});
