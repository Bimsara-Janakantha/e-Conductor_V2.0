export class Ticket {
  ticketNo: string;
  bookedDate?: Date;
  vehicalNo?: string;
  org?: string; // Organization
  type?: string; // eg. Luxury, Normal, Semi-Luxury
  routeNo?: string;
  route?: string; // Start - End
  departure?: Date; // time of departure
  from?: string;
  to?: string;
  fromT?: string; // Journey start time
  toT?: string; // Journey end time
  distance?: string;
  price?: string;
  discount?: string;
  unitPrice?: string;
  transID?: string;
  full?: string;
  half?: string;
  seatNos?: string[];
  status?: string;
  tracking?: boolean;
  cancel?: boolean;

  constructor(
    ticketNo: string,
    bookedDate: Date,
    vehicalNo: string,
    org: string,
    type: string,
    routeNo: string,
    route: string, // Start - End
    departure: Date, // time of departure
    from: string,
    to: string,
    fromT: string, // Journey start time
    toT: string, // Journey end time
    distance: string,
    price: string,
    discount: string,
    unitPrice: string,
    transID: string,
    full: string,
    half: string,
    seatNos: string[],
    status: string,
    tracking: boolean,
    cancel: boolean
  ) {
    this.ticketNo = ticketNo;
    this.bookedDate = bookedDate;
    this.vehicalNo = vehicalNo;
    this.org = org;
    this.type = type;
    this.routeNo = routeNo;
    this.route = route;
    this.departure = departure;
    this.from = from;
    this.to = to;
    this.fromT = fromT;
    this.toT = toT;
    this.distance = distance;
    this.price = price;
    this.discount = discount;
    this.unitPrice = unitPrice;
    this.transID = transID;
    this.full = full;
    this.half = half;
    this.seatNos = seatNos;
    this.status = status;
    this.tracking = tracking;
    this.cancel = cancel;
  }

  cancelTicket(): boolean {
    return true;
  }
}
