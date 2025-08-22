export interface Client {
  id: number;
  attributes: {
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    birthDate?: string;
    observations?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Process {
  id: number;
  attributes: {
    processNumber: string;
    title: string;
    description?: string;
    status: "active" | "archived" | "completed";
    startDate: string;
    completionDate?: string;
    value?: number;
    client: {
      data: Client;
    };
    documents?: {
      data: Document[];
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface Document {
  id: number;
  attributes: {
    title: string;
    description?: string;
    file: {
      data: {
        id: number;
        attributes: {
          name: string;
          url: string;
          size: number;
          ext: string;
        };
      };
    };
    process?: {
      data: Process;
    };
    uploadDate: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Schedule {
  id: number;
  attributes: {
    title: string;
    description?: string;
    dateTime: string;
    location?: string;
    client?: {
      data: Client;
    };
    process?: {
      data: Process;
    };
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
}
