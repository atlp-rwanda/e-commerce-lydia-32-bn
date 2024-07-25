interface User {
  id: string;
  username: string,
  room: string;
}

const users: User[] = [];

function userJoin(id: string,username: string, room: string): User {
  const user: User = { id, username, room };

  users.push(user);

  return user;
}
function getCurrentUser(id: string): User | undefined {
  return users.find((user) => user.id === id);
}

function userLeave(id: string): User | undefined {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room: string): User[] {
  return users.filter((user) => user.room === room);
}

export { userJoin, getCurrentUser, userLeave, getRoomUsers };
