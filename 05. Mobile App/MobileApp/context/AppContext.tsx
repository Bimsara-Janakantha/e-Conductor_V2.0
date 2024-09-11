import { Bus } from "@/controller/Bus";
import { Owner } from "@/controller/Owner";
import { Ticket } from "@/controller/Ticket";
import { Transaction } from "@/controller/Transaction";
import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

type grapData = {
  value: number;
  date: string;
  label?: string;
};

export type accountType = "Passenger" | "Operator" | "Owner";

interface AppContextProps {
  profileImage: string;
  setProfileImage: Dispatch<SetStateAction<string>>;
  id: string;
  setID: Dispatch<SetStateAction<string>>;
  accountType: string;
  setAccountType: Dispatch<SetStateAction<accountType>>;
  myAccTypes: Map<string, boolean>;
  fName: string;
  lName: string;
  phoneNo: string;
  nic: string;
  accountNo: string;
  accHolderName: string;
  bankName: string;
  branchName: string;
  nameOnLicense: string;
  ntcLicenseNo: string;
  driverLicenseNo: string;
  occupation: string;
  seatNo: number;
  setSeatNo: Dispatch<SetStateAction<number>>;
  seatStatus: string[];
  setSeatStatus: Dispatch<React.SetStateAction<any[]>>;
  busData: Bus[];
  myBuses: Bus[];
  myTickets: Map<string, Ticket>;
  setMyTickets: Dispatch<React.SetStateAction<Map<string, Ticket>>>;
  pasTransactions: Transaction[];
  income7: grapData[];
  income30: grapData[];
  incomeYear: grapData[];
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [profileImage, setProfileImage] = useState("");
  const [id, setID] = useState("1234ggfdg");
  const [accountType, setAccountType] = useState<accountType>("Passenger");
  const myAccTypes = new Map([
    ["Operator", false],
    ["Owner", true],
  ]);
  const fName = "Chamuditha";
  const lName = "Nawarathna";
  const phoneNo = "0767601948";
  const nic = "200109801854";
  const accountNo = "100234569817";
  const accHolderName = "C. Nawarathna";
  const bankName = "Commercial Bank";
  const branchName = "Balangoda";
  const nameOnLicense = "C. Nawarathna";
  const ntcLicenseNo = "D-980726";
  const driverLicenseNo = "12343423423";
  const occupation = "Driver and Conductor";
  const [seatNo, setSeatNo] = useState(0);
  const [seatStatus, setSeatStatus] = useState(Array(60).fill("Available"));

  /* Data for passenger account */

  const [myTickets, setMyTickets] = useState(
    new Map([
      ["a12345", new Ticket("a12345")],
      ["b12345", new Ticket("b12345")],
    ])
  );

  const busData = [
    new Bus(
      "srdtf234546",
      "NA-35678",
      "ads3546567",
      new Map([[1, "d-234466"]]),
      new Map([[1, "c-234466"]]),
      "Badulla",
      new Date(),
      "Colombo",
      new Date(),
      new Date(),
      new Map(),
      0.687879989,
      3.45466643431,
      new Owner("123abc", 1200)
    ),
    new Bus(
      "srdtf24509",
      "NA-35678",
      "ads3546567",
      new Map([[1, "d-234466"]]),
      new Map([[1, "c-234466"]]),
      "Colombo",
      new Date(),
      "Kandy",
      new Date(),
      new Date(),
      new Map(),
      2.687879989,
      5.45466643431,
      new Owner("123abc", 1200)
    ),
    new Bus(
      "s35hh34546",
      "NA-35678",
      "ads3546567",
      new Map([[1, "d-234466"]]),
      new Map([[1, "c-234466"]]),
      "Anuradapura",
      new Date(),
      "Hambantota",
      new Date(),
      new Date(),
      new Map(),
      3.4879989,
      9.45466643431,
      new Owner("123fgc", 8000)
    ),
    new Bus(
      "s35hh34546",
      "NA-35678",
      "ads3546567",
      new Map([[1, "d-234466"]]),
      new Map([[1, "c-234466"]]),
      "Anuradapura",
      new Date(),
      "Hambantota",
      new Date(),
      new Date(),
      new Map(),
      0.687879989,
      3.45466643431,
      new Owner("123fgc", 8000)
    ),
    new Bus(
      "s35hh34546",
      "NA-35678",
      "ads3546567",
      new Map([[1, "d-234466"]]),
      new Map([[1, "c-234466"]]),
      "Anuradapura",
      new Date(),
      "Hambantota",
      new Date(),
      new Date(),
      new Map(),
      0.687879989,
      3.45466643431,
      new Owner("123fgc", 8000)
    ),
  ];

