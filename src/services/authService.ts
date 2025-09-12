type User = {
  id: string;
  username: string;
  password: string; // In real app, passwords should be hashed and stored securely
};

let users: User[] = [];

export const authService = {
  signup: (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      const existingUser = users.find((u) => u.username === username);
      if (existingUser) {
        reject(new Error('Username already exists'));
      } else {
        const newUser = { id: Date.now().toString(), username, password };
        users.push(newUser);
        resolve(newUser);
      }
    });
  },

  login: (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      const user = users.find((u) => u.username === username && u.password === password);
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Invalid username or password'));
      }
    });
  },
};
