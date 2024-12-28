import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import Constants from "expo-constants";
import { Ticket } from "../controller/Ticket";
import { useNavigation } from "expo-router";

export type grapData = {
  value: number;
  date: string;
  label?: string;
};

export type VehicleDetails = {
  vehicleRegNo: string;
  seats: number;
  date: string;
  departureTime: string;
  bookedSeats: string[];
};

export type Bus = {
  id: string;
  regNo: string;
  service: string;
  seats: number;
  rides: number;
  ridesIncrement: number;
  earning: number;
  earningIncrement: number;
  rating: number;
  insuranceExp: string;
  VRL_Exp: string;
};

export type Message = {
  title: string;
  message: string;
  date: string;
};

export type accountType = "passenger" | "employee" | "owner";

interface AppContextProps {
  navigation: any;
  baseURL: string;
  apiKey: string;
  stripeKey: string;
  profileImage: string;
  setProfileImage: Dispatch<SetStateAction<string>>;
  id: string;
  setID: Dispatch<SetStateAction<string>>;
  accountType: string;
  setAccountType: Dispatch<SetStateAction<accountType>>;
  operatorAcc: boolean;
  setOperatorAcc: Dispatch<SetStateAction<boolean>>;
  ownerAcc: boolean;
  setOwnerAcc: Dispatch<SetStateAction<boolean>>;
  credits: number;
  setCredits: Dispatch<SetStateAction<number>>;
  fName: string;
  setFName: Dispatch<SetStateAction<string>>;
  lName: string;
  setLName: Dispatch<SetStateAction<string>>;
  phoneNo: string;
  setPhoneNo: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  nic: string;
  setNIC: Dispatch<SetStateAction<string>>;
  accountNo: string;
  setAccountNo: Dispatch<SetStateAction<string>>;
  accHolderName: string;
  setAccHolderName: Dispatch<SetStateAction<string>>;
  bankName: string;
  setBankName: Dispatch<SetStateAction<string>>;
  branchName: string;
  setBranchName: Dispatch<SetStateAction<string>>;
  ntcLicenseNo: string;
  setNTCLicenseNo: Dispatch<SetStateAction<string>>;
  driverLicenseNo: string;
  setDriverLicenseNo: Dispatch<SetStateAction<string>>;
  occupation: string;
  setOccupation: Dispatch<SetStateAction<string>>;
  seatNos: number[];
  setSeatNos: Dispatch<SetStateAction<number[]>>;
  discount: number;
  setDiscount: Dispatch<SetStateAction<number>>;
  busScheduleDetails: VehicleDetails[];
  setBusScheduleDetails: Dispatch<SetStateAction<VehicleDetails[]>>;
  myBuses: Bus[];
  setMyBuses: Dispatch<SetStateAction<Bus[]>>;
  myTickets?: Map<string, Ticket>;
  setMyTickets: Dispatch<SetStateAction<Map<string, Ticket> | undefined>>;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const navigation = useNavigation();
  const baseURL = Constants.expoConfig?.extra?.backend;
  const apiKey = Constants.expoConfig?.extra?.googlmap;
  const stripeKey = Constants.expoConfig?.extra?.stripekey;
  const [profileImage, setProfileImage] = useState("");
  const [id, setID] = useState("");
  const [accountType, setAccountType] = useState<accountType>("passenger");
  const [operatorAcc, setOperatorAcc] = useState(false);
  const [ownerAcc, setOwnerAcc] = useState(false);
  const [credits, setCredits] = useState(0);
  const [fName, setFName] = useState<string>("");
  const [lName, setLName] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [nic, setNIC] = useState<string>("");
  const [accountNo, setAccountNo] = useState<string>("");
  const [accHolderName, setAccHolderName] = useState<string>("f");
  const [bankName, setBankName] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("");
  const [ntcLicenseNo, setNTCLicenseNo] = useState<string>("");
  const [driverLicenseNo, setDriverLicenseNo] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [seatNos, setSeatNos] = useState<number[]>([]);
  const [discount, setDiscount] = useState(0);
  const [myTickets, setMyTickets] = useState<Map<string, Ticket> | undefined>();
  const [busScheduleDetails, setBusScheduleDetails] = useState<
    VehicleDetails[]
  >([]);
  const [myBuses, setMyBuses] = useState<Bus[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <AppContext.Provider
      value={{
        navigation,
        baseURL,
        apiKey,
        stripeKey,
        profileImage,
        setProfileImage,
        id,
        setID,
        accountType,
        setAccountType,
        operatorAcc,
        setOperatorAcc,
        ownerAcc,
        setOwnerAcc,
        credits,
        setCredits,
        fName,
        setFName,
        lName,
        setLName,
        phoneNo,
        setPhoneNo,
        email,
        setEmail,
        nic,
        setNIC,
        accountNo,
        setAccountNo,
        accHolderName,
        setAccHolderName,
        bankName,
        setBankName,
        branchName,
        setBranchName,
        ntcLicenseNo,
        setNTCLicenseNo,
        driverLicenseNo,
        setDriverLicenseNo,
        occupation,
        setOccupation,
        seatNos,
        setSeatNos,
        discount,
        setDiscount,
        busScheduleDetails,
        setBusScheduleDetails,
        myBuses,
        setMyBuses,
        myTickets,
        setMyTickets,
        messages,
        setMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("Error: App Context is empty");
  }
  return context;
};
