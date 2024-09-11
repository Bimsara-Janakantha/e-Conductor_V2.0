import { User } from "./User";


export class Operator extends User {
  credits: number | null;
  seats: Map<string, number>; // Maps passenger ID to purchased ticket count

  constructor(id: string, credits: number) {
    super(id);
    this.credits = credits;
    this.seats = new Map();
  }

  // Implement the abstract method
  getDescription(): string {
    return `ProductID: ${this.id}, Price: $${this.credits?.toFixed(2)}`;
  }

  recordPurchase(passengerId: string): void {
    if (this.seats.has(passengerId)) {
      const currentCount = this.seats.get(passengerId)!;
      this.seats.set(passengerId, currentCount + 1);
    } else {
      this.seats.set(passengerId, 1);
    }
  }

  getseats(): Map<string, number> {
    return this.seats;
  }

  // Override the destroy method to include the credits property
  destroy(): void {
    super.destroy();
    this.credits = null;
  }
}
