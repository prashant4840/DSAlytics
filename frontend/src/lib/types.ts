export interface User {
  name: string;
  email: string;
  password: string;
  usernames: {
    leetcode?: string;
    gfg?: string;
    codechef?: string;
    interviewbit?: string;
    codeforces?: string;
  };
  pfp?: string;
}

export interface Platform {
  id: keyof User["usernames"];
  name: string;
  logo: string;
}
