
export class Ticket {
  id: string;
  busID: string;
  passengerID: string;
  status: string;
  seat: number;
  title: string;
  busclass: string;
  routeNo: string;
  bookedTime: Date;
  duration: string;
  price: number;
  departure: string;
  departureTime: Date;
  terminal: string;
  terminalTime: Date;
  startLocation: string;
  endLocation: string;

  constructor(
    id: string = "123456789",
    busID: string = "adfasdfs",
    passengerID: string = "asdffas",
    status: string = "Valid",
    seat: number = 5,
    title: string = "SLTB",
    busclass: string = "Normal",
    routeNo: string = "222",
    bookedTime: Date = new Date(),
    duration: string = "2h 40m",
    price: number = 700.0,
    departure: string = "Colombo",
    departureTime: Date = new Date(),
    terminal: string = "Kandy",
    terminalTime: Date = new Date(),
    startLocation: string = "Colombo",
    endLocation: string = "Peradeniya"
  ) {
    this.id = id;
    this.busID = busID;
    this.passengerID = passengerID;
    this.status = status;
    this.seat = seat;
    this.title = title;
    this.busclass = busclass;
    this.routeNo = routeNo;
    this.bookedTime = bookedTime;
    this.duration = duration;
    this.price = price;
    this.departure = departure;
    this.departureTime = departureTime;
    this.terminal = terminal;
    this.terminalTime = terminalTime;
    this.startLocation = startLocation;
    this.endLocation = endLocation;
  }

  cancelTicket(): boolean {
    return true;
  }
}
