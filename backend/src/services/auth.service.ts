import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid email or password');

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new Error('Invalid email or password');

  const token = jwt.sign(
    { id: user.id, role: user.role }, 
    process.env.JWT_SECRET as string, 
    { expiresIn: '1d' }
  );

  // Remove password from the returned user object
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

// Helper just to create our first user for testing
export const setupAdminUser = async () => {
  const existingUser = await prisma.user.findFirst();
  if (existingUser) throw new Error('Admin user already exists');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  return prisma.user.create({
    data: { name: 'Admin', email: 'admin@instantmechanic.com', password: hashedPassword, role: 'ADMIN' },
    select: { id: true, name: true, email: true, role: true }
  });
};