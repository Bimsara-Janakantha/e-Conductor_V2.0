import { Owner } from "./Owner";

export class Bus {
  id: string;
  regNo: string;
  ntcNo: string;
  ntcDriver: Map<number, string>;
  ntcConductor: Map<number, string>;
  departure: string;
  departureTime: Date;
  terminal: string;
  terminalTime: Date;
  returnTime: Date;
  seats: Map<number, string>;
  latitude: number;
  longitude: number;
  owner: Owner;

  constructor(
    id: string,
    regNo: string,
    ntcNo: string,
    ntcDriver: Map<number, string>,
    ntcConductor: Map<number, string>,
    departure: string,
    departureTime: Date,
    terminal: string,
    terminalTime: Date,
    returnTime: Date,
    seats: Map<number, string>,
    latitude: number,
    longitude: number, 
    owner: Owner
  ) {
    this.id = id;
    this.regNo = regNo;
    this.ntcNo = ntcNo;
    this.ntcDriver = ntcDriver;
    this.ntcConductor = ntcConductor;
    this.departure = departure;
    this.departureTime = departureTime;
    this.terminal = terminal;
    this.terminalTime = terminalTime;
    this.returnTime = returnTime;
    this.seats = seats;
    this.latitude = latitude;
    this.longitude = longitude;
    this.owner = new Owner("asdasdf", 134243);
  }

  reserveSeat(ticketID: string, seatNo: number, price: number): string {
    if (this.seats.has(seatNo)) {
      if (this.seats.get(seatNo) != "") {
        this.owner.addCredits(price);
        this.seats.set(seatNo, ticketID);
        // send notifications
        return "Done";
      }
      return "Seat is already reserved";
    } else {
      return "Seat is not available";
    }
  }

  cancelReservation(seatNo: number, price: number): boolean {
    this.owner.removeCredits(price);
    this.seats.set(seatNo, "");
    // send notifications
    return true;
  }
}
