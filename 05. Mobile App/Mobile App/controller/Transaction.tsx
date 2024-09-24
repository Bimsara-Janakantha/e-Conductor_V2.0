import { Bus } from "./Bus";


export class Transaction {
  id: string;
  type: 'payment' | 'recharge' | 'return';
  amount: number;
  bus: Bus;
  date: Date;

  constructor(id: string, type: 'payment' | 'recharge' | 'return', amount: number, bus: Bus, date: Date) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.bus = bus;
    this.date = date;
  }
}
