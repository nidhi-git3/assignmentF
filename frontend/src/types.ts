export type Project = {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
};

export type Client = {
  _id: string;
  name: string;
  designation: string;
  description: string;
  imageUrl: string;
};

export type Contact = {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  city: string;
};

export type Subscription = {
  _id: string;
  email: string;
};


