import { PrismaClient, Role, MemberStatus } from '@prisma/client';
import { auth } from '../src/lib/auth.js';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    try {
        // const existingAdmin = await prisma.user.findFirst({
        //     where: {
        //         role: Role.ADMIN
        //     }
        // });

        // if (existingAdmin) {
        //     console.log('⚠️  Admin user already exists, skipping creation');
        //     return;
        // }

        const adminMember = await prisma.member.create({
            data: {
                name: 'System Administrator',
                role: 'Administrator',
                year: new Date(),
                status: MemberStatus.ACTIVE
            }
        });

        console.log('✅ Created admin member profile');

        const signUpResult = await auth.api.signUpEmail({
            body: {
                name: "Admin",
                email: 'admin@devsphere.com',
                password: 'admin123!'
            }
        });

        console.log('✅ Created admin user with BetterAuth');

        if (signUpResult && signUpResult.user) {
            await prisma.user.update({
                where: {
                    id: signUpResult.user.id
                },
                data: {
                    role: Role.ADMIN,
                    memberId: adminMember.id,
                    emailVerified: true
                }
            });

            console.log('✅ Updated user with admin role and member link');
        }

        console.log('✅ Admin setup completed successfully');
        console.log('📧 Admin email: admin@devsphere.com');
        console.log('🔑 Admin password: admin123!');
        console.log('⚠️  Please change the default password after first login!');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('🌱 Seeding completed');
    });
