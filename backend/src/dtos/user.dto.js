export const responseFromUser = ({ user }) => {
  return {
    userId: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
