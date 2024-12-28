
export abstract class User {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  // Abstract method to be implemented by derived classes
  abstract getDescription(): string;

  // Concrete method to destroy the object
  destroy(): void {}
}