  const pasTransactions = [
    new Transaction(
      "srdtf234546",
      "payment",
      120,
      new Bus(
        "s35hh34546",
        "NA-35678",
        "ads3546567",
        new Map([[1, "d-234466"]]),
        new Map([[1, "c-234466"]]),
        "Anuradapura",
        new Date(),
        "Hambantota",
        new Date(),
        new Date(),
        new Map(),
        0.687879989,
        3.45466643431,
        new Owner("123fgc", 8000)
      ),
      new Date()
    ),
    new Transaction(
      "srdtf234546",
      "recharge",
      190,
      new Bus(
        "s35hh34546",
        "NA-35678",
        "ads3546567",
        new Map([[1, "d-234466"]]),
        new Map([[1, "c-234466"]]),
        "Anuradapura",
        new Date(),
        "Hambantota",
        new Date(),
        new Date(),
        new Map(),
        0.687879989,
        3.45466643431,
        new Owner("123fgc", 8000)
      ),
      new Date()
    ),
    new Transaction(
      "srdtf234546",
      "payment",
      1000,
      new Bus(
        "s35hh34546",
        "NA-35678",
        "ads3546567",
        new Map([[1, "d-234466"]]),
        new Map([[1, "c-234466"]]),
        "Anuradapura",
        new Date(),
        "Hambantota",
        new Date(),
        new Date(),
        new Map(),
        0.687879989,
        3.45466643431,
        new Owner("123fgc", 8000)
      ),
      new Date()
    ),
    new Transaction(
      "srdtf234546",
      "return",
      500,
      new Bus(
        "s35hh34546",
        "NA-35678",
        "ads3546567",
        new Map([[1, "d-234466"]]),
        new Map([[1, "c-234466"]]),
        "Anuradapura",
        new Date(),
        "Hambantota",
        new Date(),
        new Date(),
        new Map(),
        0.687879989,
        3.45466643431,
        new Owner("123fgc", 8000)
      ),
      new Date()
    ),
    new Transaction(
      "srdtf234546",
      "payment",
      125.5,
      new Bus(
        "s35hh34546",
        "NA-35678",
        "ads3546567",
        new Map([[1, "d-234466"]]),
        new Map([[1, "c-234466"]]),
        "Anuradapura",
        new Date(),
        "Hambantota",
        new Date(),
        new Date(),
        new Map(),
        0.687879989,
        3.45466643431,
        new Owner("123fgc", 8000)
      ),
      new Date()
    ),
  ];

  /* Data for bus operator account */

  const [bookedTickets, setBookedTickets] = useState(
    new Map([
      ["9015776", new Ticket("9015776")],
      ["6578799", new Ticket("6578799")],
    ])
  );

  /* Data for bus owner account */

  const myBuses = [
    new Bus(
      "srdtf234546",
      "NA-35678",
      "ads3546567",
      new Map([[1, "d-234466"]]),
      new Map([[1, "c-234466"]]),
      "Badulla",
      new Date(),
      "Colombo",
      new Date(),
      new Date(),
      new Map(),
      6.93548,
      79.84868,
      new Owner("123abc", 1200)
    ),
    new Bus(
      "srdtf24509",
      "NA-35678",
      "ads3546567",
      new Map([[1, "d-234466"]]),
      new Map([[1, "c-234466"]]),
      "Colombo",
      new Date(),
      "Kandy",
      new Date(),
      new Date(),
      new Map(),
      9.66845,
      80.00742,
      new Owner("123abc", 1200)
    ),
    new Bus(
      "s35hh34546",
      "NA-35678",
      "ads3546567",
      new Map([[1, "d-234466"]]),
      new Map([[1, "c-234466"]]),
      "Anuradapura",
      new Date(),
      "Hambantota",
      new Date(),
      new Date(),
      new Map(),
      6.0461,
      80.2103,
      new Owner("123fgc", 8000)
    ),
    new Bus(
      "s35hh34546",
      "NA-35678",
      "ads3546567",
      new Map([[1, "d-234466"]]),
      new Map([[1, "c-234466"]]),
      "Anuradapura",
      new Date(),
      "Hambantota",
      new Date(),
      new Date(),
      new Map(),
      7.7102,
      81.6924,
      new Owner("123fgc", 8000)
    ),
    new Bus(
      "s35hh34546",
      "NA-35678",
      "ads3546567",
      new Map([[1, "d-234466"]]),
      new Map([[1, "c-234466"]]),
      "Anuradapura",
      new Date(),
      "Hambantota",
      new Date(),
      new Date(),
      new Map(),
      7.2906,
      80.6336,
      new Owner("123fgc", 8000)
    ),
  ];

