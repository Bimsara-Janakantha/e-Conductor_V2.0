import { User } from "./User";


export class Owner extends User {
  credits: number | null;

  constructor(id: string, credits: number) {
    super(id);
    this.credits = credits;
  }

  // Implement the abstract method
  getDescription(): string {
    return `ProductID: ${this.id}, Price: $${this.credits?.toFixed(2)}`;
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
