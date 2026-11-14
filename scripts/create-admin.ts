/**
 * Cria o primeiro usuário ADMIN no Auth + Firestore.
 *
 * Uso (emuladores):
 *   $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
 *   $env:FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
 *   npm run create-admin
 *
 * Uso (produção): configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL,
 * FIREBASE_PRIVATE_KEY e rode o mesmo comando.
 */
import "./load-env";
import { getAdminAuth, getAdminDb } from "../src/lib/firebase/admin";

const email = process.env.ADMIN_EMAIL || "admin@locadora.com";
const password = process.env.ADMIN_PASSWORD || "Admin@123";
const nome = process.env.ADMIN_NOME || "Administrador";

async function main() {
  process.env.FIREBASE_PROJECT_ID ||=
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-locadora";

  const auth = getAdminAuth();
  const db = getAdminDb();

  let user;
  try {
    user = await auth.getUserByEmail(email);
    console.log(`Usuário Auth já existe: ${user.uid}`);
  } catch {
    user = await auth.createUser({
      email,
      password,
      displayName: nome,
      emailVerified: true,
    });
    console.log(`Usuário Auth criado: ${user.uid}`);
  }

  await auth.setCustomUserClaims(user.uid, { perfil: "ADMIN" });

  const now = new Date();
  await db.collection("users").doc(user.uid).set(
    {
      nome,
      email,
      perfil: "ADMIN",
      ativo: true,
      createdAt: now,
      updatedAt: now,
      createdBy: user.uid,
    },
    { merge: true }
  );

  console.log("Perfil ADMIN gravado no Firestore.");
  console.log(`Login: ${email} / ${password}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
