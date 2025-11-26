/**
 * Create initial admin user
 * Usage: npx tsx scripts/create-admin.ts
 */
import { createAdminUser } from '../src/lib/auth';

async function main() {
  console.log('🔧 Creating initial admin user...\n');

  const email = 'admin@cycleparadise.lk';
  const firstName = 'Admin';
  const lastName = 'User';
  const password = 'Admin123!'; // Change this after first login

  const user = await createAdminUser(email, firstName, lastName, password);

  if (user) {
    console.log('✅ Admin user created successfully!\n');
    console.log('📧 Email:', email);
    console.log('👤 Name:', `${firstName} ${lastName}`);
    console.log('🔑 Password:', password);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('🔗 Login at: http://localhost:4321/admin/login\n');
  } else {
    console.error('❌ Failed to create admin user');
    console.error('Make sure DATABASE_URL is set and database is running');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
