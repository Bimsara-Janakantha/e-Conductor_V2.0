import { View } from "react-native";
import Seat from "./Seat";

export function Seat44Layout() {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View>
            <Seat index={1} reserved={true} />
            <Seat index={5} reserved={true} />
            <Seat index={9} />
            <Seat index={13} />
            <Seat index={17} />
            <Seat index={21} />
            <Seat index={25} />
            <Seat index={29} />
            <Seat index={33} />
          </View>
          <View>
            <Seat index={2} reserved={true} />
            <Seat index={6} reserved={true} />
            <Seat index={10} />
            <Seat index={14} />
            <Seat index={18} />
            <Seat index={22} />
            <Seat index={26} />
            <Seat index={30} />
            <Seat index={34} />
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View>
            <Seat index={3} reserved={true} />
            <Seat index={7} reserved={true} />
            <Seat index={11} />
            <Seat index={15} />
            <Seat index={19} />
            <Seat index={23} />
            <Seat index={27} />
            <Seat index={31} />
            <Seat index={35} />
            <Seat index={37} />
          </View>
          <View>
            <Seat index={4} reserved={true} />
            <Seat index={8} reserved={true} />
            <Seat index={12} />
            <Seat index={16} />
            <Seat index={20} />
            <Seat index={24} />
            <Seat index={28} />
            <Seat index={32} />
            <Seat index={36} />
            <Seat index={38} />
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Seat index={39} />
        <Seat index={40} />
        <Seat index={41} />
        <Seat index={42} />
        <Seat index={43} />
        <Seat index={44} />
      </View>
    </View>
  );
}

export function Seat54Layout() {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View>
            <Seat index={1} reserved={true} />
            <Seat index={6} reserved={true} />
            <Seat index={11} />
            <Seat index={16} />
            <Seat index={21} />
            <Seat index={26} />
            <Seat index={31} />
            <Seat index={36} />
            <Seat index={41} />
          </View>
          <View>
            <Seat index={2} reserved={true} />
            <Seat index={7} reserved={true} />
            <Seat index={12} />
            <Seat index={17} />
            <Seat index={22} />
            <Seat index={27} />
            <Seat index={32} />
            <Seat index={37} />
            <Seat index={42} />
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View>
            <Seat index={3} reserved={true} />
            <Seat index={8} />
            <Seat index={13} />
            <Seat index={18} />
            <Seat index={23} />
            <Seat index={28} />
            <Seat index={33} />
            <Seat index={38} />
            <Seat index={43} />
            <Seat index={46} />
          </View>
          <View>
            <Seat index={4} reserved={true} />
            <Seat index={9} />
            <Seat index={14} />
            <Seat index={19} />
            <Seat index={24} />
            <Seat index={29} />
            <Seat index={34} />
            <Seat index={39} reserved={false} />
            <Seat index={44} />
            <Seat index={47} />
          </View>
          <View>
            <Seat index={5} reserved={true} />
            <Seat index={10} />
            <Seat index={15} />
            <Seat index={20} />
            <Seat index={25} />
            <Seat index={30} />
            <Seat index={35} />
            <Seat index={40} reserved={false} />
            <Seat index={45} />
            <Seat index={48} />
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Seat index={49} />
        <Seat index={50} />
        <Seat index={51} />
        <Seat index={52} />
        <Seat index={53} />
        <Seat index={54} />
      </View>
    </View>
  );
}
