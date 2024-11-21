import jwt, { JwtPayload } from 'jsonwebtoken';

const secret = 'mysecretsshhhhh';
const expiration = '2h';

interface TokenPayload extends JwtPayload {
  data: {
    _id: string;
    email: string;
    username: string;
  };
}

// context.ts
export interface MyContext {
  user: {
    _id: string;
    email: string;
    username: string;
  } | null;
}

const authMiddleware = (req: any) => {
  let token = req.headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    token = token.substring(7, token.length).trim();
  }

  if (!token) {
    return { user: null };
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration }) as TokenPayload;
    return { user: data };
  } catch {
    console.log('Invalid token');
    return { user: null };
  }
};

export default authMiddleware;