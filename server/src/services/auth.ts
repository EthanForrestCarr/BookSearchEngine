import jwt from 'jsonwebtoken';

const secret = 'mysecretsshhhhh';
const expiration = '2h';

// Function to extract and verify the token for GraphQL
const authMiddleware = (req: any) => {
  let token = req.headers.authorization || '';

  // Check for Bearer token and extract it
  if (token.startsWith('Bearer ')) {
    token = token.substring(7, token.length).trim();
  }

  if (!token) {
    return { user: null };
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    return { user: data };
  } catch {
    console.log('Invalid token');
    return { user: null };
  }
};

export default authMiddleware;