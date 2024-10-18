export type User = {
  id: string;
  name: string;
  age: number;
  hobbies: Array<Hobby>;
};

export type Hobby = string;