  const income7 = [
    {
      value: 12600,
      date: "11 Apr 2022",
      label: "11 Apr",
    },
    {
      value: 25000,
      date: "12 Apr 2022",
      label: "12 Apr",
    },
    {
      value: 8950,
      date: "13 Apr 2022",
      label: "13 Apr",
    },
    {
      value: 23700,
      date: "14 Apr 2022",
      label: "14 Apr",
    },
    {
      value: 30900,
      date: "15 Apr 2022",
      label: "15 Apr",
    },
    {
      value: 16300,
      date: "16 Apr 2022",
      label: "16 Apr",
    },
  ];

  const income30 = [
    {
      value: 15100,
      date: "10 Apr 2022",
      label: "10 Apr",
    },
    {
      value: 11100,
      date: "11 Apr 2022",
    },
    {
      value: 19000,
      date: "12 Apr 2022",
    },
    {
      value: 15100,
      date: "13 Apr 2022",
    },
    {
      value: 14100,
      date: "14 Apr 2022",
    },
    {
      value: 15100,
      date: "15 Apr 2022",
      label: "15 Apr",
    },
    {
      value: 11100,
      date: "16 Apr 2022",
    },
    {
      value: 19000,
      date: "17 Apr 2022",
    },
    {
      value: 20100,
      date: "18 Apr 2022",
    },
    {
      value: 14100,
      date: "19 Apr 2022",
    },
    {
      value: 15100,
      date: "20 Apr 2022",
      label: "20 Apr",
    },
    {
      value: 11100,
      date: "21 Apr 2022",
    },
    {
      value: 19000,
      date: "22 Apr 2022",
    },
    {
      value: 30100,
      date: "23 Apr 2022",
    },
    {
      value: 14100,
      date: "24 Apr 2022",
    },
    {
      value: 15100,
      date: "25 Apr 2022",
      label: "25 Apr",
    },
    {
      value: 11100,
      date: "26 Apr 2022",
    },
    {
      value: 28000,
      date: "26 Apr 2022",
    },
    {
      value: 12100,
      date: "27 Apr 2022",
    },
    {
      value: 9100,
      date: "27 Apr 2022",
    },
    {
      value: 8100,
      date: "28 Apr 2022",
      label: "28 Apr",
    },
    {
      value: 23100,
      date: "29 Apr 2022",
    },
    {
      value: 13000,
      date: "30 Apr 2022",
    },
    {
      value: 27100,
      date: "31 Apr 2022",
    },
    {
      value: 14100,
      date: "1 May 2022",
    },
    {
      value: 12100,
      date: "2 May 2022",
      label: "2 May",
    },
    {
      value: 1100,
      date: "3 May 2022",
    },
    {
      value: 19000,
      date: "4 May 2022",
    },
    {
      value: 23100,
      date: "5 May 2022",
    },
    {
      value: 14100,
      date: "6 May 2022",
    },
    {
      value: 16100,
      date: "7 May 2022",
      label: "7 May",
    },
    {
      value: 7100,
      date: "8 May 2022",
    },
    {
      value: 19000,
      date: "9 May 2022",
    },
    {
      value: 21100,
      date: "10 May 2022",
    },
  ];

  const incomeYear = [
    {
      value: 1260000,
      date: "11 Jan 2022",
      label: "Jan",
    },
    {
      value: 2500000,
      date: "12 Feb 2022",
      label: "Feb",
    },
    {
      value: 895000,
      date: "13 Mar 2022",
      label: "Mar",
    },
    {
      value: 2370000,
      date: "14 Apr 2022",
      label: "Apr",
    },
    {
      value: 3090000,
      date: "15 May 2022",
      label: "May",
    },
    {
      value: 1430000,
      date: "16 Jun 2022",
      label: "Jun",
    },
    {
      value: 1630000,
      date: "16 Jul 2022",
      label: "Jul",
    },
    {
      value: 5130000,
      date: "16 Aug 2022",
      label: "Aug",
    },
    {
      value: 7630000,
      date: "16 Sep 2022",
      label: "Sep",
    },
    {
      value: 1130000,
      date: "16 Oct 2022",
      label: "Oct",
    },
    {
      value: 2630000,
      date: "16 Nov 2022",
      label: "Nov",
    },
    {
      value: 8630000,
      date: "16 Dec 2022",
      label: "Dec",
    },
  ];

  return (
    <AppContext.Provider
      value={{
        profileImage,
        setProfileImage,
        id,
        setID,
        accountType,
        setAccountType,
        myAccTypes,
        fName,
        lName,
        phoneNo,
        nic,
        accountNo,
        accHolderName,
        bankName,
        branchName,
        nameOnLicense,
        ntcLicenseNo,
        driverLicenseNo,
        occupation,
        seatNo,
        setSeatNo,
        seatStatus,
        setSeatStatus,
        busData,
        myBuses,
        myTickets,
        setMyTickets,
        pasTransactions,
        income7,
        income30,
        incomeYear,
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
