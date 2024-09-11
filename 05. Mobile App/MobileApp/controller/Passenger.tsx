import { Bus } from "./Bus";
import { User } from "./User";
import { Ticket } from "./Ticket";


export class Passenger extends User {
  credits: number | null;
  tickets: Map<number, Ticket>;

  constructor(id: string, credits: number) {
    super(id);
    this.credits = credits;
    this.tickets = new Map();
  }

  // Implement the abstract method
  getDescription(): string {
    return `ProductID: ${this.id}, Price: $${this.credits?.toFixed(2)}`;
  }

  purchaseTicket(ticket: Ticket, bus: Bus): boolean {
    ticket.busID = bus.id;
    ticket.passengerID = this.id;
    let length = this.tickets.size;
    if (length <= 0) {
      this.tickets.set(1, ticket);
    } else {
      this.tickets.set(length + 1, ticket);
    }
    this.removeCredits(ticket.price);
    bus.reserveSeat(ticket.id, ticket.seat, ticket.price);
    return true;
  }

  addCredits(amount: number) {
    if (this.credits != null) {
      this.credits = this.credits + amount;
    }
  }

  removeCredits(amount: number) {
    if (this.credits != null) {
      this.credits = this.credits - amount;
    }
  }

  // Override the destroy method to include the credits property
  destroy(): void {
    super.destroy();
    this.credits = null;
  }
}
