export const useUserId = (id: string): { username: string; server: string } => {
  const s = id.split("@", 1);
  return {
    username: s[0] as string,
    server: s[1] || "account.gravitalia.com",
  };
};
