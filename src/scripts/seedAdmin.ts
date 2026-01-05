import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    console.log("**** Admin Seeding State ****");
    const adminData = {
      name: "Admin",
      email: "admin@test2.com",
      role: UserRole.ADMIN,
      password: "password1234",
      emailVerified: true
    };
    console.log("** Checking User Exist or not");
    // check user existing user or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exist !");
    }

    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Origin": "http://localhost:4000"
         },
        body: JSON.stringify(adminData),
      }
    );

    if(signUpAdmin.ok){
        console.log("**** Admin create **** ");
        await prisma.user.update({
            where:{
                email: adminData.email
            },
            data:{
                emailVerified: true
            }
        })
        console.log("**** Email Verify status update");
    }
  } catch (error) {
    console.error(error);
  }
}

seedAdmin();
